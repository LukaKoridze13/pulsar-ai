import { useState } from "react";
import { login, register, setOnline, storeUserRefeshtoken } from "../api/requests";
import { Link, useNavigate } from "react-router-dom";
const Registration = () => {
  const [fullName, setFullName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const refreshToken = await register(fullName, user, password);
      navigate('/')
      storeUserRefeshtoken(user,refreshToken)
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="wrapper center">
      <form onSubmit={handleSubmit} style={{ maxWidth: "280px", margin: "0 auto" }}>
        <h2>Register</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label htmlFor="fullName">Full Name:</label>
        <input type="text" id="fullName" name="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        <label htmlFor="user">Username:</label>
        <input type="text" id="user" name="user" value={user} onChange={(event) => setUser(event.target.value)} required />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button type="submit">Submit</button>
        <Link to="/login">Login</Link>
      </form>
    </div>
  );
};

export default Registration;
