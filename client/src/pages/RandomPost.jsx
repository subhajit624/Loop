import React, { useContext, useEffect, useState, useRef } from "react";
import { UserInfo } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaRegComment, FaBookmark, FaRegBookmark } from "react-icons/fa";
import toast from "react-hot-toast";
import Comment from "./Comment";
import PostLikesUser from "./PostLikesUser";

const RandomPost = () => {
  const { authUser, BgColor, TxtColor, BorDerColor } = useContext(UserInfo);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [noPosts, setNoPosts] = useState(false);
  const [mutedVideos, setMutedVideos] = useState({});
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [openLikePostId, setOpenLikePostId] = useState(null);
  const observer = useRef();
  const lastPostRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const gotoAnotherUserProfile = (id) => {
    if (!authUser) return navigate(`/anotherUser/${id}`);
    if (authUser._id === id) return navigate("/profile");
    navigate(`/anotherUser/${id}`);
  };

  const fetchPosts = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/post/getAllPostsOfRandomUsers?page=${page}&limit=5`, { withCredentials: true });
      if (!Array.isArray(res.data.posts) || !res.data.posts.length) { setNoPosts(true); return; }
      setPosts((prev) => [...prev, ...res.data.posts.filter((p) => !prev.some((old) => old._id === p._id))]);
      setTotalPages(res.data.totalPages || 1);
      setNoPosts(false);
    } catch (err) { console.log(err); setNoPosts(true); }
    finally { setLoading(false); }
  };

  const fetchSavedPosts = async () => {
    if (!authUser) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/save/showAllSavedPosts`, { withCredentials: true });
      setSavedPosts(res.data.savedPosts.map((item) => item.post._id));
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchPosts(); }, [page]);
  useEffect(() => { if (authUser) fetchSavedPosts(); }, [authUser]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) setPage((prev) => prev + 1);
    }, { threshold: 0.5 });
    if (lastPostRef.current) observer.current.observe(lastPostRef.current);
  }, [loading, totalPages, page]);

  useEffect(() => {
    const videos = document.querySelectorAll("video");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
      });
    }, { threshold: 0.5 });
    videos.forEach((v) => obs.observe(v));
    return () => obs.disconnect();
  }, [posts]);

  const handleLike = async (postId) => {
    if (!authUser) { toast.error("Login to Like"); return navigate("/login"); }
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/post/like/${postId}`, {}, { withCredentials: true });
      setPosts((prev) => prev.map((p) => p._id === postId ? { ...p, likes: data.likes } : p));
      setLikedPosts((prev) => data.message === "Post liked" ? [...prev, postId] : prev.filter((id) => id !== postId));
    } catch (err) { console.log(err); }
  };

  const handleSave = async (postId) => {
    if (!authUser) { toast.error("Login to save"); return navigate("/login"); }
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/save/${postId}`, {}, { withCredentials: true });
      setSavedPosts((prev) => data.message === "Post saved successfully" ? [...prev, postId] : prev.filter((id) => id !== postId));
    } catch (err) { console.log(err); }
  };

  const toggleMute = (postId) => {
    setMutedVideos((prev) => ({ ...prev, [postId]: !prev[postId] }));
    const video = document.getElementById(`video-${postId}`);
    if (video) video.muted = !video.muted;
  };

  return (
    <div className={`${BgColor} ${TxtColor} min-h-screen py-4 flex flex-col items-center`}>
      <div className="w-full max-w-2xl px-3">
        {noPosts && !loading && <div className={`text-center py-10 ${TxtColor} text-sm`}>No posts found yet</div>}
        {posts.map((post, idx) => (
          <div key={post._id} ref={idx === posts.length - 1 ? lastPostRef : null} className={`border rounded-2xl mb-6 overflow-hidden shadow-lg relative ${BgColor} ${TxtColor} ${BorDerColor}`}>
            <div className="flex items-center gap-3 p-3">
              <img src={post.author.avatar || "/default-avatar.png"} alt={post.author.username} className="w-10 h-10 rounded-full object-cover cursor-pointer" onClick={() => gotoAnotherUserProfile(post.author._id)} />
              <p className="font-semibold cursor-pointer" onClick={() => gotoAnotherUserProfile(post.author._id)}>
                {authUser?.username === post.author.username ? "You" : post.author.username}
              </p>
            </div>

            <div className="w-full overflow-x-scroll flex scrollbar-hide snap-x snap-mandatory">
              {post.media.map((m) =>
                m.type === "video" ? (
                  <video key={m._id} id={`video-${post._id}`} src={m.url} loop playsInline preload="metadata" muted={mutedVideos[post._id] ?? true} controls className="w-full max-h-[70vh] object-contain rounded-md flex-shrink-0 snap-center" />
                ) : (
                  <img key={m._id} src={m.url} alt="post" className="w-full max-h-[70vh] object-contain rounded-md flex-shrink-0 snap-center" />
                )
              )}
            </div>

            {post.media.length > 1 && <div className="absolute bottom-2 right-1/2 translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">1/{post.media.length}</div>}

            {post.caption && (
              <div className="p-3">
                <p className="text-sm font-semibold mb-2">{post.caption}</p>
                <div className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleLike(post._id)} className="cursor-pointer">
                      {post.likes.includes(authUser?._id) || likedPosts.includes(post._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </button>
                    <span className="text-sm cursor-pointer" onClick={() => setOpenLikePostId(post._id)}>{post.likes.length}</span>

                    <button className="cursor-pointer" onClick={() => setOpenCommentPostId(post._id)}>
                      <FaRegComment />
                    </button>
                    <span className="text-sm cursor-pointer" onClick={() => setOpenCommentPostId(post._id)}>{post.comments.length}</span>
                  </div>

                  <button onClick={() => handleSave(post._id)} className="cursor-pointer">{savedPosts.includes(post._id) ? <FaBookmark className="text-blue-400" /> : <FaRegBookmark />}</button>
                </div>

                <p className="text-sm text-gray-400 mt-2 cursor-pointer" onClick={() => setOpenCommentPostId(post._id)}>
                  View all {post.comments.length} comments
                </p>
              </div>
            )}
          </div>
        ))}
        {loading && <p className={`text-center text-sm mt-3 ${TxtColor} animate-pulse`}>Loading...</p>}
      </div>

      {openCommentPostId && <Comment postId={openCommentPostId} onClose={() => setOpenCommentPostId(null)} />}
      {openLikePostId && <PostLikesUser postId={openLikePostId} onClose={() => setOpenLikePostId(null)} />}
    </div>
  );
};

export default RandomPost;
