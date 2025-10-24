import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserInfo } from "@/context/AuthContext";
import toast from "react-hot-toast";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
    { label: "sec", seconds: 1 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

const Comment = ({ postId, onClose }) => {
  const { authUser, BgColor, TxtColor, BorDerColor } = useContext(UserInfo);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const logo1 =
    "https://static.vecteezy.com/system/resources/previews/022/841/114/original/chatgpt-logo-transparent-background-free-png.png";

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/comment/getAllcomments/${postId}`,
        { withCredentials: true }
      );
      setComments(res.data.comments || []);
    } catch (err) {
      console.log("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const airesponse = async () => {
    if (!authUser) {
      toast.error("login to use this feature");
      return;
    }
    if (!text.trim()) return;
    setAiLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/ai/response`,
        { normal: text },
        { withCredentials: true }
      );
      setText(res.data.comment);
    } catch (error) {
      toast.error("feature is shut down");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!authUser) {
      toast.error("Login to comment");
      return;
    }
    if (!text.trim()) return;
    setSendLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/comment/create/${postId}`,
        { text },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, res.data.comment]);
      setText("");
    } catch (err) {
      console.log("Error sending comment:", err);
    } finally {
      setSendLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`${BgColor} ${TxtColor} border-2 ${BorDerColor} w-full max-w-md rounded-xl p-4 flex flex-col max-h-[80vh] overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="self-end text-xl font-bold mb-2 cursor-pointer"
        >
          ×
        </button>

        <h2 className="font-semibold text-lg mb-2">Comments</h2>

        {/* Loading comments */}
        {loading ? (
          <div className={`flex justify-center items-center ${BgColor} ${TxtColor} h-40`}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 mb-2">
              {comments.map((c) => (
                <div key={c._id} className="pb-1">
                  <div className="flex gap-2 items-center">
                    <img
                      src={c.author.avatar || "/default-avatar.png"}
                      alt="Author"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <p className="font-semibold">
                      {authUser?.username === c.author.username
                        ? "You"
                        : c.author.username}
                    </p>
                    <span className="text-xs text-gray-400">
                      {timeAgo(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm pl-10">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            {authUser && (
              <div className="flex gap-2 mt-2 items-center">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={`flex-1 rounded px-2 py-1 border-2 ${BgColor} ${TxtColor} ${BorDerColor}`}
                  placeholder="Add a comment..."
                />

                {/* Send Button with Spinner */}
                <button
                  onClick={handleSendComment}
                  disabled={sendLoading}
                  className={`px-3 py-1 border-2 ${BgColor} ${TxtColor} ${BorDerColor} rounded cursor-pointer flex items-center justify-center`}
                >
                  {sendLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
