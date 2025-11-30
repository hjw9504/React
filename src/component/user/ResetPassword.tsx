import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function ResetPassword() {
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [isExist, setIsExist] = useState(false);

  const navigate = useNavigate();

  const saveUserId = (e: any) => setUserId(e.target.value);
  const saveNewPassword = (e: any) => setNewPassword(e.target.value);
  const saveNewPasswordCheck = (e: any) => setNewPasswordCheck(e.target.value);

  const checkUserId = async () => {
    if (!userId) {
      alert("Input UserId");
      return;
    }

    const res = await fetch(`/check/userId?userId=${userId}`, {
      headers: {"Content-Type": "application/json"},
    });
    const data = await res.json();

    if (data.resultData) {
      setIsExist(true);
    } else {
      setUserId("");
      alert("ID를 찾을 수 없습니다!");
    }
  };

  const onResetPassword = async () => {
    if (!userId || !newPassword || !newPasswordCheck) {
      alert("Input All Infos");
      return;
    }

    if (newPassword !== newPasswordCheck) {
      alert("Password is not equal! Check New Password");
      setNewPassword("");
      setNewPasswordCheck("");
      return;
    }

    const body = {
      userId: userId,
      newUserPw: newPassword,
    };

    const res = await fetch(`/reset/password`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.resultData === "success") {
      alert("Password Changed!");
      navigate("/login");
    } else {
      alert("Register Fail");
    }
  };

  const goSignIn = () => navigate("/login");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          비밀번호를 재설정해 주세요.
        </p>

        {/* ID 영역 */}
        <div className="mb-5">
          <label className="text-sm text-gray-700 font-medium">ID</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={userId}
              onChange={saveUserId}
              disabled={isExist}
              className="flex-1 px-3 py-2 border border-rose-200 rounded-lg bg-white 
                        focus:outline-none focus:ring-2 focus:ring-rose-300 
                        transition-all duration-200"
            />
            <button
              onClick={checkUserId}
              disabled={isExist}
              className="w-28 
              bg-gradient-to-r from-rose-300 to-orange-300
              text-white rounded-lg text-sm font-semibold
              hover:from-rose-400 hover:to-orange-400
              transition shadow"
            >
              Check
            </button>
          </div>
        </div>

        {/* PW */}
        <div className="mb-5">
          <label className="text-sm text-gray-700 font-medium">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={saveNewPassword}
            className="w-full mt-2 px-3 py-2 border border-rose-200 rounded-lg bg-white 
                       focus:outline-none focus:ring-2 focus:ring-rose-300 
                       transition-all duration-200"
          />
        </div>

        {/* PW CHECK */}
        <div className="mb-6">
          <label className="text-sm text-gray-700 font-medium">
            New Password Check
          </label>
          <input
            type="password"
            value={newPasswordCheck}
            onChange={saveNewPasswordCheck}
            className="w-full mt-2 px-3 py-2 border border-rose-200 rounded-lg bg-white 
                       focus:outline-none focus:ring-2 focus:ring-rose-300 
                       transition-all duration-200"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onResetPassword}
            className="flex-1 bg-gradient-to-r from-rose-300 to-orange-300 
                       hover:from-rose-400 hover:to-orange-400 
                       text-white font-semibold py-2 rounded-xl shadow-md transition"
          >
            Reset
          </button>
          <button
            onClick={goSignIn}
            className="flex-1 bg-gradient-to-r from-rose-300 to-orange-300 
                       hover:from-rose-400 hover:to-orange-400 
                       text-white font-semibold py-2 rounded-xl shadow-md transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
