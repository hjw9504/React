import {useEffect, useLayoutEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import cookie from "react-cookies";
import Alert from "../utils/Alert";

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
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign In
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ID
            </label>
            <div className="mt-2 my-2">
              <input
                id="userId"
                name="userId"
                onChange={saveUserId}
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="/"
                  onClick={resetPassword}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Change password?
                </a>
              </div>
            </div>
            <div className="mt-2 my-5">
              <input
                id="password"
                name="password"
                onChange={saveUserPw}
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            {isLoginFail === true ? (
              <Alert alertMessage={"Login Fail"} />
            ) : null}
          </div>
          <div>
            <button
              onClick={onSignIn}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
