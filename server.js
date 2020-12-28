const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
require("dotenv").config();

/* msg formater */
const messageFormat = require("./Utils/message");

const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const boatName = "Chat Boat";

io.on("connection", (socket) => {
  // selection of chat room event
  socket.on("chatRoom", ({ username, room }) => {
    // welcome the user
    socket.emit(
      "message",
      messageFormat(username, "Welcome to the chat board.!")
    );
    // notify to all user when the user has connected.
    socket.broadcast.emit(
      "message",
      messageFormat(username, "user has joined the chat")
    );
  });

  // chat sent by client
  socket.on("chat", (chatMessage) => {
    io.emit("message", messageFormat("User claira", chatMessage));
  });

  // disconnect from chat
  socket.on("disconnect", () => {
    io.emit("message", messageFormat("User claira", "user has left the chat"));
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
