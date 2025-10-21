import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Dock from "../components/lightswind/dock";
import { Home, Compass, Film, Mail, User ,Plus} from "lucide-react";
import { UserInfo } from "@/context/AuthContext";

const HomeLayOut = () => {
  const navigate = useNavigate();
  const { BgColor ,TxtColor ,BorDerColor} = useContext(UserInfo);

  const dockItems = [
    {
      icon: <Home size={24} />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      icon: <Compass size={24} />,
      label: "Explore",
      onClick: () => navigate("/explore"),
    },
    {
      icon: <Plus size={24} />,
      label: "Add New Post",
      onClick: () => navigate("/create"),
    },
    {
      icon: <Film size={24} />,
      label: "Reels",
      onClick: () => navigate("/reels"),
    },
    {
      icon: <User size={24} />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    }
  ];

  return (
    <div className={`relative min-h-screen pb-24 ${BgColor}`}>
      {/* Page Content */}
      <div>
        <Outlet />
      </div>

      {/* Always-visible Dock */}
      <div className={`fixed bottom-0 left-0 w-full flex justify-center `}>
      <Dock
        items={dockItems}
        className={`${BgColor} ${!TxtColor} ${BorDerColor} cursor-pointer`}
        position="bottom"
        magnification={window.innerWidth < 640 ? 50 : 70}
        baseItemSize={window.innerWidth < 640 ? 40 : 50}
      />
      </div>

    </div>
  );
};

export default HomeLayOut;
