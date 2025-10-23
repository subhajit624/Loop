import React, { useContext, useEffect, useState } from "react";
import { UserInfo } from "@/context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaArrowLeft,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Comment from "./Comment";
import PostLikesUser from "./PostLikesUser";

const GetImages = () => {
  const { postId } = useParams();
  const { authUser, BgColor, TxtColor } = useContext(UserInfo);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [openLikes, setOpenLikes] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // 🟢 Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/post/getImages/${postId}`, {
          withCredentials: true,
        });
        setPost(res.data.post);
        setLiked(res.data.post.likes.includes(authUser?._id));
        setFollowing(authUser?.following?.includes(res.data.post.author._id));

        // check saved
        const savedRes = await axios.get(`${BACKEND_URL}/api/save/showAllSavedPosts`, {
          withCredentials: true,
        });
        const savedIds = savedRes.data.savedPosts.map((item) => item.post._id);
        setSaved(savedIds.includes(res.data.post._id));
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, authUser]);

  // 🟢 Like handler
  const handleLike = async () => {
    if (!authUser) return navigate("/login");
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/post/like/${post._id}`,
        {},
        { withCredentials: true }
      );
      setPost((prev) => ({ ...prev, likes: data.likes }));
      setLiked((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  // 🟢 Save handler
  const handleSave = async () => {
    if (!authUser) return navigate("/login");
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/save/${post._id}`,
        {},
        { withCredentials: true }
      );
      setSaved((prev) => !prev);
      toast.success(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  // 🟢 Follow handler
  const handleFollow = async () => {
    if (!authUser) return navigate("/login");
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/follow/${post.author._id}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
      setFollowing((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  // 🟢 Delete post handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/post/deletePost/${post._id}`, {
        withCredentials: true,
      });
      toast.success("Post deleted successfully");
      navigate("/explore");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div
        className={`${BgColor} ${TxtColor} min-h-screen flex items-center justify-center text-lg font-semibold`}
      >
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className={`${BgColor} ${TxtColor} min-h-screen flex items-center justify-center`}
      >
        Post not found
      </div>
    );
  }

  return (
    <div className={`${BgColor} ${TxtColor} min-h-screen flex justify-center`}>
      <div className="w-full max-w-2xl py-5 relative">
        {/* 🟢 Back Arrow */}
        <button
          onClick={() => navigate("/explore")}
          className="absolute left-3 top-1 md:top-2 bg-gray-800/60 hover:bg-gray-700 text-white p-2 rounded-full transition"
          title="Back to Explore"
        >
          <FaArrowLeft />
        </button>

        {/* 🟢 Delete Button */}
        {authUser?._id === post.author._id && (
          <button
            onClick={handleDelete}
            className="absolute right-3 top-1 md:top-2 bg-red-600/80 hover:bg-red-500 text-white p-2 rounded-full transition"
            title="Delete Post"
          >
            <FaTrash />
          </button>
        )}

        {/* Author Section */}
        <div className="flex items-center justify-between px-4 mb-3 mt-8">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() =>
              navigate(
                authUser?._id === post.author._id
                  ? "/profile"
                  : `/anotherUser/${post.author._id}`
              )
            }
          >
            <img
              src={post.author.avatar || "/default-avatar.png"}
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="font-semibold">{authUser?._id === post.author._id ? "You" : post.author.username}</p>
          </div>

          {authUser && authUser._id !== post.author._id && (
            <button
              onClick={handleFollow}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                following
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-blue-400 text-blue-400"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Media Carousel */}
        <div className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide relative">
          {post.media.map((m) => (
            <img
              key={m._id}
              src={m.url}
              alt="post"
              className="w-full flex-shrink-0 snap-center object-contain max-h-[75vh]"
            />
          ))}
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="px-4 py-3 text-sm border-b border-gray-600/30">
            {post.caption}
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-4 py-3 flex items-center justify-between text-xl">
          <div className="flex items-center gap-4">
            <button onClick={handleLike}>
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
            <span
              className="text-sm cursor-pointer"
              onClick={() => setOpenLikes(true)}
            >
              {post.likes.length}
            </span>

            <button onClick={() => setOpenComment(true)}>
              <FaRegComment />
            </button>
            <span
              className="text-sm cursor-pointer"
              onClick={() => setOpenComment(true)}
            >
              {post.comments.length}
            </span>
          </div>

          <button onClick={handleSave}>
            {saved ? (
              <FaBookmark className="text-blue-400" />
            ) : (
              <FaRegBookmark />
            )}
          </button>
        </div>

        {/* Likes & Comments */}
        {openComment && (
          <Comment postId={post._id} onClose={() => setOpenComment(false)} />
        )}
        {openLikes && (
          <PostLikesUser postId={post._id} onClose={() => setOpenLikes(false)} />
        )}
      </div>
    </div>
  );
};

export default GetImages;
