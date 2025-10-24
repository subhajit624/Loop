import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserInfo } from "@/context/AuthContext";
import { Image, Video, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateStatus = () => {
  const { BgColor, TxtColor, BorDerColor, authUser } = useContext(UserInfo);
  const navigate = useNavigate(); // for redirect
  const [tab, setTab] = useState("image");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (tab === "image" && !selected.type.startsWith("image/")) {
      return toast.error("Please select an image");
    }
    if (tab === "video" && !selected.type.startsWith("video/")) {
      return toast.error("Please select a video");
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first!");
    setUploading(true);
    toast("Upload status section is disabled by admin", { icon: null });    //this part remove later  //start
    navigate('/');
    return;   //end

    try {
      const formData = new FormData();
      formData.append(tab, file);
      formData.append("text", text);

      const url =
        tab === "image"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/status/createImage`
          : `${import.meta.env.VITE_BACKEND_URL}/api/status/createVideo`;

      const res = await axios.post(url, formData, { withCredentials: true });
      toast.success(res.data.message);

      // Reset state
      setFile(null);
      setPreview(null);
      setText("");

      // Redirect to home page
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`min-h-screen flex pt-16 justify-center items-start p-6 ${BgColor} ${TxtColor}`}>
      <div
        className={`w-full max-w-md p-6 rounded-2xl shadow-lg border ${BorDerColor} transition-all duration-300`}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create Status</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              tab === "image" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setTab("image")}
          >
            <Image size={20} /> Image
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              tab === "video" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setTab("video")}
          >
            <Video size={20} /> Video
          </button>
        </div>

        {/* Upload Area */}
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed ${BorDerColor} p-6 rounded-xl cursor-pointer hover:bg-gray-100 transition-all`}
        >
          <UploadCloud size={48} className="mb-2 text-gray-400" />
          <span className="text-gray-500 cursor-pointer">Click to select {tab}</span>
          <input
            type="file"
            accept={tab === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {/* Preview */}
        {preview && (
          <div className="mt-4 cursor-pointer">
            {tab === "image" ? (
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-64 object-cover rounded-xl transition-all duration-500"
              />
            ) : (
              <video
                src={preview}
                controls
                className="w-full max-h-64 object-cover rounded-xl transition-all duration-500"
              ></video>
            )}
          </div>
        )}

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add some text..."
          className={`mt-4 w-full p-3 border rounded-xl resize-none ${BorDerColor}`}
          disabled={uploading}
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-4 w-full ${BgColor} ${TxtColor} ${BorDerColor} border-2  py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer`}>
          {uploading ? "Uploading..." : <><UploadCloud size={20} /> Upload</>}
        </button>
      </div>
    </div>
  );
};

export default CreateStatus;
