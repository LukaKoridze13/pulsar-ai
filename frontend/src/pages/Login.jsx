import { useState } from "react";
import { login } from "../api/requests";
import {Link, useNavigate} from 'react-router-dom'
const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await login(user, password);
      navigate('/')
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="wrapper center">
      <form onSubmit={handleSubmit} style={{ maxWidth: "280px", margin: "0 auto" }}>
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label htmlFor="user">Username:</label>
        <input type="text" id="user" name="user" value={user} onChange={(event) => setUser(event.target.value)} required />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button type="submit">Submit</button> <Link to='/registration'>Register</Link>
      </form>
    </div>
  );
};

export default Login;
