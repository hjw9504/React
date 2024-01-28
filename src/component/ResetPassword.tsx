import {Link, Navigate, useNavigate} from "react-router-dom";
import {Button} from "@material-tailwind/react";
import {useEffect, useLayoutEffect, useState} from "react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [isExist, setIsExist] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {}, []);

  useEffect(() => {});

  const onHandleData = (response: any) => {
    alert("Register Success!");
    navigate("/login");
  };

  const saveUserId = (event: any) => {
    setUserId(event.target.value);
  };

  const saveNewPassword = (event: any) => {
    setNewPassword(event.target.value);
  };

  const saveNewPasswordCheck = (event: any) => {
    setNewPasswordCheck(event.target.value);
  };

  const checkUserId = async (event: any) => {
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
        if (res) {
          setIsExist(true);
        } else {
          setUserId("");
          alert("Wrong User Id");
        }
      });
  };

  const onResetPassword = async () => {
    try {
      if (newPassword !== newPasswordCheck) {
        alert("Password is not equal! Check New Password");
        setNewPassword("");
        setNewPasswordCheck("");
      }

      const data = {
        userId: userId,
        newUserPw: newPassword,
      };
      await fetch(`/reset/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.status === 200) {
          navigate("/login");
        } else {
          alert("Register Fail");
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
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset Password
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
                value={userId}
                name="userId"
                onChange={saveUserId}
                type="text"
                required
                disabled={isExist}
                className="block w-[70%] rounded-md border-0 mr-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                onClick={checkUserId}
                className="flex w-[30%] justify-center items-center rounded-md bg-indigo-600 px-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isExist}
              >
                Check ID
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New Password
              </label>
            </div>
            <div className="mt-2 my-2">
              <input
                id="newPassword"
                value={newPassword}
                name="newPassword"
                onChange={saveNewPassword}
                type="newPassword"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="newPasswordCheck"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New Password Check
              </label>
            </div>
            <div className="mt-2 my-2">
              <input
                id="newPasswordCheck"
                value={newPasswordCheck}
                name="newPasswordCheck"
                onChange={saveNewPasswordCheck}
                type="newPasswordCheck"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="pt-5 flex justify-center">
            <button
              onClick={onResetPassword}
              className="w-[160px] justify-center rounded-md bg-indigo-600 py-1.5 mr-10 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Reset Password
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
