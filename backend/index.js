import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Array to store registered users
const users = [];

// Online / Registered Users
let onlineUsers = 0;

io.on("connection", (socket) => {
  onlineUsers++;
  io.emit("online", onlineUsers);
  console.log('user joined')
  socket.on("register", () => {
    io.emit("registered-users", users.length);
  });

  socket.on("disconnect", () => {
    onlineUsers--;
    io.emit("online", onlineUsers);
  });
});

// Express routes
app.get("/online-users", (req, res) => {
  const { user, refreshToken } = req.body;
  const found = users.find((each) => each === user);
  if (!found) {
    res.status(404).send("User not found");
  }
  const valid = found.refreshToken === refreshToken;
  if (!valid) {
    res.status(401).send("Unauthorized");
  } else {
    res.json(onlineUsers);
  }
});

app.get("/registered-users", (req, res) => {
  const { refreshToken } = req.body;
  const found = users.find((each) => each.refreshToken === refreshToken);
  if (!found) {
    res.status(401).send("Unauthorized");
  } else {
    res.json(users.length);
  }
});

app.get("/users", (req, res) => {
  res.json(users);
});
app.get("/users/:user", (req, res) => {
  const find =  users.find(each => each.user === req.params.user);
  if(find){
    res.json(find);
  }else{
    res.status(404).json("Not Found");
  }
});

app.post("/register", (req, res) => {
  const { fullName, user, password } = req.body;
  if (!fullName || !user || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = users.find((u) => u.user === user);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }
  const refreshToken = "TOKEN" + Math.random();
  const newUser = { fullName, user, password, refreshToken, logins:1 };
  users.push(newUser);
  io.emit("registered-users", "New User Registered");
  res.status(201).json(refreshToken);
});

app.put("/login", (req, res) => {
  const { user, password } = req.body;
  const existingUser = users.find((u) => u.user === user && u.password === password);
  if (!existingUser) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const newRefreshToken = "TOKEN" + Math.random();
  existingUser.refreshToken = newRefreshToken;
  res.status(200).json(newRefreshToken);
});

app.put("/logout", (req, res) => {
  const { refreshToken } = req.body;
  const existingUser = users.find((u) => u.refreshToken === refreshToken);
  if (!existingUser) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  existingUser.refreshToken = null;
  res.status(200).json("Logout successful");
});

// Start the server
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
