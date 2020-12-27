const socket = io();
const chatForm = document.getElementById("chat-form");

// function to manipulate the DOM to add chat message in UI
const outputToDOM = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Mary <span>9:15pm</span></p>
            <p class="text">
              ${message}
            </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

socket.on("message", (message) => {
  console.log(message);
  outputToDOM(message);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const chatMessage = e.target.elements.msg.value;
  socket.emit("chat", chatMessage);
});
