import {useEffect, useLayoutEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import cookie from "react-cookies";
import Headers from "../utils/HeadersNew";

interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  nickName: string;
  registerTime: string;
  recentLoginTime: string;
  role: string;
}

export default function Home() {
  const [nickName, setNickName] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUserInfo();
  }, []);

  const UserInfoField = ({
    label,
    value,
    disabled = true,
  }: {
    label: string;
    value: string;
    disabled?: boolean;
  }) => (
    <div className="my-2">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <input
        value={value || ""}
        disabled={disabled}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                   shadow-sm ring-1 ring-inset ring-gray-300 
                   placeholder:text-gray-400 focus:ring-2 
                   focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>
  );

  const getUserInfo = async () => {
    try {
      const res = await fetch(
        `/user/info?memberId=${cookie.load("memberId")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: cookie.load("token"),
          },
        }
      );
      const data = await res.json();

      if (data.resultData) {
        setUser(data.resultData[0]);
        setNickName(data.resultData[0].nickName);
      } else {
        alert("Wrong User Id");
      }
    } catch (err) {
      console.error("getUserInfo error:", err);
    }
  };

  const onChangeNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value);
  };

  const onChangeNickNameToServer = async () => {
    try {
      const data = {
        memberId: cookie.load("memberId"),
        userId: cookie.load("userId"),
        nickName,
      };
      const res = await fetch(`/update/nickname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: cookie.load("token"),
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.errorCode === 200) {
        alert("NickName Updated");
      }
    } catch (err) {
      console.error("update nickname error:", err);
    }
  };

  const goSignIn = () => navigate("/login");
  const goMyPage = () => navigate("/mypage");

  return (
    <>
      <Headers />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {user && (
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <UserInfoField label="ID" value={user.userId} />
            <UserInfoField label="Email" value={user.email} />

            {/* NickName 수정 가능 */}
            <div className="my-2">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                NickName
              </label>
              <div className="flex mt-2">
                <input
                  id="nickName"
                  value={nickName}
                  onChange={onChangeNickName}
                  className="block w-[70%] rounded-md border-0 mr-3 py-1.5 text-gray-900 
                             shadow-sm ring-1 ring-inset ring-gray-300 
                             focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  onClick={onChangeNickNameToServer}
                  className="flex w-[30%] justify-center items-center rounded-md bg-indigo-600 
                             px-3 text-sm font-semibold leading-6 text-white shadow-sm 
                             hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
                             focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Change
                </button>
              </div>
            </div>

            <UserInfoField
              label="Phone Number"
              value={user.phone || "Not Registered"}
            />
            <UserInfoField label="Register Time" value={user.registerTime} />
            <UserInfoField label="Role" value={user.role} />

            {/* 버튼 영역 */}
            <div className="pt-5 flex justify-center">
              <button
                onClick={goMyPage}
                className="w-[160px] justify-center rounded-md bg-indigo-600 py-1.5 mr-10 
                           text-sm font-semibold leading-6 text-white shadow-sm 
                           hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
                           focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                My Page
              </button>
              <button
                onClick={goSignIn}
                className="w-[160px] justify-center rounded-md bg-indigo-600 py-1.5 
                           text-sm font-semibold leading-6 text-white shadow-sm 
                           hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
                           focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
