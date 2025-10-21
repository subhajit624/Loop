import React, { useContext, useState } from "react";
import { UserInfo } from "@/context/AuthContext";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../Firebase/firebaseinit";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";

const SignIn = () => {
  const { BgColor, TxtColor, BorDerColor, authuser, setAuthUser } = useContext(UserInfo);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gmail: "",
    password: "",
  });

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      if (res.data.success) {
        setAuthUser(res.data.user);
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }

      
      setFormData({ gmail: "", password: "" });
    } catch (error) {
      console.error("Error during login:", error);
      const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/loginwithgoogle`,
        {
          fullname: user.displayName,
          gmail: user.email,
          avatar: user.photoURL,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        setAuthUser(res.data.user);
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className={`${BgColor} min-h-screen flex items-center justify-center`}>
      <div
        className={`
          ${BgColor} ${TxtColor} ${BorDerColor}
          border rounded-2xl shadow-lg p-8 w-[90%] sm:w-[70%] md:w-[40%]
        `}
      >
        <h1 className="text-2xl font-semibold text-center mb-6">Sign In</h1>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Gmail"
            className={`p-2 rounded-lg border ${BorDerColor} bg-transparent focus:outline-none`}
            value={formData.gmail}
            onChange={(e) =>
              setFormData({ ...formData, gmail: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={`p-2 rounded-lg border ${BorDerColor} bg-transparent focus:outline-none`}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center mt-4 mb-2">
          <div className="border-t w-1/3" />
          <span className="mx-2 text-sm">or</span>
          <div className="border-t w-1/3" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 border w-full py-2 rounded-lg hover:bg-gray-900 cursor-pointer transition"
        >
          <FcGoogle size={22} />
          <span>Continue with Google</span>
        </button>

        {/* Go to Register Link */}
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
