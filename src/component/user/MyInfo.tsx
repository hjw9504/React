import {Link, Navigate, useNavigate} from "react-router-dom";
import {Button} from "@material-tailwind/react";
import {useEffect, useLayoutEffect, useState} from "react";
import cookie from "react-cookies";
import Headers from "../utils/Headers";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [nickName, setNickName] = useState("");
  const [isExist, setIsExist] = useState(false);
  const [user, setUser] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    nickName: "",
    registerTime: "",
    recentLoginTime: "",
    role: "",
  });
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {}, []);

  const onHandleData = (response: any) => {
    alert("Register Success!");
    navigate("/login");
  };

  const onChangeNickName = (e: any) => {
    setNickName(e.target.value);
  };

  const onChangeNickNameToServer = () => {
    const data = {
      memberId: cookie.load("memberId"),
      userId: cookie.load("userId"),
      nickName: nickName,
    };
    fetch(`/update/nickname`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: cookie.load("token"),
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errorCode === 200) {
          alert("NickName Updated");
        }
      });
  };

  const getUserInfo = () => {
    fetch(`/user/info?memberId=${cookie.load("memberId")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: cookie.load("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.resultData) {
          setUser(res.resultData[0]);
          setNickName(res.resultData[0].nickName);
        } else {
          alert("Wrong User Id");
        }
      });
  };

  const goSignIn = () => {
    navigate("/login");
  };

  const goMyPage = () => {
    navigate("/mypage");
  };

  return (
    <>
      <Headers />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            My Info
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="userId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ID
              </label>
            </div>
            <div className="flex mt-2 my-2">
              <input
                id="userId"
                value={user.userId || ""}
                name="userId"
                type="text"
                required
                disabled={true}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="userId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
            </div>
            <div className="flex mt-2 my-2">
              <input
                id="email"
                value={user.email || ""}
                name="email"
                type="text"
                required
                disabled={true}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="nickName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              NickName
            </label>
          </div>
          <div className="flex mt-2 my-2">
            <input
              id="nickName"
              value={nickName || ""}
              onChange={onChangeNickName}
              name="nickName"
              type="text"
              required
              className="block w-[70%] rounded-md border-0 mr-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <button
              onClick={onChangeNickNameToServer}
              className="flex w-[30%] justify-center items-center rounded-md bg-indigo-600 px-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Change NickName
            </button>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="userId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
              </label>
            </div>
            <div className="flex mt-2 my-2">
              <input
                id="phoneNumber"
                value={user.phone || "Not Registered"}
                name="phoneNumber"
                type="text"
                required
                disabled={true}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="userId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Register Time
              </label>
            </div>
            <div className="flex mt-2 my-2">
              <input
                id="registerTime"
                value={user.registerTime || ""}
                name="registerTime"
                type="text"
                required
                disabled={true}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="userId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Role
              </label>
            </div>
            <div className="flex mt-2 my-2">
              <input
                id="registerTime"
                value={user.role || ""}
                name="registerTime"
                type="text"
                required
                disabled={true}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="pt-5 flex justify-center">
            <button
              onClick={goMyPage}
              className="w-[160px] justify-center rounded-md bg-indigo-600 py-1.5 mr-10 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              My Page
            </button>
            <button
              onClick={goSignIn}
              className="w-[160px] justify-center rounded-md bg-indigo-600 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
