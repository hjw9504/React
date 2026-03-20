import {useEffect, useState} from "react";
import {LoaderFunctionArgs, useLoaderData, useNavigate, useParams} from "react-router-dom";
import Headers from "../utils/HeadersNew";
import cookie from "react-cookies";

interface Post {
  id: string;
  memberId: string;
  title: string;
  body: string;
  registerTime: string;
  modTime: string;
  name: string;
  profileImage: string;
}

export async function postEditLoader({params}: LoaderFunctionArgs) {
  const res = await fetch(`/posting/detail/${params.postingId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: cookie.load("token"),
    },
  });
  const data = await res.json();
  return {post: data.resultData || null};
}

export default function PostEdit() {
  const {post} = useLoaderData() as {post: Post | null};
  const [title, setTitle] = useState(post?.title || "");
  const [body, setBody] = useState(post?.body || "");
  const [isNotUser, setIsNotUser] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate(`/post/detail/${params.postingId}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (isNotUser) {
      const timer = setTimeout(() => {
        setIsNotUser(false);
        navigate(`/post/detail/${params.postingId}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isNotUser]);

  const onEditPost = async () => {
    if (!title.trim() || !body.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    if (
      post?.memberId !== cookie.load("memberId") &&
      cookie.load("role") !== "ADMIN"
    ) {
      setIsNotUser(true);
      return;
    }

    try {
      const data = {
        id: params.postingId,
        memberId: cookie.load("memberId"),
        title,
        body,
        registerTime: post?.registerTime ?? "",
        modTime: "",
      };
      const res = await fetch(`/posting/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: cookie.load("token"),
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.errorCode === 0) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("onEditPost error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Headers />
      <main className="px-6 py-6 max-w-3xl mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          {/* 헤더 */}
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
            <img
              src={`${post?.profileImage}`}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-orange-200"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {post?.name || "사용자"}
              </p>
              <p className="text-xs text-gray-400">게시글 수정</p>
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="block w-full rounded-lg border border-gray-200 py-2 px-3
                         text-sm text-gray-700 bg-gray-50 shadow-sm
                         focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              내용
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={10}
              className="block w-full rounded-lg border border-gray-200 py-2 px-3
                         text-sm text-gray-700 bg-gray-50 shadow-sm resize-none
                         focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {body.length}자
            </p>
          </div>

          {/* 알림 메시지 */}
          {showSuccess && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-600">
              수정이 완료되었습니다. 잠시 후 이동합니다.
            </div>
          )}
          {isNotUser && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
              본인의 게시글만 수정할 수 있습니다.
            </div>
          )}

          {/* 버튼 */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => navigate(`/post/detail/${params.postingId}`)}
              className="w-full border border-gray-200 text-gray-600 font-semibold
                         rounded-xl py-2 shadow-sm hover:bg-gray-50 transition-all duration-300"
            >
              취소
            </button>
            <button
              onClick={onEditPost}
              className="w-full bg-gradient-to-r from-rose-300 to-orange-300
                         hover:from-rose-400 hover:to-orange-400
                         text-white font-semibold rounded-xl py-2 shadow-sm
                         transition-all duration-300"
            >
              저장하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
