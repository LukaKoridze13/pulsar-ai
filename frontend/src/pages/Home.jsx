import React, { useMemo, useEffect,useRef, useState } from 'react'
import io from 'socket.io-client';
export default function Home() {
  let socket; ;
  const [online,setOnline] = useState(1)
  useEffect(() => {
    socket = io('http://localhost:3824/')
    socket.on('users-online', (data) => {
      setOnline(data)
    });
  }, []);
  return (
    <div className="wrapper">
      <p>Users Online: {online} </p>
    </div>
  )
}
