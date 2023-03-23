import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { deleteUserRefeshtoken, getOnlineUsers, getUser, getUserRefeshtoken, logout } from "../api/requests";
const Home = () => {
  const [logged, setLogged] = useState(false);
  const [onlines, setOnlines] = useState(0)
  const [registered, setRegistered] = useState(0)
  const [user, setUser]= useState(null)
  const [refreshToken, setRefreshToken]= useState(null)
  const [userData, setUserData]= useState(null)
  const navigate = useNavigate();
  const socket = useRef();
  console.log(userData)
  useEffect(() => {
    if (getUserRefeshtoken() == null) {
      navigate("/login");
    } else {
      setLogged(true);
    }
  }, []);
  useEffect(async () => {
    if (logged) {
      socket.current = io("http://localhost:3333/");
      setUser(getUserRefeshtoken().user)
      setRefreshToken(getUserRefeshtoken().refreshToken)
    }
  }, [logged]);
  
  return (
    <div className="wrapper center">
      <div>
        <h1 style={{ color: "white" }}>Home Page</h1>
        {/* {isFirstTime && <p>This is your first time on the Home page. Welcome! We're glad you're here.</p>}
        <p>Online Users: {onlineUsersCount}</p>
        <p>Registered Users: {registeredUsersCount}</p>
        <p>Login Count: {loginCount}</p> */}
        <button
          onClick={() => {
            let data = getUserRefeshtoken();
            try {
              logout(data.refreshToken);
              deleteUserRefeshtoken();
              navigate("/login");
            } catch (err) {
              console.log(err);
            }
          }}
          style={{ color: "white" }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
