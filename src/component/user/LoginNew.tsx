import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import cookie from "react-cookies";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [isLoginFail, setIsLoginFail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookie.load("token");
    if (token !== undefined) {
      navigate("/mypage");
    }

    const timer = setTimeout(() => {
      setIsLoginFail(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [isLoginFail]);

  const onHandleData = (response: any) => {
    setCookie("token", response["token"]);
    setCookie("name", response["name"]);
    setCookie("memberId", response["memberId"]);
    setCookie("role", response["role"]);
    setCookie("userId", response["userId"]);
    navigate("/mypage");
  };

  const setCookie = (cookieName: string, cookieValue: String) => {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 60);
    cookie.save(cookieName, cookieValue, {
      path: "/",
      expires,
    });
  };

  const onSignIn = async () => {
    try {
      const data = {
        userId: userId,
        userPw: userPw,
      };
      await fetch(`/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errorCode === 0) {
            onHandleData(res.resultData);
          } else {
            setIsLoginFail(true);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const saveUserId = (event: any) => {
    setUserId(event.target.value);
  };

  const saveUserPw = (event: any) => {
    setUserPw(event.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 lg:p-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight mb-5 sm:mb-8 lg:mb-10">
          JUNGS
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSignIn();
          }}
          className="space-y-4 sm:space-y-5 lg:space-y-6"
        >
          <div>
            <label className="text-sm sm:text-base text-gray-600 mb-1 block">
              아이디
            </label>
            <input
              type="text"
              placeholder="ID 입력"
              value={userId}
              onChange={saveUserId}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white transition-all duration-200"
            />
          </div>

          <div>
            <label className="text-sm sm:text-base text-gray-600 mb-1 block">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={userPw}
              onChange={saveUserPw}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-300 to-orange-300 hover:from-rose-400 hover:to-orange-400 text-white font-semibold sm:text-lg rounded-xl py-2 sm:py-3 mt-2 shadow-md transition-all duration-300"
          >
            로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 mt-5 sm:mt-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
            또는 간편 로그인
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 카카오 로그인 — 카카오 디자인 가이드 원형 아이콘 */}
        <div className="flex justify-center mt-4">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => {
                const redirectUri = `${window.location.protocol}//${
                  window.location.hostname
                }${window.location.port ? `:${window.location.port}` : ""}`;
                window.location.href = `${process.env.REACT_APP_AUTH_SERVER}/oauth/kakao?redirectUri=${redirectUri}`;
              }}
              className="flex items-center justify-center transition-opacity duration-200 active:opacity-80"
              style={{
                backgroundColor: "#FEE500",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#000000"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 3C6.477 3 2 6.597 2 11c0 2.775 1.638 5.206 4.1 6.652l-.9 3.568a.3.3 0 0 0 .462.322l4.347-2.903C10.63 18.877 11.307 19 12 19c5.523 0 10-3.597 10-8S17.523 3 12 3z" />
              </svg>
            </button>
            <span className="text-xs text-gray-500">카카오 로그인</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mt-5 sm:mt-6">
          <p className="text-center text-sm sm:text-base text-gray-500">
            계정이 없으신가요?{" "}
            <Link to="/register" className="text-indigo-600 font-medium">
              회원가입
            </Link>
          </p>

          <p className="text-center text-sm sm:text-base text-gray-500">
            비밀번호를 잊으셨나요?{" "}
            <Link to="/reset/password" className="text-indigo-600 font-medium">
              비밀번호 찾기
            </Link>
          </p>
        </div>

        {isLoginFail && (
          <p className="text-red-500 text-sm sm:text-base mt-4 text-center">
            로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
