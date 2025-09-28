import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {Dialog} from "@headlessui/react";
import {useEffect, useLayoutEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Headers from "../utils/Headers";
import cookie from "react-cookies";

const navigation = [
  {name: "Main", href: "/"},
  {name: "MyPage", href: "/mypage"},
  {name: "Index", href: "/index"},
];

export default function UserInfo() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState([
    {
      userId: "",
      name: "",
      email: "",
      phone: "",
      nickname: "",
      registerTime: "",
      recentLoginTime: "",
    },
  ]);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    await fetch(`/user/info?id=ALL&memberId=${cookie.load("memberId")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: cookie.load("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUser(res.resultData);
      });
  };

  const getUserDetail = async (event: any) => {
    console.log(event.target);
  };

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <Headers />

      <div>
        <ul role="list" className="divide-y divide-gray-100">
          {user.map((user) => (
            <li
              key={user.userId}
              onClick={getUserDetail}
              className="flex justify-between gap-x-6 py-5 hover:bg-sky-50"
              value={user.userId}
            >
              <div className="flex min-w-0 gap-x-4">
                {/* <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={user.imageUrl}
                  alt=""
                /> */}
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {user.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  {user.nickname}
                </p>
                {user.recentLoginTime ? (
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Last Login{" "}
                    <time dateTime={user.registerTime}>
                      {user.recentLoginTime}
                    </time>
                  </p>
                ) : (
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Register{" "}
                    <time dateTime={user.registerTime}>
                      {user.registerTime}
                    </time>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
