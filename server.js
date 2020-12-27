const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
require("dotenv").config();

const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  // welcome the user
  socket.emit("message", "Welcome to chat board.");
  // notify to all user when the user has connected.
  socket.broadcast.emit("message", "A user has joined the chat.!");

  // chat sent by client
  socket.on("chat", (chatMessage) => {
    console.log("chat message by user", chatMessage);
    io.emit("message", chatMessage);
  });

  // disconnect from chat
  socket.on("disconnect", () => {
    io.emit("message", "user has left the chat.!");
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
