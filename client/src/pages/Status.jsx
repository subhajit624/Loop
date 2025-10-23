import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "@/context/AuthContext";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const Status = () => {
  const { BgColor, TxtColor, BorDerColor, authUser} = useContext(UserInfo);
  const [loading, setLoading] = useState(false);
  const [getStatus, setGetStatus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllStatuses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/status/getAllStatus`,
          { withCredentials: true }
        );
        setGetStatus(res.data.statuses);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch statuses");
      } finally {
        setLoading(false);
      }
    };

    getAllStatuses();
  }, []);

  const handleAddStatusClick = () => {
    if (!authUser) {
      toast.error("Login to give a status");
      navigate("/login");
    } else {
      navigate("/status/upload");
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center ${BgColor} ${TxtColor} h-30`}>
        <p>Loading...</p>
      </div>
    );
  }


  return (
    <div className={`flex justify-center ${BgColor}`}>
      <div
        className={`
          ${BgColor} ${TxtColor} ${BorDerColor}
          w-[90%] sm:w-[70%] md:w-[50%]
          border rounded-2xl shadow-md px-3 py-3
        `}
      >
        {/* Scrollable status list */}
        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}
          </style>

          {/* 🔹 Add Status (always show plus) */}
          {!getStatus.some((s) => s.user._id === authUser?._id) && (
            <div
              onClick={handleAddStatusClick}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer"
            >
              <div
                className={`${BorDerColor} border-2 border-dashed w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform`}
              >
                <Plus size={24} />
              </div>
              <p className="text-xs mt-1 truncate w-14 text-center">Add</p>
            </div>
          )}

          {/* 🔹 Show all statuses */}
          {getStatus.map((status) => (
            <div
              key={status._id}
              onClick={() => navigate(`/getStatus/${status._id}`)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer"
            >
              <div
                className={`${BorDerColor} border-2 w-14 h-14 rounded-full overflow-hidden flex items-center justify-center hover:scale-105 transition-transform`}
              >
                {status.media.type === "image" ? (
                  <img
                    src={status.media.url}
                    alt="status"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={status.media.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                  />
                )}
              </div>
              <p className="text-xs mt-1 truncate w-14 text-center">
                {status.user.username}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;
