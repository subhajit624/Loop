import React from 'react'
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserInfo = createContext();

const AuthContext = ({children}) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBW, setIsBW] = useState(true);
  const BgColor = isBW ? "bg-[radial-gradient(circle_at_top,_#1c1c1c,_#000000)]" : "bg-[conic-gradient(at_top_right,_#d6d3d1,_#e7e5e4,_#f5f5f4)]";
  const TxtColor = isBW ? "text-white" : "text-black";
  const BorDerColor = isBW ? "border-gray-600" : "border-black"

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/frontend/me`, {
          withCredentials: true,
        });
        setAuthUser(res.data.user);
      } catch (err) {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [])

  return (
    <UserInfo.Provider value={{authUser, setAuthUser, loading, setLoading,isBW ,setIsBW ,BgColor ,TxtColor, BorDerColor }}>
      {children}
    </UserInfo.Provider>
  )
}

export default AuthContext
