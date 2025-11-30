import React from "react";
import {useNavigate} from "react-router-dom";

export default function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();

  const goToMain = () => navigate("/");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-10 text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          찾을 수 없는 페이지예요
        </h1>

        <p className="mt-4 text-base leading-7 text-gray-600">
          죄송해요. 요청하신 페이지를 찾을 수 없습니다.
          <br />
          주소를 다시 확인하시거나, 아래 버튼을 눌러 홈으로 이동해주세요.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={goToMain}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-rose-300 to-orange-300
                       hover:from-rose-400 hover:to-orange-400 text-white font-semibold shadow-md transition"
          >
            홈으로 돌아가기
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>혹시 도움이 필요하시면 언제든지 문의 주세요.</p>
        </div>
      </div>
    </div>
  );
}
