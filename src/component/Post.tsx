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
  const [memberId, setMemberId] = useState("");
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState([
    {
      id: "",
      memberId: "",
      title: "",
      body: "",
      registerTime: "",
      modTime: "",
      name: "",
    },
  ]);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    await fetch(`/posting/list?memberId=${cookie.load("memberId")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: cookie.load("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.resultData);
        setUser(res.resultData);
      });
  };

  const getPostingDetail = async (event: any) => {
    const postingId = event.target.value;
    navigate(`/post/detail/${postingId}`);
  };

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <Headers />

      <div>
        <ul role="list" className="divide-y divide-gray-100">
          {user.map((user) => (
            <li
              key={user.id}
              className="flex justify-between gap-x-6 py-5"
              onClick={getPostingDetail}
              value={user.id}
            >
              <div className="flex min-w-0 gap-x-4">
                {/* <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={user.imageUrl}
                  alt=""
                /> */}
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {user.title}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {user.name}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                {user.registerTime ? (
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Last Modified{" "}
                    <time dateTime={user.modTime}>{user.modTime}</time>
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
