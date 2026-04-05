import {useState, useRef, useEffect} from "react";
import cookie from "react-cookies";

interface Message {
  role: "user" | "ai";
  text: string;
}

function SparkleIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a3.375 3.375 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a3.375 3.375 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "안녕하세요! 저는 JUNGS AI입니다 ✨\n무엇이든 편하게 물어보세요!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, {role: "user", text}]);
    setInput("");
    setLoading(true);

    try {
      const access_token = cookie.load("accessToken") ?? "";
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access_token ? {Authorization: "Bearer " + access_token} : {}),
        },
        body: JSON.stringify({message: text}),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.result_data ?? data.message ?? "응답을 받지 못했어요.";
      setMessages((prev) => [...prev, {role: "ai", text: reply}]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {role: "ai", text: "오류가 발생했어요. 다시 시도해주세요."},
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* 채팅 창 */}
      {open && (
        <div
          className="w-80 sm:w-96 rounded-2xl flex flex-col overflow-hidden"
          style={{
            height: "500px",
            background: "linear-gradient(160deg, #141414, #1a1218, #161214)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* 헤더 */}
          <div
            className="relative px-4 py-3 flex items-center justify-between overflow-hidden"
            style={{background: "linear-gradient(135deg, #fb923c, #f43f5e)"}}
          >
            {/* 격자 패턴 */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 9px), repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 9px)",
              }}
            />
            <div className="relative flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <SparkleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm tracking-wider">
                  JUNGS AI
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <p className="text-white/70 text-xs tracking-wide">온라인</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="relative text-white/70 hover:text-white transition-colors hover:rotate-90 duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(251,146,60,0.2) transparent",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "ai" && (
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #c2601e, #b84060)",
                      boxShadow: "none",
                    }}
                  >
                    <SparkleIcon className="w-3.5 h-3.5 text-white/80" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
                    ${
                      msg.role === "user"
                        ? "rounded-2xl rounded-br-sm"
                        : "rounded-2xl rounded-bl-sm"
                    }`}
                  style={
                    msg.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, #c2601e, #a83050)",
                          color: "rgba(255,255,255,0.92)",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.75)",
                        }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* 로딩 */}
            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #c2601e, #b84060)",
                  }}
                >
                  <SparkleIcon className="w-3.5 h-3.5 text-white/80" />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{background: "#c2601e", animationDelay: "0ms"}}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{background: "#b05060", animationDelay: "150ms"}}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{background: "#a04070", animationDelay: "300ms"}}
                  />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 입력창 */}
          <div
            className="px-3 py-3 flex gap-2 items-center"
            style={{
              background: "rgba(0,0,0,0.3)",
              borderTop: "1px solid rgba(251,146,60,0.15)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              disabled={loading}
              className="flex-1 text-sm px-4 py-2.5 rounded-xl focus:outline-none disabled:opacity-50 transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(251,146,60,0.25)",
                color: "rgba(255,255,255,0.9)",
              }}
              onFocus={(e) =>
                (e.target.style.border = "1px solid rgba(251,146,60,0.7)")
              }
              onBlur={(e) =>
                (e.target.style.border = "1px solid rgba(251,146,60,0.25)")
              }
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #fb923c, #f43f5e)",
                boxShadow: "0 4px 15px rgba(251,146,60,0.5)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #fb923c, #fb7185)",
            boxShadow:
              "0 8px 30px rgba(251,146,60,0.55), 0 0 0 1px rgba(251,146,60,0.2)",
          }}
          aria-label="AI 챗봇 열기"
        >
          {/* 버튼 광택 */}
          <div
            className="absolute inset-0 rounded-2xl opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.5) 0%, transparent 60%)",
            }}
          />
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="relative w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <SparkleIcon className="relative w-8 h-8 text-white" />
          )}
          {!open && (
            <span
              className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black text-white"
              style={{
                background: "linear-gradient(135deg, #1c1c2e, #2d1b4e)",
                border: "1px solid rgba(251,146,60,0.4)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              AI
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
