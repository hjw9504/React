import {useEffect, useLayoutEffect, useState} from "react";
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

  useEffect(() => {
    checkLogin();
  });

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
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <span className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">
        JUNGS
      </span>
      <nav className="space-x-6">
        <Link to="/mypage" className="text-gray-600 hover:text-orange-500">
          홈
        </Link>
        <Link to="/myinfo" className="text-gray-600 hover:text-orange-500">
          프로필
        </Link>
        <button
          onClick={logout}
          className="text-gray-600 hover:text-red-500 ml-4"
        >
          로그아웃
        </button>
      </nav>
    </header>
  );
};

export default Headers;
