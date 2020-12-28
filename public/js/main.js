const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

// DOM manipulatin - output room

const outputRoom = (room) => {
  roomName.innerText = room;
};

// DOM manipulation - output room users list
const outputRoomUsers = (users) => {
  usersList.innerHTML = `${users
    .map((user) => `<li> ${user.username} </li>`)
    .join("")}`;
};

// get username and chat room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// emit the event when user selects the chat room and enter into the chat
socket.emit("chatRoom", { username, room });

// function to manipulate the DOM to add chat message in UI
const outputToDOM = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`;
  document.querySelector(".chat-messages").appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

socket.on("message", (message) => {
  outputToDOM(message);
});

socket.on("roomUsers", ({ room, users }) => {
  outputRoom(room);
  outputRoomUsers(users);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const chatMessage = e.target.elements.msg.value;
  socket.emit("chat", chatMessage);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
