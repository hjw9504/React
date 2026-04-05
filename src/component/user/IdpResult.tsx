import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import cookie from "react-cookies";

export default function IdpResult() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("로그인 처리 중...");

  const setCookie = (cookieName: string, cookieValue: string) => {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 60);
    cookie.save(cookieName, cookieValue, {path: "/", expires});
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idpToken = params.get("idp_token");
    const idpType = params.get("idp_type");
    const accessToken =
      params.get("access_token") || cookie.load("accessToken") || "";

    if (!idpToken || !idpType) {
      navigate("/login");
      return;
    }

    handleIdpLogin(idpToken, idpType);
  }, []);

  const handleIdpLogin = async (
    idp_token: string,
    idpType: string,
  ) => {
    const body = JSON.stringify({idpType, idp_token});
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    try {
      // 1. 가입 여부 확인
      const checkRes = await fetch(`/api/oauth/check/idp/register`, {
        method: "POST",
        headers,
        body,
      });
      const checkData = await checkRes.json();

      // 2. 미가입이면 약관 동의 페이지로 이동
      if (checkData.result_data === false) {
        sessionStorage.setItem(
          "idp_pending",
          JSON.stringify({idp_token, idpType})
        );
        navigate("/terms?from=idp");
        return;
      }

      // 3. 로그인
      setStatus("로그인 중...");
      const loginRes = await fetch(`/api/user/idp/login`, {
        method: "POST",
        headers,
        body,
      });
      const loginData = await loginRes.json();

      if (loginData.error_code === 0) {
        const user = loginData.result_data;
        setCookie("accessToken", user.access_token);
        setCookie("refreshToken", user.refresh_token);
        setCookie("name", user.name);
        setCookie("memberId", user.member_id);
        setCookie("role", user.role);
        setCookie("userId", user.user_id);
        window.location.href = "/mypage";
      } else {
        setStatus("로그인에 실패했습니다.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error("IdpResult error:", err);
      setStatus("오류가 발생했습니다.");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-4">
        <svg
          className="animate-spin w-10 h-10 text-orange-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-gray-600 font-medium">{status}</p>
      </div>
    </div>
  );
}
