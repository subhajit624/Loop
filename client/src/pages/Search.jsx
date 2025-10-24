import React, { useContext, useState } from "react";
import { AllUserInfo } from "@/context/AllUserContext";
import { UserInfo } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const { authUser, BgColor, TxtColor, BorDerColor } = useContext(UserInfo);
  const { alluserinfo } = useContext(AllUserInfo);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filter users by fullname or username (case-insensitive)
  const filteredUsers = alluserinfo?.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.fullname.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term)
    );
  });

  const handleClick = (userId) => {
    if (authUser?._id === userId) {
      navigate("/profile");
    } else {
      navigate(`/anotherUser/${userId}`);
    }
  };

  return (
    <div className={`${BgColor} ${TxtColor} min-h-screen p-4`}>
      {/* 🔙 Back Button */}
      <div className="flex items-center mb-3">
        <button
          onClick={() => navigate("/explore")}
          className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium hover:bg-gray-200 hover:dark:bg-gray-800 transition"
        >
          ← Back
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center items-center">
        <input
          type="text"
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${BorDerColor} border-2 rounded-2xl my-3 px-4 py-2 w-full md:w-1/2 outline-none`}
        />
      </div>

      {/* 🧑‍🤝‍🧑 Search Results */}
      <div className="flex flex-col items-center gap-3 mt-4">
        {searchTerm && filteredUsers?.length === 0 && (
          <p className="text-gray-500">No user found</p>
        )}

        {searchTerm &&
          filteredUsers?.map((user) => (
            <div
              key={user._id}
              onClick={() => handleClick(user._id)}
              className={`cursor-pointer w-full md:w-1/2 flex items-center justify-between p-3 border ${BorDerColor} rounded-2xl hover:bg-gray-400 hover:dark:bg-gray-800 transition-all duration-200`}
            >
              {/* Left: Avatar and Info */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.avatar
                      ? user.avatar
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{user.fullname}</span>
                  <span className="text-sm text-gray-500">@{user.username}</span>
                </div>
              </div>

              {/* Right: Stats */}
              <div className="flex flex-col items-end text-sm text-gray-500">
                <span>
                  <b>{user.followers?.length || 0}</b> followers
                </span>
                <span>
                  <b>{user.following?.length || 0}</b> following
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;
