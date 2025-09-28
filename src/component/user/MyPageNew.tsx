import {useEffect, useLayoutEffect, useState} from "react";
import {Dialog} from "@headlessui/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import cookie from "react-cookies";
import {Link, useNavigate} from "react-router-dom";
import Headers from "../utils/HeadersNew";

const navigation = [
  {name: "Main", href: "/"},
  {name: "MyPage", href: "/mypage"},
  {name: "Index", href: "/index"},
];

interface Post {
  id: number;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

const dummyPosts: Post[] = [
  {
    id: 1,
    username: "jung_dev",
    avatar: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_1.png",
    content: "오늘도 열코딩!",
    image: "https://avatar.iran.liara.run/public/10",
    likes: 11,
    comments: 3,
  },
  {
    id: 2,
    username: "jane_doe",
    avatar: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_2.png",
    content: "주말에는 여행이 최고 🌴✈️",
    likes: 20,
    comments: 5,
  },
];

export default function MyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    cookie.remove("token");
    cookie.remove("name");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Headers />
      <main className="grid grid-cols-12 gap-6 px-6 py-6">
        <section className="col-span-8 space-y-6">
          {dummyPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow p-4 space-y-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={post.avatar}
                  alt={post.username}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">{post.username}</span>
              </div>

              <p className="text-gray-700">{post.content}</p>

              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="rounded-lg w-full"
                />
              )}

              <div className="flex justify-between text-sm text-gray-500">
                <span>❤️ {post.likes} Likes</span>
                <span>💬 {post.comments} Comments</span>
              </div>
            </article>
          ))}
        </section>

        <aside className="col-span-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-3">추천 사용자</h2>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://avatar.iran.liara.run/public/11"
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
                    src="https://avatar.iran.liara.run/public/15"
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
