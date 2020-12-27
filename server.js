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
  console.log("NEW WS CONNECTED.");
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
