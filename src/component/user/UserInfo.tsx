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

const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
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

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <Headers />

      <div>
        <ul role="list" className="divide-y divide-gray-100">
          {user.map((user) => (
            <li
              key={user.userId}
              className="flex justify-between gap-x-6 py-5 hover:bg-sky-50"
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
