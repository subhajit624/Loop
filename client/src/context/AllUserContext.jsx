import axios from 'axios';
import React, { createContext, useEffect, useState} from 'react'


export const AllUserInfo = createContext();

const AllUserContext = ({children}) => {
  const [alluserinfo, setAlluserinfo] = useState([]);


  useEffect(() => {
    const fetchData = async() => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getAllLoggedInUsers`, {
          withCredentials: true,
        });
        setAlluserinfo(res.data.users);
      } catch (error) {
        setAlluserinfo([]);
      }
    }
    fetchData();
  },[]);


  return (
    <AllUserInfo.Provider value={{alluserinfo}}>
      {children}
    </AllUserInfo.Provider>
  )
}

export default AllUserContext
