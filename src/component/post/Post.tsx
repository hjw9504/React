import {useState} from "react";
import {useLoaderData, useNavigate} from "react-router-dom";
import cookie from "react-cookies";
import Headers from "../utils/HeadersNew";

export async function postLoader() {
  const res = await fetch(
    `/api/user/info?member_id=${cookie.load("memberId")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.load("accessToken"),
      },
    }
  );
  const data = await res.json();
  return {profileImage: data.result_data?.[0]?.profileImage || ""};
}

export default function Post() {
  const {profileImage} = useLoaderData() as {profileImage: string};
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const data = {
      id: 0,
      member_id: cookie.load("memberId"),
      title,
      body,
      register_time: "",
      mod_time: "",
    };
    const res = await fetch("/api/posting/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.load("accessToken"),
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.error_code === 0) {
      navigate("/mypage");
    }
  };

  const handleCancel = () => {
    navigate("/mypage");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Headers />
      <main className="px-4 sm:px-6 py-4 sm:py-6 max-w-3xl mx-auto">
        <section className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
            {/* 헤더 */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 dark:border-gray-700">
              <img
                src={
                  profileImage ||
                  `https://api.dicebear.com/7.x/lorelei/svg?seed=one`
                }
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-orange-200"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {cookie.load("name") || "사용자"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  새 게시글 작성
                </p>
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="block w-full rounded-lg border border-gray-200 dark:border-gray-600 py-2 px-3
                           text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 shadow-sm
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200"
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                내용
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="어떤 생각을 공유하고 싶으신가요?"
                rows={8}
                className="block w-full rounded-lg border border-gray-200 dark:border-gray-600 py-2 px-3
                           text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 shadow-sm resize-none
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                {body.length}자
              </p>
            </div>

            {/* 이미지 첨부 */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                이미지 첨부{" "}
                <span className="text-gray-400 dark:text-gray-500">(선택)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                           file:mr-3 file:py-1.5 file:px-3
                           file:rounded-lg file:border-0
                           file:text-sm file:font-medium
                           file:bg-orange-50 dark:file:bg-orange-900/30 file:text-orange-600 dark:file:text-orange-400
                           hover:file:bg-orange-100 dark:hover:file:bg-orange-900/50 cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-3 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-48 h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-opacity-80"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="w-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300
                           font-semibold rounded-xl py-2 shadow-sm
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-rose-300 to-orange-300
                           hover:from-rose-400 hover:to-orange-400
                           text-white font-semibold rounded-xl py-2 shadow-sm
                           transition-all duration-300"
              >
                게시하기
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
