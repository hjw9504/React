import {Link, Navigate, useNavigate} from "react-router-dom";
import {Button} from "@material-tailwind/react";
import {useEffect, useLayoutEffect, useState} from "react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

  const saveUserPw = (event: any) => {
    setUserPw(event.target.value);
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
        if (res) {
          alert("Already Exist UserId");
          setUserId("");
        }
      });
  };

  const onSignUp = async () => {
    try {
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
      }).then((res) => {
        if (res.status === 200) {
          onHandleData(res);
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
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register
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
                name="userId"
                onChange={saveUserId}
                type="text"
                required
                className="block w-[70%] rounded-md border-0 mr-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                onClick={checkUserId}
                className="flex w-[30%] justify-center items-center rounded-md bg-indigo-600 px-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Check ID
              </button>
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
            </div>
            <div className="mt-2 my-2">
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
            </div>
            <div className="mt-2 my-2">
              <input
                id="name"
                name="name"
                onChange={saveName}
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
            </div>
            <div className="mt-2 my-5">
              <input
                id="email"
                name="email"
                onChange={saveEmail}
                type="email"
                autoComplete="email"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onSignUp}
              className="w-[160px] justify-center rounded-md bg-indigo-600 py-1.5 mr-10 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
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
