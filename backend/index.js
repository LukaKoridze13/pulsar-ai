import http from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: "*" });
app.use(cors());
app.use(bodyParser.json());

let onlineUsers = 0;
let users = [];

io.on("connection", (socket) => {
  onlineUsers++;
  io.emit("users-online", onlineUsers);
  socket.on("disconnect", () => {
    onlineUsers--;
  });
});

app.get("/users-online", (req, res) => {
  res.send(onlineUsers.toString());
});
app.get("/users", (req, res) => {
  res.send(onlineUsers.toString());
});
app.post("/register", (req, res) => {
  let { name, user, password, refreshToken } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).send("Invalid name");
  }

  if (!user || typeof user !== "string") {
    return res.status(400).send("Invalid user");
  }

  if (!password || typeof password !== "string" || password.length < 3) {
    return res.status(400).send("Invalid password. Password must be at least 3 characters long.");
  }
  let userObj = { name, user, password, refreshToken };
  users.push(user)
  res.send("Success!");
});

server.listen(3824, () => {
  console.log("Socket.io server listening on port 3824");
});
