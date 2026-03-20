import {useState} from "react";
import {useLoaderData, useNavigate} from "react-router-dom";
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
  profileImage: string;
}

export async function myInfoLoader() {
  const res = await fetch(`/user/info?memberId=${cookie.load("memberId")}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: cookie.load("token"),
    },
  });
  const data = await res.json();
  return {user: data.resultData?.[0] || null};
}

export default function Home() {
  const {user} = useLoaderData() as {user: User | null};
  const [nickName, setNickName] = useState(user?.nickName || "");
  const navigate = useNavigate();

  const UserInfoField = ({
    label,
    value,
    disabled = true,
  }: {
    label: string;
    value: string;
    disabled?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">
        {label}
      </label>
      <input
        value={value || ""}
        disabled={disabled}
        className="block w-full rounded-lg border border-gray-200 py-2 px-3
                   text-sm text-gray-700 bg-gray-50 shadow-sm
                   disabled:opacity-70"
      />
    </div>
  );

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
      <main className="grid grid-cols-12 gap-6 px-6 py-6">
        {/* 프로필 폼 */}
        <section className="col-span-8 space-y-4">
          {user && (
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              {/* 프로필 헤더 */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                <img
                  src={`${user.profileImage}`}
                  alt="profile"
                  className="w-14 h-14 rounded-full border-2 border-orange-200"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {user.nickName || user.name}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <UserInfoField label="ID" value={user.userId} />
              <UserInfoField label="Email" value={user.email} />

              {/* NickName 수정 */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  NickName
                </label>
                <div className="flex gap-2">
                  <input
                    id="nickName"
                    value={nickName}
                    onChange={onChangeNickName}
                    className="flex-1 rounded-lg border border-gray-200 py-2 px-3
                    text-sm text-gray-700 bg-gray-50 shadow-sm
                    focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200"
                  />
                  <button
                    onClick={onChangeNickNameToServer}
                    className="px-4 bg-gradient-to-r from-rose-300 to-orange-300
                    hover:from-rose-400 hover:to-orange-400
                    text-white text-sm font-semibold rounded-lg py-2 shadow-sm
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
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={goMyPage}
                  className="w-full bg-gradient-to-r from-rose-300 to-orange-300
                  hover:from-rose-400 hover:to-orange-400
                  text-white font-semibold rounded-xl py-2 shadow-sm
                  transition-all duration-300"
                >
                  My Page
                </button>
                <button
                  onClick={goSignIn}
                  className="w-full bg-gradient-to-r from-rose-300 to-orange-300
                  hover:from-rose-400 hover:to-orange-400
                  text-white font-semibold rounded-xl py-2 shadow-sm
                  transition-all duration-300"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 사이드바 */}
        <aside className="col-span-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-3">계정 정보</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-between">
                <span className="text-gray-500">역할</span>
                <span className="font-medium">{user?.role ?? "-"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">가입일</span>
                <span className="font-medium">
                  {user
                    ? new Date(user.registerTime).toLocaleDateString("ko-KR", {
                        timeZone: "Asia/Seoul",
                      })
                    : "-"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">닉네임</span>
                <span className="font-medium">{user?.nickName ?? "-"}</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
