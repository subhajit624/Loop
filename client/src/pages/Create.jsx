import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserInfo } from "@/context/AuthContext";
import { Image, Video, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const { BgColor, TxtColor, BorDerColor, authUser } = useContext(UserInfo);
  const navigate = useNavigate();

  const [tab, setTab] = useState("image"); // image or video
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if(!authUser) {
      toast.error("please login");
      navigate('/login');
    }
    if (tab === "video") {
      if (selectedFiles.length > 1) {
        toast.error("You can only upload 1 video at a time");
        return;
      }
      if (!selectedFiles[0].type.startsWith("video/")) {
        toast.error("Please select a video file");
        return;
      }
    } else {
      const allImages = selectedFiles.every((f) => f.type.startsWith("image/"));
      if (!allImages) {
        toast.error("Please select only images");
        return;
      }
      if (selectedFiles.length > 10) {
        toast.error("You can upload up to 10 images only");
        return;
      }
    }

    setFiles(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleUpload = async () => {
    if (files.length === 0) return toast.error("Select files first");
    setUploading(true);

    try {
      const formData = new FormData();
      if (tab === "video") {
        formData.append("video", files[0]);
      } else {
        files.forEach((file) => formData.append("images", file));
      }
      formData.append("caption", caption);

      const url =
        tab === "video"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/post/createVideo`
          : `${import.meta.env.VITE_BACKEND_URL}/api/post/createImages`;

      const res = await axios.post(url, formData, { withCredentials: true });
      toast.success(res.data.message);

      // Reset
      setFiles([]);
      setPreview([]);
      setCaption("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`min-h-screen flex pt-16 justify-center items-start p-6 ${BgColor} ${TxtColor}`}>
      <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg border ${BorDerColor} transition-all duration-300`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Create Post</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              tab === "image" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => { setTab("image"); setFiles([]); setPreview([]); }}
          >
            <Image size={20} /> Images
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              tab === "video" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => { setTab("video"); setFiles([]); setPreview([]); }}
          >
            <Video size={20} /> Video
          </button>
        </div>

        {/* Upload Area */}
        <label className={`flex flex-col items-center justify-center border-2 border-dashed ${BorDerColor} p-6 rounded-xl cursor-pointer hover:bg-gray-100 transition-all`}>
          <UploadCloud size={48} className="mb-2 text-gray-400" />
          <span className="text-gray-500 cursor-pointer">
            Click to select {tab === "video" ? "a video" : "images"}
          </span>
          <input
            type="file"
            accept={tab === "video" ? "video/*" : "image/*"}
            multiple={tab === "image"}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {preview.map((src, idx) =>
              tab === "video" ? (
                <video key={idx} src={src} controls className="w-full max-h-64 object-cover rounded-xl" />
              ) : (
                <img key={idx} src={src} alt="preview" className="w-32 h-32 object-cover rounded-xl" />
              )
            )}
          </div>
        )}

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          className={`mt-4 w-full p-3 border rounded-xl resize-none ${BorDerColor}`}
          disabled={uploading}
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-4 w-full ${BgColor} ${TxtColor} ${BorDerColor} border-2 py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer`}
        >
          {uploading ? "Uploading..." : <><UploadCloud size={20} /> Upload</>}
        </button>
      </div>
    </div>
  );
};

export default Create;
