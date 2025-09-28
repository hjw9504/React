import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {Dialog} from "@headlessui/react";
import {useLayoutEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import cookie from "react-cookies";

const Headers = () => {
  const userNavigation = [
    {name: "Main", href: "/mypage"},
    {name: "Post", href: "/post"},
  ];

  const adminNavigation = [
    {name: "Main", href: "/mypage"},
    {name: "User", href: "/user"},
    {name: "Post", href: "/post"},
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [navigation, setNavigation] = useState(userNavigation);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    setName(cookie.load("name") ?? "");
    if (cookie.load("role") === "ADMIN") {
      setNavigation(adminNavigation);
    }
  }, []);

  const checkLogin = () => {
    const token = cookie.load("token");
    if (!token) navigate("/login");
  };

  const logout = () => {
    cookie.remove("token");
    cookie.remove("name");
    cookie.remove("memberId");
    cookie.remove("role");
    cookie.remove("userId");
    navigate("/login");
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* 로고 */}
        <div className="flex lg:flex-1">
          <Link to="/mypage" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Logo"
            />
          </Link>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* 데스크탑 네비게이션 */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* 우측 로그인/로그아웃 */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="mr-5 font-bold">Hello {name}</div>
          <button
            onClick={logout}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Log out <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>

      {/* 모바일 네비게이션 */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/mypage" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Logo"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <button
                  onClick={logout}
                  className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Headers;
