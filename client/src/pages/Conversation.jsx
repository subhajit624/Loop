import { UserInfo } from "@/context/AuthContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPaperPlane, FaRegImage, FaTimes } from "react-icons/fa";

const Conversation = () => {
  const { anotherUserId } = useParams();
  const { authUser, BgColor, TxtColor, BorDerColor } = useContext(UserInfo);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [anotherUser, setAnotherUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Fetch conversation
  const fetchConversation = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversation/getOrCreateConversation/${anotherUserId}`,
        { withCredentials: true }
      );
      const data = res.data.conversation;
      setConversation(data);
      setMessages(data.messages || []);
      const user = data.participants.find((p) => p._id !== authUser._id);
      setAnotherUser(user);
    } catch (error) {
      console.log("Error fetching conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [anotherUserId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    try {
      const formData = new FormData();
      formData.append("text", newMessage);
      if (file) formData.append("image", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/send/${anotherUserId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newMsg = res.data.message;
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      setFile(null);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className={`${BgColor} ${TxtColor} h-screen flex items-center justify-center`}>
        Loading conversation...
      </div>
    );
  }

  return (
    <div className={`${BgColor} ${TxtColor} min-h-screen flex flex-col items-center`}>
      {/* Header */}
      <div className={`flex items-center gap-3 p-3 border-b ${BorDerColor} w-full max-w-2xl sticky top-0 bg-opacity-90 backdrop-blur-sm z-10`}>
        <button onClick={() => navigate(-1)} className="text-lg text-gray-600 dark:text-gray-300 hover:text-blue-500 cursor-pointer">
          <FaArrowLeft size={20} />
        </button>

        {anotherUser && (
          <div className="flex items-center gap-3">
            <img src={anotherUser.avatar} alt={anotherUser.username} className="w-10 h-10 rounded-full object-cover" />
            <span className="font-semibold text-lg">{anotherUser.username}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto px-2 sm:px-5 py-4 w-full max-w-2xl space-y-4`}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No messages yet. Start the conversation 👋</div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`flex ${msg.sender?._id === authUser._id ? "justify-end" : "justify-start"} mb-2`}>
              {msg.sender?._id !== authUser._id && (
                <img src={msg.sender?.avatar} alt={msg.sender?.username} className="w-8 h-8 rounded-full object-cover mr-2 self-end" />
              )}

              <div className="relative flex flex-col max-w-xs sm:max-w-md">
                {/* Image message */}
                {msg.media?.url && (
                  <div className="relative group">
                    <img
                      src={msg.media.url}
                      alt="media"
                      className="rounded-xl max-h-72 w-auto object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {msg.text && (
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs break-words">
                        {msg.text}
                      </span>
                    )}
                  </div>
                )}

                {/* Text-only message */}
                {!msg.media?.url && msg.text && (
                  <div className={`p-2 px-3 rounded-2xl text-sm break-words ${
                    msg.sender?._id === authUser._id
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-400 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"
                  }`}>
                    {msg.text}
                  </div>
                )}
              </div>

              {msg.sender?._id === authUser._id && (
                <img src={msg.sender?.avatar} alt={msg.sender?.username} className="w-8 h-8 rounded-full object-cover ml-2 self-end" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Input / Footer */}
      <form onSubmit={handleSend} className={`flex items-center gap-2 p-3 border-t ${BorDerColor} w-full max-w-2xl`}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 bg-transparent outline-none text-sm sm:text-base px-3 py-2 rounded-full border ${BorDerColor}`}
        />

        {/* Image preview */}
        {file && (
          <div className="relative">
            <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 rounded-xl object-cover border cursor-pointer" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              onClick={() => setFile(null)}
            >
              <FaTimes size={12} />
            </button>
          </div>
        )}

        {/* Image select */}
        <label className="cursor-pointer text-gray-600 hover:text-blue-500">
          <FaRegImage size={22} />
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer">
          <FaPaperPlane size={20} />
        </button>
      </form>
    </div>
  );
};

export default Conversation;
