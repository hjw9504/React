import {useEffect, useLayoutEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import cookie from "react-cookies";

const Headers = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  });

  useLayoutEffect(() => {
    setName(cookie.load("name") ?? "");
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
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center">
        <Link to="/mypage" className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">
          JUNGS
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center space-x-6">
          <Link to="/mypage" className="text-gray-600 hover:text-orange-500">홈</Link>
          <Link to="/post" className="text-gray-600 hover:text-orange-500">글쓰기</Link>
          <Link to="/myinfo" className="text-gray-600 hover:text-orange-500">프로필</Link>
          <button onClick={logout} className="text-gray-600 hover:text-red-500">로그아웃</button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gray-600 focus:outline-none"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="sm:hidden mt-3 flex flex-col space-y-3 border-t border-gray-100 pt-3">
          <Link to="/mypage" className="text-gray-600 hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>홈</Link>
          <Link to="/post" className="text-gray-600 hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>글쓰기</Link>
          <Link to="/myinfo" className="text-gray-600 hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>프로필</Link>
          <button onClick={logout} className="text-left text-gray-600 hover:text-red-500">로그아웃</button>
        </nav>
      )}
    </header>
  );
};

export default Headers;
