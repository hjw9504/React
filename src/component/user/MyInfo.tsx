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

      if (result.errorCode === 0) {
        alert("NickName Updated");
      } else if (result.errorCode === 106) {
        alert("닉네임은 하루에 한번만 업데이트할 수 있습니다.");
      }
    } catch (err) {
      console.error("update nickname error:", err);
    }
  };

  const goSignIn = () => navigate("/login");
  const goMyPage = () => navigate("/mypage");

  return (
    <div className="min-h-screen bg-gray-100">
      <Headers />
      <section className="w-full max-w-3xl mx-auto mt-1">
        {user && (
          <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">내 프로필</h2>

            <UserInfoField label="ID" value={user.userId} />
            <UserInfoField label="Email" value={user.email} />

            {/* NickName 수정 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                NickName
              </label>
              <div className="flex gap-2">
                <input
                  id="nickName"
                  value={nickName}
                  onChange={onChangeNickName}
                  className="flex-1 rounded-md border border-gray-200 py-2 px-3
                  text-sm text-gray-700 bg-gray-50 shadow-sm
                  focus:border-indigo-300 focus:ring-indigo-200
                  "
                />
                <button
                  onClick={onChangeNickNameToServer}
                  className="w-1/3 bg-gradient-to-r from-rose-300 to-orange-300 
                  hover:from-rose-400 hover:to-orange-400
                  text-white font-semibold rounded-lg py-2 shadow-md 
                  transition-all duration-300"
                >
                  Change
                </button>
              </div>
            </div>

            <UserInfoField
              label="Phone Number"
              value={user.phone || "Not Registered"}
            />
            <UserInfoField
              label="Register Time"
              value={new Date(user.registerTime).toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
              })}
            />
            <UserInfoField label="Role" value={user.role} />

            {/* 버튼 영역 */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={goMyPage}
                className="w-full bg-gradient-to-r from-rose-300 to-orange-300 hover:from-rose-400 hover:to-orange-400 text-white font-semibold rounded-xl py-2 mt-2 shadow-md transition-all duration-300"
              >
                My Page
              </button>

              <button
                onClick={goSignIn}
                className="w-full bg-gradient-to-r from-rose-300 to-orange-300 hover:from-rose-400 hover:to-orange-400 text-white font-semibold rounded-xl py-2 mt-2 shadow-md transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
