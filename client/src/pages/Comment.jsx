import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserInfo } from "@/context/AuthContext";
import toast from "react-hot-toast";

const Comment = ({ postId, onClose }) => {
  const { authUser, BgColor, TxtColor, BorDerColor,loading,setLoading } = useContext(UserInfo);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/comment/getAllcomments/${postId}`, { withCredentials: true });
      setComments(res.data.comments || []);
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
    finally{
        setLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!authUser) {
      toast.error("Login to comment");
      return;
    }
    if (!text.trim()) return;
    try {
      const res = await axios.post(`${BACKEND_URL}/api/comment/create/${postId}`, { text }, { withCredentials: true });
      setComments((prev) => [...prev, res.data.comment]);
      setText("");
    } catch (err) {
      console.log("Error sending comment:", err);
    }
  };

  useEffect(() => { fetchComments(); }, [postId]);

  if(loading){
    <div className={`${BgColor} ${TxtColor}`}>
        Loading...
    </div>
  }

  return (
    <div className={` fixed inset-0 z-50 flex flex-col items-center justify-center ${BorDerColor} p-4`}>
      <div className={`${BgColor} ${TxtColor} border-2 ${BorDerColor} w-full max-w-md rounded-xl p-4 flex flex-col max-h-[80vh] overflow-y-auto`}>
        <button onClick={onClose} className="self-end text-xl font-bold mb-2 cursor-pointer">×</button>
        <h2 className="font-semibold text-lg mb-2">Comments</h2>
        <div className="flex flex-col gap-2 mb-2">
          {comments.map((c) => (
            <div key={c._id} className=" pb-1">
              <div className="flex gap-3">
                <img src={c.author.avatar || "/default-avatar.png"} alt="Author logo" className="w-8 h-8 rounded-full object-cover"/>
                <p className="font-semibold">{authUser?.username === c.author.username ? "You" : c.author.username}</p>
              </div>
              <p className="text-sm pl-12">{c.text}</p>
            </div>
          ))}
        </div>
        {authUser && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`flex-1 rounded px-2 py-1 border-2 ${BgColor} ${TxtColor} ${BorDerColor}`}
              placeholder="Add a comment..."
            />
            <button onClick={handleSendComment} className={`px-3 py-1 border-2 ${BgColor} ${TxtColor} ${BorDerColor} rounded cursor-pointer`}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
