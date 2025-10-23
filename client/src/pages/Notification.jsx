import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserInfo } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaCommentDots,
  FaUserPlus,
  FaCircle,
} from "react-icons/fa6";

const Notification = () => {
  const { BgColor, TxtColor, BorDerColor, authUser } = useContext(UserInfo);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/notification/getAllNotifications`,
          { withCredentials: true }
        );
        setNotifications(res.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [setLoading]);

  const markAsRead = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/markAsRead/${id}`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read", error);
      toast.error("Failed to update notification");
    }
  };

  const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  const filtered = notifications.filter((n) => n.receiver === authUser?._id);

  const displayed =
    activeTab === "all"
      ? filtered
      : filtered.filter((n) => n.type === activeTab);

  const NotificationItem = ({ n }) => {
    const icon =
      n.type === "like" ? (
        <FaHeart className="text-pink-500" />
      ) : n.type === "comment" ? (
        <FaCommentDots className="text-green-500" />
      ) : (
        <FaUserPlus className="text-blue-500" />
      );

    const message =
      n.type === "like"
        ? "liked your post"
        : n.type === "comment"
        ? "commented on your post"
        : "started following you";

        if(loading){
            return (
          <div className={`flex justify-center items-center ${BgColor} ${TxtColor} h-30`}>
            <p>Loading...</p>
          </div>
         );
        }

    return (
      <div
        onClick={() => markAsRead(n._id)}
        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
          n.read
            ? "opacity-70"
            : "border-blue-500 bg-blue-300 dark:bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] dark:from-[#831843] dark:via-[#be185d] dark:to-[#f472b6]"
        } hover:scale-[1.01] ${BorDerColor}`}
      >
        <div className="flex items-center gap-3">
          <img
            src={
              n.sender?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
            className="w-10 h-10 rounded-full border object-cover"
          />
          <div>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">{n.sender?.username}</span>{" "}
              {message}
            </p>
            <p className="text-xs opacity-70">{timeAgo(n.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-lg">{icon}</div>
          {!n.read && <FaCircle className="text-blue-500 text-[10px]" />}
        </div>
      </div>
    );
  };

  // 🌟 Loading animation
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin border-blue-500"></div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col items-center py-4`}>
      <div
        className={`w-full sm:w-[90%] md:w-[70%] lg:w-[50%] p-4 rounded-2xl shadow ${BgColor} ${TxtColor} ${BorDerColor}`}
      >
        {/* Header */}
        <h2 className="text-xl font-semibold mb-3 text-center border-b pb-2">
          Notifications
        </h2>

        {/* Tabs */}
        <div
          className={`flex items-center justify-around border-b mb-4 pb-2 text-sm sm:text-base font-medium ${BorDerColor}`}
        >
          <button
            onClick={() => setActiveTab("like")}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
              activeTab === "like" ? "bg-pink-500/20" : ""
            }`}
          >
            <FaHeart className="text-pink-500" /> Likes
          </button>
          <button
            onClick={() => setActiveTab("comment")}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
              activeTab === "comment" ? "bg-green-500/20" : ""
            }`}
          >
            <FaCommentDots className="text-green-500" /> Comments
          </button>
          <button
            onClick={() => setActiveTab("follow")}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
              activeTab === "follow" ? "bg-blue-500/20" : ""
            }`}
          >
            <FaUserPlus className="text-blue-500" /> Follows
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
              activeTab === "all" ? "bg-gray-500/20" : ""
            }`}
          >
            All
          </button>
        </div>

        {/* 🌀 Show loading or list */}
        {isLoading ? (
          <LoadingSpinner />
        ) : displayed.length === 0 ? (
          <p className="text-center opacity-70 mt-4">No notifications yet</p>
        ) : (
          <div className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pb-6">
            {displayed
              .slice()
              .reverse()
              .map((n) => (
                <NotificationItem key={n._id} n={n} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
