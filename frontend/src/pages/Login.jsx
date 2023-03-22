import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="wrapper center">
      <form>
        <input type="text" placeholder="user" />
        <input type="password" placeholder="password" />
        <div className="gverdit">
        <button>Login</button> <Link to='/registration'>Register</Link>
        </div>
      </form>
    </div>
  );
}
