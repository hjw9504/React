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
      alert("비밀번호를 업데이트해주세요!");
    } else {
      setUserId("");
      alert("ID를 찾을 수 없습니다!");
    }
  };

  const onResetPassword = async () => {
    if (!userId || !newPassword || !newPasswordCheck) {
      alert("모든 값을 입력해주세요!");
      return;
    }

    if (newPassword !== newPasswordCheck) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
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

    if (data.errorCode === 0) {
      alert("비밀번호가 정상적으로 업데이트되었습니다.");
      navigate("/login");
    } else if (data.errorCode === 107) {
      alert("비밀번호가 최근에 사용하신 것과 동일합니다.");
    } else {
      alert("비밀번호 등록이 실패하였습니다.");
    }

    setNewPassword("");
    setNewPasswordCheck("");
  };

  const goSignIn = () => navigate("/login");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          비밀번호 재설정
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
            신규 비밀번호
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
            신규 비밀번호 확인
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
            비밀번호 재설정
          </button>
          <button
            onClick={goSignIn}
            className="flex-1 bg-gradient-to-r from-rose-300 to-orange-300 
                       hover:from-rose-400 hover:to-orange-400 
                       text-white font-semibold py-2 rounded-xl shadow-md transition"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
