import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { deleteUserRefeshtoken, getRegisteredUsers, getUser, getUserRefeshtoken, logout, setOffline, setOnline } from "../api/requests";
const Home = () => {
  const [logged, setLogged] = useState(false);
  const [onlines, setOnlines] = useState(0);
  const [registered, setRegistered] = useState(0);
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState("")
  const navigate = useNavigate();
  const socket = useRef();

  useEffect(() => {
    if (getUserRefeshtoken() == null) {
      navigate("/login");
    } else {
      setLogged(true);
    }
  }, []);
  useEffect(() => {
    if (logged) {
      socket.current = io("http://localhost:3333/");
      getUser(getUserRefeshtoken().user).then( async (res) => {
        try {
          setUserData(res.data);
          if (res.data.online === true) {
            navigate("/login");
          } else {
            let x = await getRegisteredUsers(res.data.refreshToken)
            setRegistered(x)
            setOnline(res.data.user);
            window.addEventListener('beforeunload',()=>{
              setOffline(res.data.user)
            })
          }
        } catch (err) {
          console.log(err);
        }
      });
      socket.current.on("online", (data) => {
        setOnlines(data);
      });
      socket.current.on("registered-users",(data)=>{
        setRegistered(data)
        if(data>3){
          setNotification("You're lucky person")
        }
      })
    }
    return () => {
      if (logged) {
        socket.current.disconnect();
        
      }
    };
  }, [logged]);

  return (
    <div className="wrapper center">
      {logged && userData && (
        <div>
          <h1 style={{color:'red'}}>{notification}</h1>
          <h1 style={{ color: "white" }}>Home Page of {userData.fullName}</h1>
          {userData.logins === 1 ? <p>This is your first time on the Home page. Welcome! We're glad you're here .</p> : <p>This is your {userData.logins} login</p>}
          <p>Online Users: {onlines}</p>
          <p>Registered Users: {registered}</p>
          <button
            onClick={() => {
              let data = getUserRefeshtoken();
              try {
                logout(data.refreshToken);
                setOffline(userData.user)
                navigate("/login");
                deleteUserRefeshtoken()
              } catch (err) {
                console.log(err);
              }
            }}
            style={{ color: "white" }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
