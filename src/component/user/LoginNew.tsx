import {useEffect, useLayoutEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import cookie from "react-cookies";
import Alert from "../utils/Alert";
import {motion} from "framer-motion";

export default function Login() {
  const [data, setData] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [isLoginFail, setIsLoginFail] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {}, []);

  useEffect(() => {
    // check login
    const token = cookie.load("token");
    if (token !== undefined) {
      navigate("/mypage");
    }

    let timer = setTimeout(() => {
      setIsLoginFail(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [isLoginFail]);

  const onHandleData = (response: any) => {
    console.log("Login Success: ", response);
    setData(response);
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
      // secure : true,
      // httpOnly : true
    });
  };

  const onSignIn = async () => {
    try {
      const data = {
        userId: userId,
        userPw: userPw,
      };
      await fetch(`/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errorCode === 200) {
            onHandleData(res.resultData);
          } else {
            setIsLoginFail(true);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const resetPassword = () => {
    navigate("/reset/password");
  };

  const saveUserId = (event: any) => {
    setUserId(event.target.value);
  };

  const saveUserPw = (event: any) => {
    setUserPw(event.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          로그인
        </h1>

        <form onSubmit={onSignIn} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">아이디</label>
            <input
              type="text"
              placeholder="ID 입력"
              value={userId}
              onChange={saveUserId}
              required
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={userPw}
              onChange={saveUserPw}
              required
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={onSignIn}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 mt-2 transition"
          >
            로그인
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{" "}
          <Link to="/register" className="text-indigo-600 font-medium">
            회원가입
          </Link>
        </p>

        {isLoginFail && (
          <p className="text-red-500 text-sm mt-2">
            로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
