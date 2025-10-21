import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MagicLoader from "./components/lightswind/magic-loader"
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
import CreateStatus from './pages/CreateStatus'
import GetStatus from './pages/GetStatus'
import AnotherUser from './pages/AnotherUser'


function App() {

   const { authUser, loading, setLoading, BgColor ,TxtColor} = useContext(UserInfo);

   if(loading){
    <div className={`${BgColor} ${TxtColor}`}>
        <MagicLoader size={150} particleCount={1} speed={0.7} className="md:hidden"/>
    </div>
   }

  return (
    <div >
      <Routes>
        <Route element={<HomeLayOut />}>
          <Route path="/" element={<Front />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/status/upload" element={authUser ? <CreateStatus /> : <Navigate to="/" /> } />
        </Route>

        <Route path="/anotherUser/:anotherUserId" element={<AnotherUser />} />
        <Route path="/getStatus/:statusId" element={<GetStatus />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> :<SignIn />} />
        <Route path="/register" element={authUser ? <Navigate to="/" /> :<Register />} />
      </Routes>
    </div>
  )
}

export default App
