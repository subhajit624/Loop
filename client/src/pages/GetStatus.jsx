import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserInfo } from "@/context/AuthContext";

const GetStatus = () => {
  const { statusId } = useParams();
  const navigate = useNavigate();
  const { BgColor, TxtColor } = useContext(UserInfo);
  const [loading, setLoading] = useState(false);
  const [statusDetails, setStatusDetails] = useState({});
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const getstatus = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/status/getstatus/${statusId}`,
          { withCredentials: true }
        );
        setStatusDetails(res.data.status);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch status");
      } finally {
        setLoading(false);
      }
    };
    getstatus();
  }, [statusId]);

  const { media, text, user } = statusDetails;

  // ⏳ Progress bar for image (12 seconds)
  useEffect(() => {
    if (!media) return;
    if (media.type === "image") {
      let count = 0;
      const total = 120;
      intervalRef.current = setInterval(() => {
        count++;
        setProgress((count / total) * 100);
        if (count >= total) {
          clearInterval(intervalRef.current);
          navigate("/");
        }
      }, 100);
      return () => clearInterval(intervalRef.current);
    }
  }, [media, navigate]);

  const handleVideoEnd = () => navigate("/");

  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen text-lg ${BgColor} ${TxtColor}`}
      >
        Loading...
      </div>
    );

  if (!media)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        No status found
      </div>
    );

  return (
    <div
      className={`relative flex items-center justify-center min-h-screen w-full overflow-hidden ${BgColor} ${TxtColor}`}
    >
      {/* 🔹 Background blur */}
      <div
        className="absolute inset-0 blur-xl brightness-50"
        style={{
          backgroundImage: `url(${media.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* 🔹 Progress bar */}
      <div className="absolute top-4 left-0 w-full px-4 z-20">
        <div className="w-full h-1 bg-white/40 rounded-full">
          <div
            className="h-1 bg-white rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 🔹 User info */}
      <div className="absolute top-10 left-4 z-20 flex items-center gap-3">
        <img
          src={user?.avatar}
          alt={user?.username}
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <p className="font-semibold text-white text-sm sm:text-base">
          {user?.username}
        </p>
      </div>

      {/* 🔹 Close button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 z-20 text-white text-2xl font-bold"
      >
        &times;
      </button>

      {/* 🔹 Media content */}
      <div className="relative z-10 w-full h-[80vh] md:h-screen flex items-center justify-center bg-black">
        {media.type === "image" ? (
          <img
            src={media.url}
            alt="status"
            className="w-full h-full object-contain md:object-cover"
          />
        ) : (
          <video
            src={media.url}
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-contain md:object-cover"
          />
        )}

        {/* 🔹 Overlay text */}
        {text && (
          <div className="absolute bottom-10 w-full flex justify-center">
            <p className="text-white text-lg sm:text-xl font-semibold bg-black/40 px-4 py-2 rounded-2xl max-w-[80%] text-center">
              {text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStatus;
