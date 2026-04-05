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

    await fetch(`/api/check/userId?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.result_data) {
          alert("이미 사용중인 ID입니다.");
          setUserId("");
        } else {
          alert("사용 가능한 ID입니다.");
          setIsChecked(true);
        }
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        alert("데이터를 가져오는 중 오류가 발생했습니다.");
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

      if (userPw != userPwCheck) {
        alert("비밀번호를 다시 확인해주세요!");
        return;
      }

      const data = {
        user_id: userId,
        user_pw: userPw,
        name: name,
        email: email,
      };
      await fetch(`/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.result_data === "success") {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          회원가입
        </h1>

        <form className="space-y-4">
          {/* USER ID */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">아이디</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={userId}
                onChange={saveUserId}
                disabled={isChecked}
                placeholder="아이디 입력"
                required
                className="w-2/3 px-3 py-2 border border-rose-200 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-rose-300
                       disabled:opacity-60 transition-all duration-200"
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
            <label className="text-sm text-gray-600 dark:text-gray-400">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={userPw}
              onChange={saveUserPw}
              required
              className="w-full px-3 py-2 border border-rose-200 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-rose-300
                     transition-all duration-200"
            />
          </div>

          {/* PASSWORD CHECK */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">비밀번호 체크</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={userPwCheck}
              onChange={saveUserPwCheck}
              required
              className={`w-full px-3 py-2 border rounded-lg
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2
                     transition-all duration-200 ${
                       userPwCheck === ""
                         ? "border-rose-200 dark:border-gray-600 focus:ring-rose-300"
                         : isMatch
                         ? "border-green-400 dark:border-green-500 focus:ring-green-300"
                         : "border-red-400 dark:border-red-500 focus:ring-red-300"
                     }`}
            />
            {userPwCheck !== "" && (
              <p
                className={`text-xs mt-1 ${
                  isMatch ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                }`}
              >
                {isMatch
                  ? "✓ 비밀번호가 일치합니다."
                  : "✗ 비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">이름</label>
            <input
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={saveName}
              required
              className="w-full px-3 py-2 border border-rose-200 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-rose-300
                     transition-all duration-200"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={saveEmail}
              required
              className="w-full px-3 py-2 border border-rose-200 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                     placeholder-gray-400 dark:placeholder-gray-500
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
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
