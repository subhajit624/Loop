import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserInfo } from "@/context/AuthContext";

const PostLikesUser = ({ postId, onClose }) => {
  const { BgColor, TxtColor,BorDerColor,loading ,setLoading } = useContext(UserInfo);
  const [users, setUsers] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchLikedUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/post/like/users/${postId}`, { withCredentials: true });
      setUsers(res.data.likedUsersDetails || []);
    } catch (err) {
      console.log("Error fetching liked users:", err);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => { fetchLikedUsers(); }, [postId]);

  if(loading){
    <div className={`${BgColor} ${TxtColor}`}>
        loading...
    </div>
   }

  return (
    <div className={` fixed inset-0 z-50 flex flex-col items-center justify-center p-4`}>
      <div className={` ${BgColor} ${TxtColor} border-2 ${BorDerColor} w-full max-w-md rounded-xl p-4 max-h-[80vh] overflow-y-auto`}>
        <button onClick={onClose} className="self-end text-xl font-bold mb-2 cursor-pointer">×</button>
        <h2 className="font-semibold text-lg mb-2">Liked by</h2>
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u._id} className="flex items-center gap-3 py-1">
              <img src={u.avatar || "/default-avatar.png"} alt={u.username} className="w-8 h-8 rounded-full object-cover"/>
              <p>{u.username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostLikesUser;
