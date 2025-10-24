import React, { useContext, useEffect, useState } from "react";
import { UserInfo } from "@/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaVideo, FaRegImage } from "react-icons/fa";

const AnotherUser = () => {
  const { anotherUserId } = useParams();
  const { authUser, BgColor, TxtColor, BorDerColor } = useContext(UserInfo);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [anotherUser, setAnotherUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingList, setFollowingList] = useState(authUser?.following || []);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // Fetch user and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userRes = await axios.get(`${BACKEND_URL}/api/anotheruser/${anotherUserId}`, { withCredentials: true });
        setAnotherUser(userRes.data.user);

        // Fetch posts
        const postRes = await axios.get(
          `${BACKEND_URL}/api/post/getAllPostsOfAnotherUser/${anotherUserId}?page=1&limit=20`,
          { withCredentials: true }
        );

        if (postRes.data.posts) {
          setPosts(postRes.data.posts);
        } else if (postRes.data.message === "He haven't posted yet") {
          setPosts([]); // User has no posts
        }
      } catch (err) {
        console.log("Error fetching another user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [anotherUserId]);

  // Follow / Unfollow
  const handleFollow = async (anotherUserId) => {
    if (!authUser) {
      toast.error("Login to follow");
      return navigate("/login");
    }
    try {
      setFollowLoading(true);
      const { data } = await axios.post(
        `${BACKEND_URL}/api/follow/${anotherUserId}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
      setFollowingList((prev) =>
        prev.includes(anotherUserId)
          ? prev.filter((id) => id !== anotherUserId)
          : [...prev, anotherUserId]
      );

      setAnotherUser((prev) => {
        if (!prev) return prev;
        const isFollowing = followingList.includes(anotherUserId);
        return {
          ...prev,
          followers: isFollowing
            ? prev.followers.filter((id) => id !== authUser._id)
            : [...prev.followers, authUser._id],
        };
      });
    } catch (error) {
      console.log("Error in follow:", error);
      toast.error("Something went wrong");
    } finally {
      setFollowLoading(false);
    }
  };

  const isFollowing = followingList.includes(anotherUserId);

  const handlePostClick = (post) => {
    const firstMedia = post.media[0];
    if (!firstMedia) return;
    if (firstMedia.type === "video") navigate(`/getVideo/${post._id}`);
    else navigate(`/getImages/${post._id}`);
  };

  if (loading)
    return (
      <div className={`${BgColor} ${TxtColor} h-screen flex justify-center items-center text-lg`}>
        Loading profile...
      </div>
    );

  if (!anotherUser)
    return (
      <div className={`${BgColor} ${TxtColor} h-screen flex justify-center items-center`}>
        User not found
      </div>
    );

  const hasPosts = posts.length > 0;

  // Filter posts based on active tab
  const filteredPosts =
    activeTab === "posts"
      ? posts.filter((p) => p.media[0]?.type === "image" || p.media[0]?.type === "video")
      : posts.filter((p) => p.media[0]?.type === "video");

  return (
    <div className={`${BgColor} min-h-screen ${TxtColor} pb-10`}>
      {/* HEADER */}
      <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: BorDerColor }}>
        <button onClick={() => navigate(-1)} className="text-xl font-semibold">
          ←
        </button>
        <h2 className="text-xl font-semibold">@{anotherUser.username}</h2>
      </div>

      {/* PROFILE INFO */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center mt-6 text-center">
          <img
            src={anotherUser.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-28 h-28 rounded-full border shadow-sm"
            style={{ borderColor: BorDerColor }}
          />
          <h2 className="text-xl font-bold mt-2">{anotherUser.fullname}</h2>
          <p className="text-sm opacity-80">@{anotherUser.username}</p>
          <p className="text-sm mt-2">{anotherUser.bio || ""}</p>

          {/* Followers / Following */}
          <div className="flex gap-6 mt-3">
            <div className="text-center">
              <p className="font-semibold">{anotherUser.followers.length}</p>
              <p className="text-sm opacity-70">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{anotherUser.following.length}</p>
              <p className="text-sm opacity-70">Following</p>
            </div>
          </div>

          {/* Buttons */}
          {authUser && authUser._id !== anotherUser._id && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleFollow(anotherUserId)}
                disabled={followLoading}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                  isFollowing
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                }`}
              >
                {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
              </button>
              <button
                onClick={() => navigate(`/conversation/${anotherUserId}`)}
                className="px-5 py-2 rounded-full text-sm font-semibold border border-gray-400 hover:bg-gray-400 dark:hover:bg-gray-800"
              >
                Message
              </button>
            </div>
          )}
        </div>

        {/* IF NO POSTS */}
        {!hasPosts ? (
          <p className="opacity-70 text-center mt-10">No posts yet.</p>
        ) : (
          <>
            {/* TABS */}
            <div className="mt-10 flex justify-center gap-10 pb-2" style={{ borderColor: BorDerColor }}>
              <button
                className={`flex items-center gap-2 text-lg font-semibold transition ${
                  activeTab === "posts" ? "text-blue-500 border-b-2 border-blue-500 pb-1" : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                <FaRegImage /> Posts
              </button>
              <button
                className={`flex items-center gap-2 text-lg font-semibold transition ${
                  activeTab === "reels" ? "text-blue-500 border-b-2 border-blue-500 pb-1" : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setActiveTab("reels")}
              >
                <FaVideo /> Reels
              </button>
            </div>

            {/* POSTS GRID */}
            <div className="mt-6">
              {filteredPosts.length === 0 ? (
                <p className="opacity-70 text-center mt-10">No {activeTab} yet.</p>
              ) : (
                <div
                  className={`grid ${
                    activeTab === "reels" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-3 md:grid-cols-4"
                  } gap-4`}
                >
                  {filteredPosts.map((post) => (
                    <div
                      key={post._id}
                      onClick={() => handlePostClick(post)}
                      className="relative group cursor-pointer overflow-hidden rounded-lg border shadow-sm"
                      style={{ borderColor: BorDerColor }}
                    >
                      {post.media[0].type === "image" ? (
                        <>
                          <img
                            src={post.media[0].url}
                            alt="post"
                            className="w-full h-48 object-cover transform group-hover:scale-105 transition"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs p-1 rounded-md">
                            <FaRegImage />
                          </div>
                        </>
                      ) : (
                        <>
                          <video
                            src={post.media[0].url}
                            className="w-full h-48 object-cover transform group-hover:scale-105 transition"
                            muted
                            loop
                            autoPlay
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs p-1 rounded-md">
                            <FaVideo />
                          </div>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
                        ❤️ {post.likes.length} &nbsp; 💬 {post.comments.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnotherUser;
