import React, { useContext, useEffect, useState, useRef } from "react";
import { UserInfo } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaVideo, FaRegImage, FaEdit, FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, setAuthUser, BgColor, TxtColor, BorDerColor } = useContext(UserInfo);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const [editAvatar, setEditAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [bio, setBio] = useState(authUser?.bio || "");
  const [editBio, setEditBio] = useState(false);
  const [saving, setSaving] = useState(false);

  const avatarInputRef = useRef();

  // Fetch posts & saved posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, savedRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/post/getAllPostsOfLoggedInUser?page=1&limit=20`, {
            withCredentials: true,
          }),
          axios.get(`${BACKEND_URL}/api/save/showAllSavedPosts`, {
            withCredentials: true,
          }),
        ]);

        setPosts(postsRes.data.posts || []);
        setSavedPosts(savedRes.data.savedPosts.map((p) => p.post) || []);
      } catch (err) {
        console.log("Error fetching profile data:", err);
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    if (authUser) fetchData();
  }, [authUser]);

  if (!authUser)
    return (
      <div className={`${BgColor} ${TxtColor} h-screen flex flex-col items-center justify-center gap-5`}>
        <div>Please Login to see profile</div>
        <button
          className={`${BgColor} ${TxtColor} ${BorDerColor} w-28 h-12 border-2 rounded-2xl cursor-pointer`}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    );

  if (loading)
    return (
      <div className={`${BgColor} ${TxtColor} h-screen flex justify-center items-center`}>
        Loading profile...
      </div>
    );

  const filteredPosts =
    activeTab === "posts"
      ? posts.filter((p) => p.media[0]?.type === "image" || p.media[0]?.type === "video")
      : posts.filter((p) => p.media[0]?.type === "video");

  const handlePostClick = (post) => {
    const firstMedia = post.media[0];
    if (!firstMedia) return;
    if (firstMedia.type === "video") navigate(`/getVideo/${post._id}`);
    else navigate(`/getImages/${post._id}`);
  };

  // --- Avatar Handlers ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) return toast.error("Please select a photo");
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("image", avatarFile);

      const res = await axios.put(`${BACKEND_URL}/api/user/changeAvatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setAuthUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      toast.success("Profile photo updated successfully!");
      setEditAvatar(false);
    } catch (err) {
      console.log("Error updating avatar:", err);
      toast.error("Failed to update avatar");
    } finally {
      setSaving(false);
    }
  };

  // --- Bio Handlers ---
  const handleSaveBio = async () => {
    try {
      setSaving(true);
      await axios.put(
        `${BACKEND_URL}/api/user/changeBio`,
        { bio },
        { withCredentials: true }
      );
      setAuthUser((prev) => ({ ...prev, bio }));
      toast.success("Bio updated successfully!");
      setEditBio(false);
    } catch (err) {
      console.log("Error updating bio:", err);
      toast.error("Failed to update bio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${BgColor} ${TxtColor} min-h-screen pb-10`}>
      {/* HEADER */}
      <div className="flex justify-center items-center gap-4 p-4 border-b" style={{ borderColor: BorDerColor }}>
        <h2 className="text-xl font-semibold">Your Profile</h2>
      </div>

      {/* PROFILE INFO */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center mt-6 text-center relative">
          {/* Avatar Section */}
          <div className="relative group">
            <img
              src={previewUrl || authUser.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 object-cover shadow-md cursor-pointer"
              style={{ borderColor: BorDerColor }}
              onClick={() => setEditAvatar(true)}
            />
            <div
              className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
              onClick={() => setEditAvatar(true)}
            >
              <FaCamera className="text-white text-2xl" />
            </div>
          </div>

          <h2 className="text-xl font-bold mt-2">{authUser.fullname}</h2>
          <p className="text-sm opacity-80">@{authUser.username}</p>

          {/* Bio Section */}
          <div className="mt-3 text-center">
            {editBio ? (
              <div className="flex flex-col items-center space-y-2">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className={`p-2 border rounded-md text-center w-64 ${BgColor}`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBio}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditBio(false)}
                    className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <p className="opacity-80">{bio || "No bio yet..."}</p>
                <FaEdit
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={() => setEditBio(true)}
                />
              </div>
            )}
          </div>

          {/* Followers / Following */}
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <p className="font-semibold">{authUser.followers.length}</p>
              <p className="text-sm opacity-70">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{authUser.following.length}</p>
              <p className="text-sm opacity-70">Following</p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-10 flex justify-center gap-10 pb-2" style={{ borderColor: BorDerColor }}>
          <button
            className={`flex items-center gap-2 text-lg font-semibold transition ${
              activeTab === "posts"
                ? "text-blue-500 border-b-2 border-blue-500 pb-1"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            <FaRegImage /> Posts
          </button>
          <button
            className={`flex items-center gap-2 text-lg font-semibold transition ${
              activeTab === "reels"
                ? "text-blue-500 border-b-2 border-blue-500 pb-1"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setActiveTab("reels")}
          >
            <FaVideo /> Reels
          </button>
          <button
            className={`flex items-center gap-2 text-lg font-semibold transition ${
              activeTab === "saved"
                ? "text-blue-500 border-b-2 border-blue-500 pb-1"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            Saved
          </button>
        </div>

        {/* POSTS GRID */}
        <div className="mt-6">
          {activeTab === "saved" ? (
            savedPosts.length === 0 ? (
              <p className="opacity-70 text-center mt-10">No saved posts yet.</p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {savedPosts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => handlePostClick(post)}
                    className="relative group cursor-pointer overflow-hidden rounded-lg border shadow-sm"
                    style={{ borderColor: BorDerColor }}
                  >
                    {post.media[0].type === "image" ? (
                      <img
                        src={post.media[0].url}
                        alt="post"
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition"
                      />
                    ) : (
                      <video
                        src={post.media[0].url}
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition"
                        muted
                        loop
                        autoPlay
                      />
                    )}
                  </div>
                ))}
              </div>
            )
          ) : filteredPosts.length === 0 ? (
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
                    <img
                      src={post.media[0].url}
                      alt="post"
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition"
                    />
                  ) : (
                    <video
                      src={post.media[0].url}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition"
                      muted
                      loop
                      autoPlay
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
                    ❤️ {post.likes.length} &nbsp; 💬 {post.comments.length}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Avatar Modal */}
      {editAvatar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl shadow-lg ${BgColor} ${TxtColor} w-80`}>
            <h3 className="text-lg font-semibold text-center mb-3">Change Profile Picture</h3>

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-28 h-28 rounded-full mx-auto mb-3 object-cover border"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3 text-sm text-gray-300">
                No Preview
              </div>
            )}

            <label className="block text-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              Choose Photo
            </label>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleSaveAvatar}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditAvatar(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
