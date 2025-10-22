import React, { useContext, useEffect, useState, useRef } from "react";
import { UserInfo } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Comment from "./Comment";
import PostLikesUser from "./PostLikesUser";

const Reels = () => {
  const { authUser, BgColor, TxtColor, BorDerColor } = useContext(UserInfo);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mutedVideos, setMutedVideos] = useState({});
  const [savedVideos, setSavedVideos] = useState([]);
  const [openCommentVideoId, setOpenCommentVideoId] = useState(null);
  const [openLikeVideoId, setOpenLikeVideoId] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]); // ⬅ added for follow logic

  const observer = useRef();
  const lastVideoRef = useRef(null);

  // Fetch videos
  const fetchVideos = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/api/post/getAllVideosOfRandomUsers?page=${page}&limit=5`,
        { withCredentials: true }
      );
      if (!Array.isArray(res.data.posts) || !res.data.posts.length) return;
      setVideos((prev) => [
        ...prev,
        ...res.data.posts.filter((v) => !prev.some((old) => old._id === v._id)),
      ]);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved videos
  const fetchSavedVideos = async () => {
    if (!authUser) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/save/showAllSavedPosts`, {
        withCredentials: true,
      });
      setSavedVideos(res.data.savedPosts.map((item) => item.post._id));
    } catch (err) {
      console.log(err);
    }
  };

  // ⬅ Initialize followed users list from authUser.following
  useEffect(() => {
    if (authUser) {
      setFollowedUsers(authUser.following || []);
    }
  }, [authUser]);

  // Handle Follow / Unfollow
  const handleFollow = async (anotherUserId) => {
    if (!authUser) {
      toast.error("Login to follow users");
      return navigate("/login");
    }
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/follow/${anotherUserId}`,
        {},
        { withCredentials: true }
      );

      if (data.message === "Followed successfully") {
        setFollowedUsers((prev) => [...prev, anotherUserId]);
      } else if (data.message === "Unfollowed successfully") {
        setFollowedUsers((prev) => prev.filter((id) => id !== anotherUserId));
      }

      toast.success(data.message);
    } catch (error) {
      console.log("Follow error:", error);
      toast.error("Something went wrong");
    }
  };

  // Navigate to profile
  const gotoProfile = (id) => {
    if (!authUser) return navigate(`/anotherUser/${id}`);
    if (authUser._id === id) return navigate("/profile");
    navigate(`/anotherUser/${id}`);
  };

  // Like video
  const handleLike = async (videoId) => {
    if (!authUser) {
      toast.error("Login to like");
      return navigate("/login");
    }
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/post/like/${videoId}`,
        {},
        { withCredentials: true }
      );
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, likes: data.likes } : v
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Save video
  const handleSave = async (videoId) => {
    if (!authUser) {
      toast.error("Login to save");
      return navigate("/login");
    }
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/save/${videoId}`,
        {},
        { withCredentials: true }
      );
      setSavedVideos((prev) =>
        data.message === "Post saved successfully"
          ? [...prev, videoId]
          : prev.filter((id) => id !== videoId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Mute/unmute
  const toggleMute = (videoId) => {
    setMutedVideos((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
    const video = document.getElementById(`video-${videoId}`);
    if (video) video.muted = !video.muted;
  };

  // Initial fetch
  useEffect(() => {
    fetchVideos();
  }, [page]);
  useEffect(() => {
    if (authUser) fetchSavedVideos();
  }, [authUser]);

  // Infinite scroll
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages)
          setPage((prev) => prev + 1);
      },
      { threshold: 0.5 }
    );
    if (lastVideoRef.current) observer.current.observe(lastVideoRef.current);
  }, [loading, totalPages, page]);

  // Auto-play/pause videos
  useEffect(() => {
    const videoElements = document.querySelectorAll("video");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            video.muted = false;
          } else {
            video.pause();
            video.muted = true;
          }
        });
      },
      { threshold: 0.6 }
    );
    videoElements.forEach((v) => obs.observe(v));
    return () => obs.disconnect();
  }, [videos]);

  return (
    <div
      className={`${BgColor} ${TxtColor} min-h-screen flex flex-col items-center py-4`}
    >
      <div className="w-full max-w-2xl px-3 snap-y snap-mandatory overflow-y-scroll h-screen scrollbar-hide">
        {videos.length === 0 && !loading && (
          <div className="text-center py-10 text-sm">No videos found yet</div>
        )}

        {videos.map((video, idx) => (
          <div
            key={video._id}
            ref={idx === videos.length - 1 ? lastVideoRef : null}
            className={`relative w-full h-[85vh] my-[6vh] overflow-hidden rounded-2xl flex items-center justify-center snap-start ${BgColor} ${TxtColor} ${BorDerColor}`}
          >
            {/* Video */}
            <video
              id={`video-${video._id}`}
              src={video.media[0].url}
              loop
              playsInline
              muted
              className="w-full h-full object-contain bg-black"
            />

            {/* Author info with follow button */}
            <div className="absolute top-3 left-3 flex items-center gap-2 text-white">
              <img
                src={video.author.avatar || "/default-avatar.png"}
                alt={video.author.username}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                onClick={() => gotoProfile(video.author._id)}
              />
              <span
                className="font-semibold cursor-pointer"
                onClick={() => gotoProfile(video.author._id)}
              >
                {authUser?._id === video.author._id
                  ? "You"
                  : video.author.username}
              </span>

              {/* ⬅ Follow / Following Button */}
              {authUser?._id !== video.author._id && (
                <button
                  onClick={() => handleFollow(video.author._id)}
                  className={`ml-2 px-3 py-[2px] rounded-full text-xs font-medium cursor-pointer ${
                    followedUsers.includes(video.author._id)
                      ? "bg-gray-700 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {followedUsers.includes(video.author._id)
                    ? "Following"
                    : "Follow"}
                </button>
              )}
            </div>

            {/* Right side actions */}
            <div className="absolute right-3 bottom-20 flex flex-col items-center gap-6 text-white">
              {/* Like */}
              <div className="flex flex-col items-center cursor-pointer">
                <div onClick={() => handleLike(video._id)}>
                  {video.likes.includes(authUser?._id) ? (
                    <FaHeart className="text-red-500 text-2xl" />
                  ) : (
                    <FaRegHeart className="text-2xl" />
                  )}
                </div>
                <span
                  className="text-sm mt-1"
                  onClick={() => setOpenLikeVideoId(video._id)}
                >
                  {video.likes.length}
                </span>
              </div>

              {/* Comment */}
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setOpenCommentVideoId(video._id)}
              >
                <FaRegComment className="text-2xl" />
                <span className="text-sm mt-1">{video.comments.length}</span>
              </div>

              {/* Save */}
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleSave(video._id)}
              >
                {savedVideos.includes(video._id) ? (
                  <FaBookmark className="text-blue-400 text-2xl" />
                ) : (
                  <FaRegBookmark className="text-2xl" />
                )}
              </div>

              {/* Mute */}
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => toggleMute(video._id)}
              >
                {mutedVideos[video._id] ? (
                  <FaVolumeMute className="text-2xl" />
                ) : (
                  <FaVolumeUp className="text-2xl" />
                )}
              </div>
            </div>

            {/* Caption */}
            {video.caption && (
              <div className="absolute bottom-4 left-3 text-white text-sm font-semibold">
                {video.caption}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <p className="text-center text-sm mt-3 animate-pulse">Loading...</p>
        )}
      </div>

      {/* Modals */}
      {openCommentVideoId && (
        <Comment
          postId={openCommentVideoId}
          onClose={() => setOpenCommentVideoId(null)}
        />
      )}
      {openLikeVideoId && (
        <PostLikesUser
          postId={openLikeVideoId}
          onClose={() => setOpenLikeVideoId(null)}
        />
      )}
    </div>
  );
};

export default Reels;
