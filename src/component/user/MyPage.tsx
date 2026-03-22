import {useState} from "react";
import cookie from "react-cookies";
import {useLoaderData, useNavigate} from "react-router-dom";
import Headers from "../utils/HeadersNew";

interface Member {
  memberId: string;
  name: string;
  profileImage: string;
  likeTrue: boolean;
}

interface Post {
  id: number;
  title: string;
  body: string;
  likes: number;
  comments: number;
  registerTime: string;
  member: Member;
}

export async function myPageLoader() {
  const res = await fetch(`/posting/all?memberId=${cookie.load("memberId")}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: cookie.load("token"),
    },
  });
  const data = await res.json();
  const posts = (data.resultData || []).sort((a: Post, b: Post) => b.id - a.id);
  return {posts};
}

export default function MyPage() {
  const {posts: initialPosts} = useLoaderData() as {posts: Post[]};
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [likedPostIds, setLikedPostIds] = useState<Set<number>>(
    new Set(initialPosts.filter((p) => p.member.likeTrue).map((p) => p.id))
  );
  const navigate = useNavigate();

  const handleLikes = async (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    const isLiked = likedPostIds.has(postId);
    const url = isLiked
      ? `/posting/likes/d/${postId}`
      : `/posting/likes/i/${postId}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: cookie.load("token"),
        },
      });
      const result = await res.json();
      if (result.errorCode === 0) {
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
    <div className="min-h-screen bg-gray-100">
      <Headers />
      <main className="grid grid-cols-12 gap-6 px-6 py-6">
        <section className="col-span-8 space-y-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
                alt="empty"
                className="w-24 h-24 opacity-70 mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-700">
                새로운 소식을 받아보세요
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                아직 게시물이 없습니다. 잠시 후 다시 확인해주세요!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/post/detail/${post.id}`)}
                className="bg-white rounded-xl shadow p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={post.member.profileImage}
                    alt={post.member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold">{post.member.name}</span>
                </div>

                <p className="font-medium text-gray-800">{post.title}</p>
                <p className="text-gray-600 text-sm">{post.body}</p>

                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLikes(e, post.id)}
                      className="flex items-center gap-1 transition-colors duration-200"
                    >
                      <span className={likedPostIds.has(post.id) ? "text-rose-500" : "text-gray-400"}>
                        {likedPostIds.has(post.id) ? "❤️" : "🤍"}
                      </span>
                      <span className="text-gray-500">{post.likes} Likes</span>
                    </button>
                    <div className="flex items-center gap-1 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 .998-.398 48.802 48.802 0 0 0 5.227-.476c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                      <span>{post.comments ?? 0}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{post.registerTime}</span>
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="col-span-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-3">추천 사용자</h2>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://api.dicebear.com/7.x/lorelei/svg?seed=test"
                    alt="추천1"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>cool_dev</span>
                </div>
                <button className="text-sm text-indigo-600">팔로우</button>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://api.dicebear.com/7.x/lorelei/svg?seed=wonder"
                    alt="추천2"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>fun_coder</span>
                </div>
                <button className="text-sm text-indigo-600">팔로우</button>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
