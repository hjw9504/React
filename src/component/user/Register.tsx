import {Link, Navigate, useNavigate} from "react-router-dom";
import {Button} from "@material-tailwind/react";
import {useEffect, useLayoutEffect, useState} from "react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [userPwCheck, setUserPwCheck] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const isMatch = userPw !== "" && userPwCheck !== "" && userPw === userPwCheck;

  useLayoutEffect(() => {}, []);

  useEffect(() => {});

  const onHandleData = (response: any) => {
    alert("Register Success!");
    navigate("/login");
  };

  const saveUserId = (event: any) => {
    setUserId(event.target.value);
  };

  const saveUserPw = (event: any) => {
    setUserPw(event.target.value);
  };

  const saveUserPwCheck = (event: any) => {
    setUserPwCheck(event.target.value);
  };

  const saveName = (event: any) => {
    setName(event.target.value);
  };

  const saveEmail = (event: any) => {
    setEmail(event.target.value);
  };

  const checkUserId = async () => {
    if (userId === undefined || userId === null || userId === "") {
      alert("Input UserId");
      return;
    }

    await fetch(`/check/userId?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.resultData) {
          alert("이미 사용중인 ID입니다.");
          setUserId("");
        } else {
          alert("사용 가능한 ID입니다.");
          setIsChecked(true);
        }
      });
  };

  const onSignUp = async () => {
    try {
      if (userId === "" || userPw === "" || name === "" || email === "") {
        alert("모든 정보를 입력해주세요!");
        return;
      }

      if (!isChecked) {
        alert("ID 중복 체크를 진행해주세요!");
        return;
      }

      const data = {
        userId: userId,
        userPw: userPw,
        name: name,
        email: email,
      };
      await fetch(`/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.resultData === "success") {
            onHandleData(res);
          } else {
            alert("회원가입 실패하였습니다.");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const goSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          회원가입
        </h1>

        <form className="space-y-4">
          {/* USER ID */}
          <div>
            <label className="text-sm text-gray-600">아이디</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={userId}
                onChange={saveUserId}
                disabled={isChecked}
                placeholder="아이디 입력"
                required
                className="w-2/3 px-3 py-2 border border-rose-200 rounded-lg 
                       bg-white focus:outline-none focus:ring-2 
                       focus:ring-rose-300 transition-all duration-200"
              />
              <button
                type="button"
                onClick={checkUserId}
                className="w-1/3 bg-gradient-to-r from-rose-300 to-orange-300 
                       hover:from-rose-400 hover:to-orange-400
                       text-white font-semibold rounded-lg py-2 shadow-md 
                       transition-all duration-300"
              >
                중복 확인
              </button>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={userPw}
              onChange={saveUserPw}
              required
              className="w-full px-3 py-2 border border-rose-200 rounded-lg bg-white 
                     focus:outline-none focus:ring-2 focus:ring-rose-300 
                     transition-all duration-200"
            />
          </div>

          {/* PASSWORD CHECK */}
          <div>
            <label className="text-sm text-gray-600">비밀번호 체크</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={userPwCheck}
              onChange={saveUserPwCheck}
              required
              className={`w-full px-3 py-2 border border-rose-200 rounded-lg bg-white 
                     focus:outline-none focus:ring-2 focus:ring-rose-300 
                     transition-all duration-200 focus:ring-2 ${
                       userPwCheck === ""
                         ? "border-rose-200 focus:ring-rose-300"
                         : isMatch
                         ? "border-green-400 focus:ring-green-300"
                         : "border-red-400 focus:ring-red-300"
                     }`}
            />
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600">이름</label>
            <input
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={saveName}
              required
              className="w-full px-3 py-2 border border-rose-200 rounded-lg bg-white 
                     focus:outline-none focus:ring-2 focus:ring-rose-300 
                     transition-all duration-200"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={saveEmail}
              required
              className="w-full px-3 py-2 border border-rose-200 rounded-lg bg-white 
                     focus:outline-none focus:ring-2 focus:ring-rose-300 
                     transition-all duration-200"
            />
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="button"
            onClick={onSignUp}
            className="w-full bg-gradient-to-r from-rose-300 to-orange-300 
                   hover:from-rose-400 hover:to-orange-400 
                   text-white font-semibold rounded-xl py-2 mt-2
                   shadow-md transition-all duration-300"
          >
            회원가입
          </button>
        </form>

        {/* LOGIN 이동 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-indigo-600 font-medium">
            로그인
          </Link>
        </p>

        {/* 메시지 */}
        {userPwCheck !== "" && (
          <p
            className={`text-sm ${isMatch ? "text-green-600" : "text-red-600"}`}
          >
            {isMatch
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다."}
          </p>
        )}
      </div>
    </div>
  );
}
