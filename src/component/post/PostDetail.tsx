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

export async function postDetailLoader({params}: LoaderFunctionArgs) {
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

export default function PostDetail() {
  const {post} = useLoaderData() as {post: Post | null};
  const [isNotUser, setIsNotUser] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!isNotUser) return;
    const timer = setTimeout(() => setIsNotUser(false), 2000);
    return () => clearTimeout(timer);
  }, [isNotUser]);

  const onEditPost = () => {
    if (
      post?.memberId !== cookie.load("memberId") &&
      cookie.load("role") !== "ADMIN"
    ) {
      setIsNotUser(true);
      return;
    }
    navigate(`/post/edit/${params.postingId}`);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Headers />
      <main className="px-6 py-6 max-w-3xl mx-auto space-y-4">
        {post ? (
          <div className="bg-white rounded-xl shadow p-6 space-y-5">
            {/* 작성자 헤더 */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={`${post.profileImage}`}
                  alt="profile"
                  className="w-10 h-10 rounded-full border-2 border-orange-200"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {post.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(post.registerTime)}
                  </p>
                </div>
              </div>
              {post.modTime && post.modTime !== post.registerTime && (
                <p className="text-xs text-gray-400">
                  수정됨: {formatDate(post.modTime)}
                </p>
              )}
            </div>

            {/* 제목 */}
            <h1 className="text-xl font-bold text-gray-800">{post.title}</h1>

            {/* 본문 */}
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.body}
            </p>

            {/* 경고 메시지 */}
            {isNotUser && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
                본인의 게시글만 수정할 수 있습니다.
              </div>
            )}

            {/* 버튼 */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => navigate("/mypage")}
                className="w-full border border-gray-200 text-gray-600 font-semibold
                           rounded-xl py-2 shadow-sm hover:bg-gray-50 transition-all duration-300"
              >
                목록으로
              </button>
              <button
                onClick={onEditPost}
                className="w-full bg-gradient-to-r from-rose-300 to-orange-300
                           hover:from-rose-400 hover:to-orange-400
                           text-white font-semibold rounded-xl py-2 shadow-sm
                           transition-all duration-300"
              >
                수정하기
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
