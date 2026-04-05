import {useState} from "react";
import cookie from "react-cookies";
import {useLoaderData, useNavigate, Link} from "react-router-dom";
import Headers from "../utils/HeadersNew";

interface Member {
  member_id: string;
  name: string;
  profile_image: string;
  like_true: boolean;
}

interface Follow {
  member_id: string;
  follow_member_id: string;
  user_id: string;
  follow_user_id: string;
  register_time: string;
  followed_time: string | null;
  profile_image: string;
  follow_profile_image: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  likes: number;
  comment_count: number;
  register_time: string;
  member: Member;
}

export async function myPageLoader() {
  const accessToken = cookie.load("accessToken") ?? "";
  const memberId = cookie.load("memberId") ?? "";
  const [postsRes, followsRes] = await Promise.all([
    fetch(`/api/posting/all?member_id=${memberId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    fetch(`/api/follow/friends/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  ]);
  const postsData = await postsRes.json();
  const followsData = await followsRes.json();
  const posts = (postsData.result_data || []).sort(
    (a: Post, b: Post) => b.id - a.id
  );
  const follows: Follow[] = followsData.result_data || [];
  return {posts, follows};
}

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

export default function MyPage() {
  const {posts: initialPosts, follows} = useLoaderData() as {
    posts: Post[];
    follows: Follow[];
  };
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [followingIds, setFollowingIds] = useState<Set<string>>(
    new Set(follows.map((f) => f.follow_member_id))
  );
  const [friendIds] = useState<Set<string>>(
    new Set(
      follows
        .filter((f) => f.followed_time !== null)
        .map((f) => f.follow_member_id)
    )
  );
  const [likedPostIds, setLikedPostIds] = useState<Set<number>>(
    new Set(initialPosts.filter((p) => p.member.like_true).map((p) => p.id))
  );
  const [followLoadingId, setFollowLoadingId] = useState<string | null>(null);
  const [menuPostId, setMenuPostId] = useState<number | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const myMemberId = cookie.load("memberId");
  const navigate = useNavigate();

  const handleDelete = async (postId: number) => {
    setDeletingId(postId);
    try {
      await fetch(`/api/posting/${postId}`, {
        method: "DELETE",
        headers: {Authorization: "Bearer " + cookie.load("accessToken")},
      });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("delete error:", err);
    } finally {
      setDeletingId(null);
      setDeleteModalId(null);
    }
  };

  const handleFollow = async (e: React.MouseEvent, memberId: string) => {
    e.stopPropagation();
    if (followLoadingId) return;
    setFollowLoadingId(memberId);
    const isFollowing = followingIds.has(memberId);
    try {
      await fetch(isFollowing ? `/api/follow/unlink` : `/api/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookie.load("accessToken"),
        },
        body: JSON.stringify({follow_member_id: memberId}),
      });
      setFollowingIds((prev) => {
        const next = new Set(prev);
        isFollowing ? next.delete(memberId) : next.add(memberId);
        return next;
      });
      window.location.reload();
    } catch (err) {
      console.error("handleFollow error:", err);
    } finally {
      setFollowLoadingId(null);
    }
  };

  const handleLikes = async (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    const isLiked = likedPostIds.has(postId);
    const url = isLiked
      ? `/api/posting/likes/d/${postId}`
      : `/api/posting/likes/i/${postId}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookie.load("accessToken"),
        },
      });
      const result = await res.json();
      if (result.error_code === 0) {
        if (isLiked) {
          setLikedPostIds((prev) => {
            const next = new Set(prev);
            next.delete(postId);
            return next;
          });
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? {...p, likes: p.likes - 1} : p))
          );
        } else {
          setLikedPostIds((prev) => new Set(prev).add(postId));
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? {...p, likes: p.likes + 1} : p))
          );
        }
      }
    } catch (err) {
      console.error("handleLikes error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Headers />
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 px-4 sm:px-6 py-4 sm:py-6">
        <section className="col-span-1 md:col-span-8 space-y-6 order-2 md:order-1">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
                alt="empty"
                className="w-24 h-24 opacity-70 mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                새로운 소식을 받아보세요
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                아직 게시물이 없습니다. 잠시 후 다시 확인해주세요!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/post/detail/${post.id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.member.profile_image}
                      alt={post.member.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {post.member.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.member.member_id !== myMemberId ? (
                      <button
                        onClick={(e) => handleFollow(e, post.member.member_id)}
                        disabled={followLoadingId === post.member.member_id}
                        className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full
                          transition-all duration-200 disabled:opacity-50
                          ${
                            friendIds.has(post.member.member_id)
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-400"
                              : followingIds.has(post.member.member_id)
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-400"
                              : "bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-700"
                          }`}
                      >
                        {followLoadingId === post.member.member_id
                          ? "..."
                          : friendIds.has(post.member.member_id)
                          ? "💚 친구"
                          : followingIds.has(post.member.member_id)
                          ? "팔로잉 ✓"
                          : "+ 팔로우"}
                      </button>
                    ) : (
                      /* 내 글 ··· 버튼 */
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuPostId(post.id);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="5" cy="12" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="19" cy="12" r="1.5" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {post.title}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {post.body}
                </p>

                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLikes(e, post.id)}
                      className="flex items-center gap-1 transition-colors duration-200"
                    >
                      <span
                        className={
                          likedPostIds.has(post.id)
                            ? "text-rose-500"
                            : "text-gray-400 dark:text-gray-500"
                        }
                      >
                        {likedPostIds.has(post.id) ? "❤️" : "🤍"}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {post.likes} Likes
                      </span>
                    </button>
                    <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 .998-.398 48.802 48.802 0 0 0 5.227-.476c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                      </svg>
                      <span>{post.comment_count ?? 0}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(post.register_time)}
                  </span>
                </div>
              </article>
            ))
          )}
        </section>

        {/* 사이드바 */}
        <aside className="col-span-1 md:col-span-4 order-1 md:order-2 space-y-4">
          {/* 팔로우 현황 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
                </svg>
                <span className="text-white font-bold text-sm">친구 현황</span>
              </div>
              <Link
                to="/friends"
                className="text-white/80 hover:text-white text-xs font-medium transition-colors"
              >
                전체 보기 →
              </Link>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center border border-orange-100 dark:border-orange-800/30">
                  <p className="text-2xl font-extrabold text-orange-500 dark:text-orange-300">
                    {follows.filter((f) => f.followed_time !== null).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    💚 친구
                  </p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3 text-center border border-rose-100 dark:border-rose-800/30">
                  <p className="text-2xl font-extrabold text-rose-400 dark:text-rose-300">
                    {follows.filter((f) => f.followed_time === null).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    ➡️ 팔로잉
                  </p>
                </div>
              </div>

              {follows.length === 0 ? (
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-2">
                  아직 팔로우한 친구가 없어요
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {follows.slice(0, 5).map((f) => (
                    <li
                      key={f.follow_member_id}
                      className="flex items-center gap-2.5"
                    >
                      <img
                        src={f.follow_profile_image}
                        alt={f.follow_user_id}
                        className={`flex-shrink-0 w-8 h-8 rounded-full object-cover ring-2 ${
                          f.followed_time !== null
                            ? "ring-green-300 dark:ring-green-600"
                            : "ring-orange-200 dark:ring-orange-700"
                        }`}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        @{f.follow_user_id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                        ${
                          f.followed_time !== null
                            ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                            : "bg-orange-100 dark:bg-orange-900/40 text-orange-500 dark:text-orange-400"
                        }`}
                      >
                        {f.followed_time !== null ? "친구" : "팔로잉"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {follows.length > 5 && (
                <Link
                  to="/friends"
                  className="mt-3 block text-center text-xs text-gray-400 dark:text-gray-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  +{follows.length - 5}명 더 보기
                </Link>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* 채팅 플로팅 버튼 */}
      <Link
        to="/chat"
        className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
      >
        {/* 툴팁 */}
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap pointer-events-none">
          채팅하기 💬
        </span>
        {/* 버튼 */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #fb923c, #f43f5e)",
            boxShadow: "0 8px 25px rgba(251,146,60,0.45)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </div>
      </Link>

      {/* ··· 바텀시트 (인스타 스타일) */}
      {menuPostId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setMenuPostId(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl pb-8 pt-3 px-4 shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 핸들 바 */}
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />

            <div className="space-y-1">
              <button
                onClick={() => {
                  setMenuPostId(null);
                  navigate(`/post/edit/${menuPostId}`);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    수정하기
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    게시글을 편집합니다
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setMenuPostId(null);
                  setDeleteModalId(menuPostId);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-500">삭제하기</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    게시글을 영구 삭제합니다
                  </p>
                </div>
              </button>

              <button
                onClick={() => setMenuPostId(null)}
                className="w-full mt-2 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 (페북 스타일) */}
      {deleteModalId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setDeleteModalId(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center space-y-2">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                게시글을 삭제할까요?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                삭제된 게시글은 복구할 수 없습니다.
              </p>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 grid grid-cols-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition border-r border-gray-100 dark:border-gray-800"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteModalId)}
                disabled={deletingId === deleteModalId}
                className="py-4 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
              >
                {deletingId === deleteModalId ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
