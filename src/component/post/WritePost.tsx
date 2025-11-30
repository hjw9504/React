"use client";

import {useState} from "react";

export default function WritePostPage() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const onSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();

    // 실제 API 호출 자리
    console.log({
      body,
      image,
    });
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          새 게시물 작성
        </h1>

        <form onSubmit={onSubmitPost} className="space-y-5">
          {/* 글 내용 */}
          <div>
            <textarea
              placeholder="무슨 생각을 하고 계신가요?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 border border-rose-200 rounded-lg bg-white 
                         focus:outline-none focus:ring-2 focus:ring-rose-300 
                         transition-all duration-200 h-32 resize-none"
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              이미지 업로드
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onChangeImage}
              className="w-full px-3 py-2 border border-rose-200 rounded-lg bg-white 
                         focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
            />
          </div>

          {/* 이미지 미리보기 */}
          {image && (
            <div className="flex justify-center">
              <img
                src={image}
                alt="preview"
                className="w-64 h-64 object-cover rounded-xl shadow mt-3"
              />
            </div>
          )}

          {/* 버튼 */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r 
                       from-rose-300 to-orange-300 hover:from-rose-400 hover:to-orange-400 
                       shadow-md transition"
          >
            게시하기
          </button>
        </form>
      </div>
    </div>
  );
}
