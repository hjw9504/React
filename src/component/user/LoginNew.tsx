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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 lg:p-12">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-5 sm:mb-8 lg:mb-10">
          로그인
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
            onClick={onSignIn}
            className="w-full bg-gradient-to-r from-rose-300 to-orange-300 hover:from-rose-400 hover:to-orange-400 text-white font-semibold sm:text-lg rounded-xl py-2 sm:py-3 mt-2 shadow-md transition-all duration-300"
          >
            로그인
          </button>
        </form>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mt-6 sm:mt-8">
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
