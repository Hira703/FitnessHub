import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { useSocket } from "../../../context/SocketContext";
import { FaPaperPlane } from "react-icons/fa";
import axiosSecure from "../../../api/axiosSecure";
import { Helmet } from "react-helmet-async";

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const TrainerMessages = () => {
  const { backendUser } = useContext(AuthContext);
  const socket = useSocket();

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);

  const getConversationId = (memberEmail) => {
    return [backendUser.email, memberEmail].sort().join("__");
  };

  // Fetch booked members
  useEffect(() => {
    const fetchBookedMembers = async () => {
      try {
        const res = await axiosSecure.get(`/api/payments/trainer/booked-members/${backendUser?.email}`);
        setMembers(res.data);
      } catch (error) {
        console.error("Error fetching members", error);
      }
    };

    if (backendUser?.email) fetchBookedMembers();
  }, [backendUser]);

  // Join socket room and receive messages
  useEffect(() => {
    if (!socket || !backendUser?.email) return;

    socket.emit("joinTrainer", backendUser.email);

    socket.on("newMessage", (msg) => {
      const expectedConversationId = selectedMember && getConversationId(selectedMember.email);
      if (msg.conversationId === expectedConversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, backendUser?.email, selectedMember]);

  // Scroll to bottom when new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Select member and load conversation
  const handleSelectMember = async (member) => {
    setSelectedMember(member);
    const conversationId = getConversationId(member.email);
    try {
      const res = await axiosSecure.get(`/api/messages/${conversationId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error loading messages", err);
    }
  };

  // Send message (emit + save)
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMember) return;

    const conversationId = getConversationId(selectedMember.email);

    const msg = {
      conversationId,
      senderEmail: backendUser.email,
      receiverEmail: selectedMember.email,
      text: newMessage.trim(),
    };

    try {
      // Emit to socket
      socket.emit("sendMessage", msg);

      // Save to DB
      await axiosSecure.post("/api/messages", msg);

      // Optimistically update UI
      setMessages((prev) => [...prev, { ...msg, timestamp: new Date() }]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <>
     <Helmet>
        <title>Trainer Messages</title>
        <meta name="description" content="Welcome to Login page" />
      </Helmet>
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-gray-50 rounded shadow-lg overflow-hidden">
      {/* Left: Member list */}
      <div className="md:w-1/3 w-full bg-white border-r border-gray-200 p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        <h2
          className="text-2xl font-extrabold mb-6 text-[#1D4ED8]"
          style={{ letterSpacing: '1px' }}
        >
          Booked Members
        </h2>
        <ul className="space-y-3">
          {members.length === 0 && (
            <p className="text-gray-400 text-center mt-10">No booked members found.</p>
          )}
          {members.map((member) => (
            <li
              key={member._id}
              onClick={() => handleSelectMember(member)}
              className={`cursor-pointer rounded-lg px-4 py-3 transition-colors duration-200 select-none ${
                selectedMember?.email === member.email
                  ? "bg-[#1D4ED8] text-white shadow-lg"
                  : "hover:bg-[#BFDBFE] text-gray-700"
              }`}
            >
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-500 truncate">{member.email}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Chat area */}
      <div className="md:w-2/3 w-full flex flex-col bg-white rounded-tr-lg rounded-br-lg shadow-inner">
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1D4ED8] via-[#10B981] to-[#F59E0B] text-white font-bold text-lg select-none">
          {selectedMember ? `Chat with ${selectedMember.name}` : "Select a member to start chatting"}
        </div>

        <div
          className="flex-grow overflow-y-auto p-6 space-y-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: `${COLORS[0]} #f3f4f6` }}
        >
          {selectedMember ? (
            messages.length === 0 ? (
              <p className="text-center text-gray-400 mt-10 select-none">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.senderEmail === backendUser.email ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      msg.senderEmail === backendUser.email
                        ? "bg-[#1D4ED8] text-white shadow-lg"
                        : "bg-[#E0F2FE] text-[#1D4ED8] shadow-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )
          ) : (
            <p className="text-gray-500 text-center mt-20 select-none">
              Select a member to start chatting.
            </p>
          )}
          <div ref={messageEndRef} />
        </div>

        {/* Message input */}
        {selectedMember && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-grow rounded-full border border-gray-300 focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#10B981] px-5 py-2 text-gray-700 placeholder-gray-400 transition outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#10B981] hover:bg-[#0f846d] text-white rounded-full px-5 py-2 flex items-center gap-2 shadow-md transition"
              aria-label="Send message"
            >
              <FaPaperPlane />
              Send
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default TrainerMessages;
