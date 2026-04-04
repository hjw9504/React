import {useEffect, useState} from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import Headers from "../utils/HeadersNew";
import cookie from "react-cookies";

interface Post {
  id: string;
  memberId: string;
  title: string;
  body: string;
  register_time: string;
  modTime: string;
  name: string;
  profile_image: string;
}

interface LikeUser {
  memberId: string;
  userId: string;
  name: string;
  profileImage: string;
}

interface Comment {
  member_id: string;
  user_id: string;
  comment: string;
  register_time: string;
  profile_image: string;
}

export async function postDetailLoader({params}: LoaderFunctionArgs) {
  const res = await fetch(`/api/posting/detail/${params.postingId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: cookie.load("token"),
    },
  });
  const data = await res.json();
  return {post: data.result_data || null};
}

type Tab = "content" | "likes";

export default function PostDetail() {
  const {post} = useLoaderData() as {post: Post | null};
  const [isNotUser, setIsNotUser] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [likeUsers, setLikeUsers] = useState<LikeUser[]>([]);
  const [likesLoading, setLikesLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const isOwner = post?.memberId === cookie.load("memberId");

  useEffect(() => {
    if (!isNotUser) return;
    const timer = setTimeout(() => setIsNotUser(false), 2000);
    return () => clearTimeout(timer);
  }, [isNotUser]);

  useEffect(() => {
    if (params.postingId) fetchComments();
  }, [params.postingId]);

  const fetchLikeUsers = async () => {
    if (likeUsers.length > 0) return;
    setLikesLoading(true);
    try {
      const res = await fetch(`/api/posting/likes/${params.postingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: cookie.load("token"),
        },
      });
      const data = await res.json();
      setLikeUsers(data.result_data || []);
    } catch (err) {
      console.error("fetchLikeUsers error:", err);
    } finally {
      setLikesLoading(false);
    }
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/comment/${params.postingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: cookie.load("token"),
        },
      });
      const data = await res.json();
      const list: Comment[] = data.result_data?.comments || [];
      list.sort(
        (a, b) =>
          new Date(b.register_time).getTime() -
          new Date(a.register_time).getTime()
      );
      setComments(list);
    } catch (err) {
      console.error("fetchComments error:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || commentSubmitting) return;
    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/comment/${params.postingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: cookie.load("token"),
        },
        body: JSON.stringify({
          member_id: cookie.load("memberId"),
          comment: newComment.trim(),
        }),
      });
      if (res.ok) {
        setNewComment("");
        await fetchComments();
      }
    } catch (err) {
      console.error("submitComment error:", err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "likes") fetchLikeUsers();
  };

  const onDeletePost = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/posting/${params.postingId}`, {
        method: "DELETE",
        headers: {
          token: cookie.load("token"),
        },
      });
      navigate("/mypage");
    } catch (err) {
      console.error("deletePost error:", err);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
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
    const utc = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
    return new Date(utc).toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Headers />
      <main className="px-4 sm:px-6 py-4 sm:py-6 max-w-3xl mx-auto space-y-4">
        {post ? (
          <>
            {/* 게시글 카드 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              {isOwner && (
                <div className="flex border-b border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => handleTabChange("content")}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200
                      ${
                        activeTab === "content"
                          ? "text-orange-500 border-b-2 border-orange-400"
                          : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      }`}
                  >
                    게시글
                  </button>
                  <button
                    onClick={() => handleTabChange("likes")}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200
                      ${
                        activeTab === "likes"
                          ? "text-orange-500 border-b-2 border-orange-400"
                          : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.profile_image}
                          alt="profile"
                          className="w-10 h-10 rounded-full border-2 border-orange-200"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {post.name}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatDate(post.register_time)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.modTime &&
                          post.modTime !== post.register_time && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              수정됨: {formatDate(post.modTime)}
                            </p>
                          )}
                        {isOwner && (
                          <button
                            onClick={() => setShowDeleteConfirm((v) => !v)}
                            title="게시글 삭제"
                            className="flex items-center justify-center w-8 h-8 rounded-lg
                                       bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/50
                                       text-red-400 hover:text-red-500 dark:text-red-400
                                       transition-all duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {post.title}
                    </h1>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {post.body}
                    </p>

                    {isNotUser && (
                      <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-4 py-2 text-sm text-red-600 dark:text-red-400">
                        본인의 게시글만 수정할 수 있습니다.
                      </div>
                    )}

                    {showDeleteConfirm && (
                      <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-4 py-3 space-y-3">
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400 text-center">
                          정말 이 게시글을 삭제하시겠습니까?
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="w-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300
                                       font-semibold rounded-xl py-2 text-sm
                                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                          >
                            취소
                          </button>
                          <button
                            onClick={onDeletePost}
                            disabled={isDeleting}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold
                                       rounded-xl py-2 text-sm shadow-sm
                                       disabled:opacity-50 transition-all duration-300"
                          >
                            {isDeleting ? "삭제 중..." : "삭제 확인"}
                          </button>
                        </div>
                      </div>
                    )}

                    <div
                      className={`grid ${
                        isOwner ? "grid-cols-2" : "grid-cols-1"
                      } gap-3 pt-2`}
                    >
                      <button
                        onClick={() => navigate("/mypage")}
                        className="w-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300
                                   font-semibold rounded-xl py-2 shadow-sm
                                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                      >
                        목록으로
                      </button>
                      {isOwner && (
                        <button
                          onClick={onEditPost}
                          className="w-full bg-gradient-to-r from-rose-300 to-orange-300
                                     hover:from-rose-400 hover:to-orange-400
                                     text-white font-semibold rounded-xl py-2 shadow-sm
                                     transition-all duration-300"
                        >
                          수정하기
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* 좋아요 탭 */}
                {activeTab === "likes" && (
                  <>
                    {likesLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-3 animate-pulse"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                          </div>
                        ))}
                      </div>
                    ) : likeUsers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <span className="text-4xl mb-3">🤍</span>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          아직 좋아요를 누른 사람이 없습니다.
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-50 dark:divide-gray-700">
                        {likeUsers.map((u) => (
                          <li
                            key={u.memberId}
                            className="flex items-center space-x-3 py-3"
                          >
                            <img
                              src={u.profileImage}
                              alt={u.name}
                              className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-600"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {u.name}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                @{u.userId}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 댓글 섹션 */}
            {activeTab === "content" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  댓글{" "}
                  {comments.length > 0 && (
                    <span className="text-orange-400">{comments.length}</span>
                  )}
                </h2>

                {/* 댓글 입력 */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitComment()}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                               rounded-xl px-4 py-2 text-sm text-gray-800 dark:text-gray-100
                               placeholder-gray-400 dark:placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-500"
                  />
                  <button
                    onClick={submitComment}
                    disabled={commentSubmitting || !newComment.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-rose-300 to-orange-300
                               hover:from-rose-400 hover:to-orange-400
                               text-white text-sm font-semibold rounded-xl
                               disabled:opacity-50 transition-all duration-300 whitespace-nowrap"
                  >
                    {commentSubmitting ? "..." : "등록"}
                  </button>
                </div>

                {/* 댓글 목록 */}
                {commentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-3 animate-pulse"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                          <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className="text-3xl mb-2">💬</span>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-50 dark:divide-gray-700">
                    {comments.map((c, idx) => (
                      <li key={idx} className="flex items-start space-x-3 py-3">
                        <img
                          src={c.profile_image}
                          alt="profile"
                          className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-600 flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {c.user_id || c.member_id}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {formatDate(c.register_time)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 break-words">
                            {c.comment}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
