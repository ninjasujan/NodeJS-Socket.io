const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
require("dotenv").config();

/* msg formater */
const messageFormat = require("./Utils/message");
const {
  addUsers,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./Utils/users");

const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("chatRoom", ({ username, room }) => {
    const user = addUsers(socket.id, username, room);
    socket.join(user.room);
    // welcome the user
    socket.emit(
      "message",
      messageFormat(username, "Welcome to the chat board.!")
    );
    // notify to all user when the user has connected.
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageFormat(username, `${user.username} has joined the chat.`)
      );

    // send room and users info to client
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chat", (chatMessage) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", messageFormat(user.username, chatMessage));
  });

  // disconnect from chat
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    io.emit(
      "message",
      messageFormat(user.username, `${user.username} has left the chat`)
    );

    // when user diconnects update the user list in a room
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
