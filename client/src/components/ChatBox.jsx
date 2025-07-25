import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";

const COLORS = {
  primary: "#1D4ED8", // blue
  success: "#10B981", // green
  warning: "#F59E0B", // amber
  danger: "#EF4444", // red
};

const ChatBox = ({ senderEmail, receiverEmail }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef();
  const conversationId = [senderEmail, receiverEmail].sort().join("__");

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:5000/api/messages/${conversationId}`);
      const data = await res.json();
      setMessages(data);
    };
    if (conversationId) fetchMessages();
  }, [conversationId]);

  // Receive messages via socket
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("newMessage");
  }, [socket, conversationId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const message = {
      conversationId,
      senderEmail,
      receiverEmail,
      text,
    };

    socket?.emit("sendMessage", message);

    await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
    setText("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-5 flex flex-col"
      style={{ minHeight: "450px" }}
    >
      <header className="mb-4 flex justify-between items-center border-b border-gray-300 pb-2">
        <h2
          className="text-2xl font-extrabold text-[var(--primary-color)]"
          style={{ color: COLORS.primary }}
        >
          Live Chat
        </h2>
      </header>

      <main
        className="flex-grow overflow-y-auto p-4 bg-gray-50 rounded-xl space-y-3 shadow-inner scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200"
        style={{ maxHeight: "calc(100% - 120px)" }}
      >
        {messages.length === 0 && (
          <p className="text-center text-gray-400 italic mt-10 select-none">No messages yet. Say hello!</p>
        )}
        {messages.map((msg, idx) => {
          const isSender = msg.senderEmail === senderEmail;
          return (
            <div
              key={idx}
              className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm break-words shadow-md
                ${isSender
                  ? "ml-auto bg-[var(--primary-color)] text-white rounded-br-none"
                  : "mr-auto bg-[var(--success-color)] text-white rounded-bl-none"
                }`}
              style={{
                backgroundColor: isSender ? COLORS.primary : COLORS.success,
              }}
            >
              {msg.text}
              <div className="mt-1 text-xs opacity-70 text-right select-none">
                {msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : ""}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="mt-5 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-grow rounded-xl border border-gray-300 px-4 py-3 text-gray-700 text-base placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
          style={{ borderColor: COLORS.primary }}
        />
        <button
          onClick={handleSend}
          className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-xl font-semibold shadow-lg
          hover:bg-opacity-90 transition flex items-center justify-center gap-2 select-none"
          style={{ backgroundColor: COLORS.primary }}
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatBox;
