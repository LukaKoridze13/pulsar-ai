import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../api/requests'

export default function Registration() {
  let name = useRef()
  let user= useRef() 
  let password = useRef()
  const [error,setError] = useState('')
  return (
    <div className="wrapper center">
      <form>
        <input type="text" placeholder='Name Surname' ref={name} />
        <input type="text" placeholder="user" ref={user}/>
        <input type="password" placeholder="password" ref={password} />
        <p>{error}</p>
        <div className="gverdit">
        <button onClick={(e)=>{e.preventDefault();console.log(register({name:name.current.value, user: user.current.value, password: password.current.value, refreshToken: Math.random()})); e.preventDefault()}}>Register</button> <Link to='/login'>Login</Link>
        </div>
      </form>
    </div>
  )
}
