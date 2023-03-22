import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOnlineUsers, getRegisteredUsers } from "../api/requests";
import {io} from 'socket.io-client'
const Home = () => {
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [loginCount, setLoginCount] = useState(0);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [luckyPopupShown, setLuckyPopupShown] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('jhsaf78-refreshToken')===null) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const handleOnlineUsersCount = (count) => {
      setOnlineUsersCount(count);
    };
    const handleRegisteredUsersCount = (count) => {
      setRegisteredUsersCount(count);
      if (count >= 3  && !luckyPopupShown) {
        alert("You’re a lucky person");
        setLuckyPopupShown(true);
      }
    };

    // Connect to socket.io server
    const socket = io();

    // Listen for online users count updates
    socket.on("onlineUsersCount", handleOnlineUsersCount);

    // Listen for registered users count updates
    socket.on("registeredUsersCount", handleRegisteredUsersCount);

    // Emit login event
    socket.emit("login");

    // Increment login count
    setLoginCount((count) => count + 1);

    return () => {
      // Disconnect from socket.io server
      socket.disconnect();
    };
  }, [ luckyPopupShown]);

  return (
    <div className="wrapper center">
      <div>
        <h1 style={{color:'white'}}>Welcome to the Home Page</h1>
        {isFirstTime && <p>This is your first time on the Home page. Welcome! We're glad you're here.</p>}
        <p>Online Users: {onlineUsersCount}</p>
        <p>Registered Users: {registeredUsersCount}</p>
        <p>Login Count: {loginCount}</p>
      </div>
    </div>
  );
};

export default Home;
