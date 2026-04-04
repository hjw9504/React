import {useState} from "react";
import {useLoaderData, useNavigate} from "react-router-dom";
import cookie from "react-cookies";
import Headers from "../utils/HeadersNew";

interface Follow {
  memberId: string;
  follow_id: string;
  name: string;
  profileImage: string;
  follow_time: string;
  followed_time: string | null;
}

export async function friendsLoader() {
  const res = await fetch(`/api/follow/friends/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: cookie.load("token"),
    },
  });
  const data = await res.json();
  return {follows: data.resultData || []};
}

type TabType = "all" | "friends" | "following";

export default function Friends() {
  const {follows: initialFollows} = useLoaderData() as {follows: Follow[]};
  const [follows, setFollows] = useState<Follow[]>(initialFollows);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const navigate = useNavigate();

  const friends = follows.filter((f) => f.followed_time !== null);
  const onlyFollowing = follows.filter((f) => f.followed_time === null);
  const displayed =
    activeTab === "all"
      ? follows
      : activeTab === "friends"
      ? friends
      : onlyFollowing;

  const handleUnfollow = async (memberId: string) => {
    setUnfollowingId(memberId);
    try {
      await fetch(`/api/follow/unlink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: cookie.load("token"),
        },
        body: JSON.stringify({
          follow_member_id:
            follows.find((f) => f.memberId === memberId)?.follow_id ?? memberId,
        }),
      });
      setFollows((prev) => prev.filter((f) => f.memberId !== memberId));
      setConfirmId(null);
    } catch (err) {
      console.error("unfollow error:", err);
    } finally {
      setUnfollowingId(null);
    }
  };

  const tabs: {key: TabType; label: string; count: number; icon: string}[] = [
    {key: "all", label: "전체", count: follows.length, icon: "👥"},
    {key: "friends", label: "친구", count: friends.length, icon: "💚"},
    {
      key: "following",
      label: "팔로잉",
      count: onlyFollowing.length,
      icon: "➡️",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Headers />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* 상단 Stats 카드 */}
        <div className="bg-gradient-to-r from-orange-200 via-rose-200 to-pink-200 dark:from-orange-900/40 dark:via-rose-900/40 dark:to-pink-900/40 rounded-2xl p-5 shadow-sm border border-orange-100 dark:border-orange-800/30">
          <h1 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-200">
            나의 팔로우 현황
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 dark:bg-white/10 rounded-xl p-3 text-center">
              <p className="text-3xl font-extrabold text-orange-500 dark:text-orange-300">
                {friends.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-0.5">
                💚 친구
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                서로 팔로우
              </p>
            </div>
            <div className="bg-white/60 dark:bg-white/10 rounded-xl p-3 text-center">
              <p className="text-3xl font-extrabold text-rose-400 dark:text-rose-300">
                {onlyFollowing.length}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-0.5">
                ➡️ 팔로잉
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                내가 팔로우 중
              </p>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 bg-white dark:bg-gray-800/80 rounded-2xl p-2 shadow dark:shadow-gray-900">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-orange-300 to-rose-300 dark:from-orange-500/70 dark:to-rose-500/70 text-white dark:text-gray-100 shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                ${
                  activeTab === tab.key
                    ? "bg-white/30 dark:bg-black/20 text-white dark:text-gray-200"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 리스트 */}
        <div className="space-y-3">
          {displayed.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-12 flex flex-col items-center text-center">
              <span className="text-5xl mb-3">
                {activeTab === "friends"
                  ? "💚"
                  : activeTab === "following"
                  ? "➡️"
                  : "👥"}
              </span>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {activeTab === "friends"
                  ? "아직 서로 팔로우한 친구가 없어요"
                  : activeTab === "following"
                  ? "팔로잉하는 사람이 없어요"
                  : "아직 팔로우한 사람이 없어요"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                게시글에서 관심 있는 사람을 팔로우해보세요!
              </p>
            </div>
          ) : (
            displayed.map((f) => {
              const isFriend = f.followed_time !== null;
              const isConfirming = confirmId === f.memberId;
              const isProcessing = unfollowingId === f.memberId;

              return (
                <div
                  key={f.memberId}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow p-4 transition-all duration-200
                    ${
                      isFriend
                        ? "border-l-4 border-green-400"
                        : "border-l-4 border-blue-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {/* 프로필 이미지 */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={f.profileImage}
                        alt={f.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-100 dark:border-gray-600"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 text-xs rounded-full w-5 h-5 flex items-center justify-center
                        ${isFriend ? "bg-green-400" : "bg-blue-300"}`}
                      >
                        {isFriend ? "💚" : "➡️"}
                      </span>
                    </div>

                    {/* 이름 + 배지 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                          {f.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold
                          ${
                            isFriend
                              ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                              : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {isFriend ? "💚 친구" : "➡️ 팔로잉"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {isFriend
                          ? "서로 팔로우하는 친구예요"
                          : "내가 팔로우 중이에요"}
                      </p>
                    </div>

                    {/* 언팔로우 버튼 */}
                    {!isConfirming ? (
                      <button
                        onClick={() => setConfirmId(f.memberId)}
                        className="flex-shrink-0 text-xs px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600
                                   text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-400
                                   dark:hover:border-red-600 dark:hover:text-red-400
                                   transition-all duration-200"
                      >
                        언팔로우
                      </button>
                    ) : (
                      <div className="flex-shrink-0 flex gap-1.5">
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600
                                     text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700
                                     transition-all duration-200"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleUnfollow(f.follow_id)}
                          disabled={isProcessing}
                          className="text-xs px-2.5 py-1.5 rounded-xl bg-red-500 hover:bg-red-600
                                     text-white font-semibold disabled:opacity-50 transition-all duration-200"
                        >
                          {isProcessing ? "..." : "확인"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 하단 버튼 */}
        <button
          onClick={() => navigate("/mypage")}
          className="w-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300
                     font-semibold rounded-xl py-2.5 shadow-sm
                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
        >
          홈으로
        </button>
      </main>
    </div>
  );
}
