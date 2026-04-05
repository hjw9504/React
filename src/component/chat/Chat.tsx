import {useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import cookie from "react-cookies";
import HeadersNew from "../utils/HeadersNew";

interface ChattingDto {
  type: "ENTER" | "TALK" | "LEAVE";
  room_id?: number;
  room_name?: string;
  token?: string;
  sender: string;
  message: string;
  member_id?: string;
  user_id?: string;
  time?: string;
}

interface ChatHistoryItem {
  message: string;
  member_id: string;
  sender: string;
  room_id: number;
  user_id: string | null;
  register_time: string;
}

interface ChatRoom {
  room_id: number;
  name: string;
  register_time?: string;
}

const BACKEND_URL = "";

const Chat = () => {
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChattingDto[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const roomNameInputRef = useRef<HTMLInputElement>(null);
  const currentRoomRef = useRef<ChatRoom | null>(null);
  const sender = cookie.load("userId") || cookie.load("name") || "익명";
  const memberId = cookie.load("memberId") || "";
  const token = cookie.load("token") ?? "";

  useEffect(() => {
    currentRoomRef.current = currentRoom ?? null;
  }, [currentRoom]);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/chat/room", {
        method: "GET",
        headers: {"Content-Type": "application/json", token},
      });
      const data = await res.json();
      setRooms(data.result_data || []);
    } catch {
      console.error("채팅방 목록 조회 실패");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 채팅 히스토리 조회
  const fetchMessages = async (roomId: number): Promise<ChattingDto[]> => {
    try {
      const res = await fetch(`/api/chat/message?room_id=${roomId}`, {
        method: "GET",
        headers: {"Content-Type": "application/json", token},
      });
      const data = await res.json();
      const history: ChatHistoryItem[] = data.result_data || [];
      return history.map((item) => {
        const isSystem =
          item.message.includes("님이 입장하셨습니다") ||
          item.message.includes("님이 퇴장하셨습니다");
        const time = new Date(item.register_time + "Z").toLocaleTimeString(
          "ko-KR",
          {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Seoul",
          }
        );
        return {
          type: isSystem ? "ENTER" : "TALK",
          sender: item.user_id || item.sender,
          member_id: item.member_id,
          user_id: item.user_id || item.sender,
          message: item.message,
          time,
        };
      });
    } catch {
      console.error("채팅 히스토리 조회 실패");
      return [];
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/chat/room", {
        method: "POST",
        headers: {"Content-Type": "application/json", token},
        body: JSON.stringify({room_name: newRoomName.trim()}),
      });
      if (res.ok) {
        setNewRoomName("");
        setShowCreateForm(false);
        await fetchRooms();
      }
    } catch {
      console.error("채팅방 생성 실패");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws-chat`),
      reconnectDelay: 5000,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    });
    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leaveRoom = () => {
    const c = clientRef.current;
    const room = currentRoomRef.current;
    if (!c || !room) return;
    if (c.connected) {
      c.publish({
        destination: "/pub/message",
        body: JSON.stringify({
          type: "LEAVE",
          room_id: room.room_id,
          room_name: room.name,
          member_id: memberId,
          token,
          sender,
          message: "",
        }),
      });
    }
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
  };

  const joinRoom = async (room: ChatRoom) => {
    if (!clientRef.current?.connected) return;

    // 구독만 해제, LEAVE 미전송 (나가기 버튼 클릭 시에만 LEAVE 호출)
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    setCurrentRoom(room);
    setTimeout(() => inputRef.current?.focus(), 100);

    // 히스토리 먼저 로드
    const history = await fetchMessages(room.room_id);
    setMessages(history);

    subscriptionRef.current = clientRef.current.subscribe(
      `/sub/chat/room/${room.room_id}`,
      (frame) => {
        const msg: ChattingDto = JSON.parse(frame.body);
        msg.time = new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setMessages((prev) => [...prev, msg]);
      }
    );

    clientRef.current.publish({
      destination: "/pub/message",
      body: JSON.stringify({
        type: "ENTER",
        room_id: room.room_id,
        room_name: room.name,
        member_id: memberId,
        token,
        sender,
        message: "",
      }),
    });
  };

  const handleLeave = () => {
    leaveRoom();
    setCurrentRoom(null);
    setMessages([]);
  };

  const sendMessage = () => {
    if (!input.trim() || !currentRoom || !clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: "/pub/message",
      body: JSON.stringify({
        type: "TALK",
        room_id: currentRoom.room_id,
        room_name: currentRoom.name,
        member_id: memberId,
        token,
        sender,
        message: input.trim(),
      }),
    });
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRoomNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      createRoom();
    }
  };

  const isMyMessage = (msg: ChattingDto) =>
    msg.sender === sender || msg.member_id === memberId;
  const isSystemMessage = (msg: ChattingDto) =>
    msg.type === "ENTER" || msg.type === "LEAVE";

  const roomListJsx = (
    <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
      {/* 연결 상태 */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
          connected
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
            : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            connected ? "bg-green-500 animate-pulse" : "bg-red-500"
          }`}
        />
        {connected ? "서버 연결됨" : "연결 중..."}
      </div>

      {/* 방 만들기 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          채팅방
        </p>
        {showCreateForm ? (
          <div className="flex flex-col gap-2">
            <input
              ref={roomNameInputRef}
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyDown={handleRoomNameKeyDown}
              placeholder="방 이름 입력"
              autoFocus
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            <div className="flex gap-2">
              <button
                onClick={createRoom}
                disabled={creating || !newRoomName.trim()}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-400 to-red-500 text-white disabled:opacity-40 transition"
              >
                {creating ? "생성 중..." : "생성"}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewRoomName("");
                }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 transition hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-400 to-red-500 text-white hover:opacity-90 transition"
          >
            + 새 채팅방 만들기
          </button>
        )}
      </div>

      {/* 채팅방 목록 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 flex flex-col gap-1 flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <p className="text-xs text-center text-gray-400 dark:text-gray-600 py-4">
            채팅방이 없어요
          </p>
        ) : (
          rooms.map((room) => (
            <button
              key={room.room_id}
              onClick={() => joinRoom(room)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                currentRoom?.room_id === room.room_id
                  ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                #
              </div>
              <span className="flex-1 truncate">{room.name}</span>
              {currentRoom?.room_id === room.room_id && (
                <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );

  const messageAreaJsx = (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 bg-gray-50 dark:bg-gray-950">
        {messages.map((msg, idx) => {
          const prevMsg = messages[idx - 1];
          const isSameSender =
            !isSystemMessage(msg) &&
            prevMsg &&
            !isSystemMessage(prevMsg) &&
            prevMsg.sender === msg.sender;
          const isLast =
            idx === messages.length - 1 ||
            messages[idx + 1]?.sender !== msg.sender ||
            isSystemMessage(messages[idx + 1]);

          if (isSystemMessage(msg)) {
            if (!msg.message) return null;
            return (
              <div key={idx} className="flex justify-center my-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                  {msg.message}
                </span>
              </div>
            );
          }

          if (isMyMessage(msg)) {
            return (
              <div
                key={idx}
                className={`flex justify-end items-end gap-1.5 ${
                  isSameSender ? "mt-0.5" : "mt-3"
                }`}
              >
                {isLast && (
                  <span className="text-[11px] text-gray-400 self-end mb-1">
                    {msg.time}
                  </span>
                )}
                <div
                  className={`max-w-[75%] md:max-w-[60%] bg-gradient-to-br from-orange-400 to-rose-500 text-white px-4 py-2.5 shadow-sm text-sm leading-relaxed break-words
                  ${
                    isSameSender
                      ? "rounded-2xl rounded-tr-md"
                      : "rounded-2xl rounded-tr-sm"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex items-end gap-2 ${
                isSameSender ? "mt-0.5" : "mt-3"
              }`}
            >
              {/* 아바타: 연속 메시지면 투명 자리만 유지 */}
              {isLast ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                  {(msg.user_id || msg.sender || "?").charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="w-8 flex-shrink-0" />
              )}
              <div className="min-w-0 max-w-[75%] md:max-w-[60%]">
                {!isSameSender && (
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1 truncate">
                    {msg.user_id || msg.sender}
                  </p>
                )}
                <div className="flex items-end gap-1.5">
                  <div
                    className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2.5 shadow-sm border border-gray-100 dark:border-gray-700 text-sm leading-relaxed break-words
                    ${
                      isSameSender
                        ? "rounded-2xl rounded-tl-md"
                        : "rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.message}
                  </div>
                  {isLast && (
                    <span className="text-[11px] text-gray-400 self-end mb-1 whitespace-nowrap">
                      {msg.time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 items-center bg-gray-50 dark:bg-gray-800 rounded-2xl px-3 py-1.5 border border-gray-200 dark:border-gray-700 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={connected ? "메시지를 입력하세요..." : "연결 중..."}
            disabled={!connected}
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none disabled:opacity-50 py-1"
          />
          <button
            onClick={sendMessage}
            disabled={!connected || !input.trim()}
            className="w-8 h-8 rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 text-white disabled:opacity-30 flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <HeadersNew />

      {/* 모바일: 방 목록 */}
      {!currentRoom && (
        <div className="flex-1 flex flex-col md:hidden px-4 py-4 gap-3 overflow-y-auto">
          {roomListJsx}
        </div>
      )}

      {/* 모바일: 채팅 화면 */}
      {currentRoom && (
        <div
          className="flex-1 flex flex-col md:hidden"
          style={{height: "calc(100vh - 64px)"}}
        >
          {/* 모바일 채팅 헤더 */}
          <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 shadow-sm">
            <button
              onClick={handleLeave}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              #
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                {currentRoom.name}
              </h2>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    connected ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                />
                <p className="text-xs text-gray-400">
                  {connected ? "연결됨" : "연결 끊김"}
                </p>
              </div>
            </div>
          </div>
          {messageAreaJsx}
        </div>
      )}

      {/* 데스크탑 레이아웃 */}
      <div
        className="hidden md:flex flex-1 max-w-5xl w-full mx-auto px-4 py-6 gap-4"
        style={{height: "calc(100vh - 80px)"}}
      >
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          {roomListJsx}
        </div>

        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* 데스크탑 채팅 헤더 */}
          <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-white dark:bg-gray-900">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              {currentRoom ? "#" : "💬"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                {currentRoom ? currentRoom.name : "채팅방을 선택하세요"}
              </h2>
              {currentRoom ? (
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      connected ? "bg-green-400 animate-pulse" : "bg-red-400"
                    }`}
                  />
                  <p className="text-xs text-gray-400">
                    {connected ? "연결됨" : "연결 끊김"}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  왼쪽 목록에서 방을 선택하세요
                </p>
              )}
            </div>
            {currentRoom && (
              <button
                onClick={handleLeave}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
                나가기
              </button>
            )}
          </div>

          {!currentRoom ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-950">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-900/20 dark:to-rose-900/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-orange-400 dark:text-orange-500 opacity-70"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-gray-500 dark:text-gray-400">
                  채팅방을 선택해보세요
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                  왼쪽에서 방을 선택하거나 새로 만들어보세요
                </p>
              </div>
            </div>
          ) : (
            messageAreaJsx
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
