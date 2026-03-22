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

interface LikeUser {
  memberId: string;
  userId: string;
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

type Tab = "content" | "likes";

export default function PostDetail() {
  const {post} = useLoaderData() as {post: Post | null};
  const [isNotUser, setIsNotUser] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [likeUsers, setLikeUsers] = useState<LikeUser[]>([]);
  const [likesLoading, setLikesLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const isOwner = post?.memberId === cookie.load("memberId");

  useEffect(() => {
    if (!isNotUser) return;
    const timer = setTimeout(() => setIsNotUser(false), 2000);
    return () => clearTimeout(timer);
  }, [isNotUser]);

  const fetchLikeUsers = async () => {
    if (likeUsers.length > 0) return; // 이미 불러왔으면 재요청 안함
    setLikesLoading(true);
    try {
      const res = await fetch(`/posting/likes/${params.postingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: cookie.load("token"),
        },
      });
      const data = await res.json();
      setLikeUsers(data.resultData || []);
    } catch (err) {
      console.error("fetchLikeUsers error:", err);
    } finally {
      setLikesLoading(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "likes") fetchLikeUsers();
  };

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
      <main className="px-4 sm:px-6 py-4 sm:py-6 max-w-3xl mx-auto space-y-4">
        {post ? (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* 탭 헤더 (작성자에게만 표시) */}
            {isOwner && (
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => handleTabChange("content")}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200
                    ${activeTab === "content"
                      ? "text-orange-500 border-b-2 border-orange-400"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  게시글
                </button>
                <button
                  onClick={() => handleTabChange("likes")}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200
                    ${activeTab === "likes"
                      ? "text-orange-500 border-b-2 border-orange-400"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  ❤️ 좋아요
                </button>
              </div>
            )}

            <div className="p-6 space-y-5">
              {/* 게시글 탭 */}
              {activeTab === "content" && (
                <>
                  {/* 작성자 헤더 */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.profileImage}
                        alt="profile"
                        className="w-10 h-10 rounded-full border-2 border-orange-200"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{post.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(post.registerTime)}</p>
                      </div>
                    </div>
                    {post.modTime && post.modTime !== post.registerTime && (
                      <p className="text-xs text-gray-400">수정됨: {formatDate(post.modTime)}</p>
                    )}
                  </div>

                  <h1 className="text-xl font-bold text-gray-800">{post.title}</h1>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.body}</p>

                  {isNotUser && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
                      본인의 게시글만 수정할 수 있습니다.
                    </div>
                  )}

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
                </>
              )}

              {/* 좋아요 탭 */}
              {activeTab === "likes" && (
                <>
                  {likesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3 animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-gray-200" />
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                      ))}
                    </div>
                  ) : likeUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <span className="text-4xl mb-3">🤍</span>
                      <p className="text-gray-500 text-sm">아직 좋아요를 누른 사람이 없습니다.</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-50">
                      {likeUsers.map((u) => (
                        <li key={u.memberId} className="flex items-center space-x-3 py-3">
                          <img
                            src={u.profileImage}
                            alt={u.name}
                            className="w-10 h-10 rounded-full border border-gray-100"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-700">{u.name}</p>
                            <p className="text-xs text-gray-400">@{u.userId}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
