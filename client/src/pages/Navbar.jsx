import React, { useContext } from "react";
import { UserInfo } from "@/context/AuthContext";
import { MessageCircle, Bell, Sun, Moon, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signOut } from "firebase/auth";
import { app } from '../Firebase/firebaseinit';
import toast from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const { isBW, setIsBW, BgColor, TxtColor, BorDerColor, authUser, setAuthUser } = useContext(UserInfo);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      // Check if the user has password or not (Google user)
      const isGoogleUser = !authUser?.password;

      if (isGoogleUser) {
        // Sign out from Firebase
        const provider = new GoogleAuthProvider();
        await signOut(auth);
      }

      // Call backend logout
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });

      // Clear frontend auth state
      setAuthUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className={`flex justify-center ${BgColor}`}>
      <div
        className={`
          mt-3 mb-3
          ${BgColor} ${TxtColor} ${BorDerColor}
          w-[90%] sm:w-[70%] md:w-[50%]
          flex items-center justify-between
          px-4 py-2 rounded-2xl shadow-md border
        `}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/social.jpg"
            alt="App Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <h1 className="text-lg font-semibold">LOOP</h1>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          {/* Sun / Moon toggle */}
          <button
            className="hover:scale-110 transition-transform relative cursor-pointer"
            onClick={() => setIsBW(!isBW)}
            title={isBW ? "Switch to color mode" : "Switch to B&W mode"}
          >
            {isBW ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/* Messages */}
          <button
            className="hover:scale-110 transition-transform relative cursor-pointer"
            onClick={() => navigate("/messages")}
            title="Messages"
          >
            <MessageCircle size={22} />
          </button>

          {/* Notifications */}
          <button
            className="hover:scale-110 transition-transform relative cursor-pointer"
            onClick={() => navigate("/notification")}
            title="Notifications"
          >
            <Bell size={22} />
          </button>

          {/* Login / Logout */}
          <button
            className="hover:scale-110 transition-transform relative cursor-pointer"
            onClick={authUser ? handleLogout : () => navigate("/login")}
            title={authUser ? "Logout" : "Login"}
          >
            {authUser ? <LogOut size={22} /> : <LogIn size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
