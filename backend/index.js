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

// Socket.io
let onlineUsers = 0;

io.on("connection", (socket) => {
  console.log("User connected");
  onlineUsers++;
  io.emit("online", onlineUsers);

  socket.on("register", (data) => {
    console.log("User registered:", data);
    users.push(data);
    io.emit("new-user", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    onlineUsers--;
    io.emit("online", onlineUsers);
  });
});

// Express routes
app.get("/online-users", (req, res) => {
  res.json({ onlineUsers });
});

app.get("/registered-users", (req, res) => {
  res.json(users);
});

app.get("/users", (req, res) => {
  res.json({ onlineUsers, users });
});

app.get("/users/:username", (req, res) => {
  const { username } = req.params;
  const user = users.find((u) => u.user === username);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.post("/register", (req, res) => {
  const { fullName, user, password, refreshToken } = req.body;
  console.log(req.body)
  if (!fullName || !user || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = users.find((u) => u.user === user);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const newUser = { fullName, user, password, refreshToken };
  users.push(newUser);
  io.emit("new-user", newUser);
  res.status(201).json(newUser);
});

app.post("/login", (req, res) => {
  const { user, password } = req.body;

  const existingUser = users.find((u) => u.user === user && u.password === password);
  if (!existingUser) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const newRefreshToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  existingUser.refreshToken = newRefreshToken;

  res.status(200).json({ message: "Login successful", refreshToken: newRefreshToken });
});

app.post("/logout", (req, res) => {
  const { refreshToken } = req.body;

  const existingUser = users.find((u) => u.refreshToken === refreshToken);
  if (!existingUser) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  existingUser.refreshToken = null;

  res.status(200).json({ message: "Logout successful" });
});

// Start the server
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
