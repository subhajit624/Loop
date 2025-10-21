import React, { useContext } from 'react'
import Navbar from './Navbar'
import Status from './Status'
import '../App.css'
import { UserInfo } from '@/context/AuthContext';
import RandomPost from './RandomPost';


const Front = () => {
  const { BgColor ,TxtColor ,BorDerColor} = useContext(UserInfo);


  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="">
            <Status />
          </div>
          <div className=''>
            <RandomPost/>
            </div>
      </div>
      
    </div>
  )
}

export default Front
