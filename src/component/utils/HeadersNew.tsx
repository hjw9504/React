import {useEffect, useLayoutEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import cookie from "react-cookies";

const Headers = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  });

  useLayoutEffect(() => {
    setName(cookie.load("name") ?? "");
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

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
    <header className="bg-white dark:bg-gray-900 shadow dark:shadow-gray-800 px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center">
        <Link to="/mypage" className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">
          JUNGS
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center space-x-6">
          <Link to="/mypage" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">홈</Link>
          <Link to="/post" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">글쓰기</Link>
          <Link to="/myinfo" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">프로필</Link>
          <button onClick={logout} className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">로그아웃</button>

          {/* 다크모드 토글 */}
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className="w-9 h-9 flex items-center justify-center rounded-full
                       bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                       transition-colors duration-200"
            aria-label="다크모드 토글"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </nav>

        <div className="flex items-center gap-3 sm:hidden">
          {/* 모바일 다크모드 토글 */}
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       bg-gray-100 dark:bg-gray-700 transition-colors duration-200"
            aria-label="다크모드 토글"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="text-gray-600 dark:text-gray-300 focus:outline-none"
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
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="sm:hidden mt-3 flex flex-col space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3">
          <Link to="/mypage" className="text-gray-600 dark:text-gray-300 hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>홈</Link>
          <Link to="/post" className="text-gray-600 dark:text-gray-300 hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>글쓰기</Link>
          <Link to="/myinfo" className="text-gray-600 dark:text-gray-300 hover:text-orange-500" onClick={() => setMobileMenuOpen(false)}>프로필</Link>
          <button onClick={logout} className="text-left text-gray-600 dark:text-gray-300 hover:text-red-500">로그아웃</button>
        </nav>
      )}
    </header>
  );
};

export default Headers;
