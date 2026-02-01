import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserInfo } from "@/context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Messages = () => {
  const { authUser, BgColor, TxtColor, BorDerColor } = useContext(UserInfo);
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Create socket only once
  const socket = useMemo(() => {
    return io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });
  }, []);

  // SOCKET LOGIC
  useEffect(() => {
    if (!socket || !authUser?._id) return;

    const onConnect = () => {
      socket.emit("userOnline", authUser._id);
    };

    const onOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("connect", onConnect);
    socket.on("onlineUsers", onOnlineUsers);

    return () => {
      socket.off("connect", onConnect);
      socket.off("onlineUsers", onOnlineUsers);
      socket.disconnect();
    };
  }, [socket, authUser]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/conversation/getAllConversationsUsers`,
          { withCredentials: true }
        );
        setConversations(res.data.conversations);
      } catch (error) {
        console.log("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const handleConversationClick = (participants) => {
    const anotherUser = participants.find((p) => p._id !== authUser._id);
    if (anotherUser) navigate(`/conversation/${anotherUser._id}`);
  };

  if (loading) {
    return (
      <div className={`${BgColor} ${TxtColor} h-screen flex items-center justify-center`}>
        Loading conversations...
      </div>
    );
  }

  return (
    <div className={`${BgColor} ${TxtColor} min-h-screen flex justify-center p-3 sm:p-4`}>
      <div className="w-full max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Messages</h2>

        {conversations.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No conversations yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {conversations.map((conv) => {
              const anotherUser = conv.participants.find(
                (p) => p._id !== authUser._id
              );
              const lastMessage = conv.messages[0];
              const isOnline = onlineUsers.includes(anotherUser?._id);

              return (
                <div
                  key={conv._id}
                  onClick={() => handleConversationClick(conv.participants)}
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-2xl cursor-pointer border ${BorDerColor} hover:bg-gray-400 dark:hover:bg-gray-800 transition`}
                >
                  {/* Avatar + Online Dot */}
                  <div className="relative">
                    <img
                      src={anotherUser?.avatar}
                      alt={anotherUser?.username}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                    />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-base sm:text-lg truncate">
                      {anotherUser?.username}
                    </span>
                    <span className="text-sm text-gray-500 truncate">
                      {lastMessage
                        ? lastMessage.text
                          ? lastMessage.text
                          : lastMessage.media?.type === "image"
                          ? "📷 Image"
                          : lastMessage.media?.type === "video"
                          ? "🎥 Video"
                          : "Media"
                        : "No messages yet"}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
