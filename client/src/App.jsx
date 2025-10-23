import { useContext, useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import { UserInfo } from './context/AuthContext'
import HomeLayOut from './pages/HomeLayOut';
import Front from "./pages/Front";
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Explore from './pages/Explore';
import Reels from './pages/Reels';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Create from './pages/Create';
import Notification from './pages/Notification';
import CreateStatus from './pages/CreateStatus';
import GetStatus from './pages/GetStatus';
import AnotherUser from './pages/AnotherUser';

function App() {
  const { authUser, loading, BgColor, TxtColor } = useContext(UserInfo);
  const [showWait, setShowWait] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowWait(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  if(loading){
    return (
      <div className={`${BgColor} ${TxtColor} h-screen flex flex-col items-center justify-center`}>
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg animate-pulse">
          {showWait ? "It may take 40-50 sec to load..." : "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route element={<HomeLayOut />}>
          <Route path="/" element={<Front />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/status/upload" element={authUser ? <CreateStatus /> : <Navigate to="/" />} />
        </Route>

        <Route path="/anotherUser/:anotherUserId" element={<AnotherUser />} />
        <Route path="/getStatus/:statusId" element={<GetStatus />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <SignIn />} />
        <Route path="/register" element={authUser ? <Navigate to="/" /> : <Register />} />
      </Routes>
    </div>
  );
}

export default App;
