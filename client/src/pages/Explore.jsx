import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserInfo } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegComment, FaPlay } from "react-icons/fa";
import { BsImages } from "react-icons/bs";

const Explore = () => {
  const { BgColor, TxtColor, BorDerColor } = useContext(UserInfo);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/getAllPostsOfRandomUsers?page=1&limit=30`,
          { withCredentials: true }
        );
        setPosts(res.data.posts || []);
      } catch (err) {
        console.log("Error fetching explore posts:", err);
      }
      finally{
        setLoading(false);
      }
    };
    fetchRandomPosts();
  }, []);

  const gotoSearchPage = () => navigate("/search");

  const openPost = (post) => {
    const type = post.media?.[0]?.type;
    if (type === "image") navigate(`/getImages/${post._id}`);
    else if (type === "video") navigate(`/getVideo/${post._id}`);
  };

  

  return (
    <div className={`${BgColor} ${TxtColor} min-h-screen pb-20`}>
      {/* 🔍 Search Bar */}
      <div className="py-3 flex items-center justify-center sticky top-0 z-10 bg-opacity-95 backdrop-blur-md">
        <input
          type="text"
          placeholder="Search anyone..."
          className={`px-4 py-2 rounded-2xl border-2 ${BorDerColor} ${BgColor} ${TxtColor} w-[90%] sm:w-[60%] outline-none`}
          onClick={gotoSearchPage}
          readOnly
        />
      </div>

      {/* 🖼️ Explore Grid */}
      {loading ? (
          <p className={`text-center text-sm mt-6 ${BgColor} ${TxtColor} animate-pulse`}>
            Loading...
          </p>
        ) : (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-[2px]">
        {posts.map((post) => {
          const firstMedia = post.media[0];
          const isVideo = firstMedia?.type === "video";
          return (
            <div
              key={post._id}
              className="relative group cursor-pointer overflow-hidden"
              onClick={() => openPost(post)}
            >
              {/* Media */}
              {isVideo ? (
                <video
                  src={firstMedia.url}
                  className="w-full h-full object-cover aspect-square transform group-hover:scale-110 transition duration-300"
                  muted
                />
              ) : (
                <img
                  src={firstMedia.url}
                  alt=""
                  className="w-full h-full object-cover aspect-square transform group-hover:scale-110 transition duration-300"
                  loading="lazy"
                />
              )}

              {/* 🔘 Clean type badge */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 text-white text-[10px] sm:text-xs flex items-center justify-center">
                {isVideo ? (
                  <FaPlay className="text-white text-[10px]" />
                ) : (
                  <BsImages className="text-white text-[10px]" />
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 text-white transition duration-300">
                <div className="flex items-center gap-1 text-sm sm:text-base">
                  <FaHeart className="text-red-500" />
                  <span>{post.likes.length}</span>
                </div>
                <div className="flex items-center gap-1 text-sm sm:text-base">
                  <FaRegComment />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>)}
    </div>
  );
};

export default Explore;
