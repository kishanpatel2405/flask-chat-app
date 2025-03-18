var socket = io.connect("http://localhost:5000");

function joinRoom() {
    var username = document.getElementById("username").value;
    var room = document.getElementById("room").value;
    if (username.trim() === "" || room.trim() === "") {
        alert("Please enter a username and room name.");
        return;
    }
    socket.emit("join", { username, room });
    loadChatHistory();  // Load previous messages
}

function sendMessage() {
    var username = document.getElementById("username").value;
    var room = document.getElementById("room").value;
    var message = document.getElementById("message").value.trim();
    if (message !== "") {
        socket.emit("message", { username, room, message });
        document.getElementById("message").value = "";
    }
}

socket.on("message", function(data) {
    var chatBox = document.getElementById("chat-box");
    var messageElement = document.createElement("div");
    messageElement.classList.add("message");

    var username = document.getElementById("username").value;
    if (data.startsWith(username + ":")) {
        messageElement.classList.add("user");
    } else {
        messageElement.classList.add("other");
    }

    messageElement.innerHTML = `<strong>${data}</strong>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;  // Auto-scroll to latest message
});

function loadChatHistory() {
    var room = document.getElementById("room").value;
    fetch(`/messages/${room}`)
        .then(response => response.json())
        .then(data => {
            var chatBox = document.getElementById("chat-box");
            chatBox.innerHTML = "";
            data.forEach(msg => {
                var messageElement = document.createElement("div");
                messageElement.classList.add("message");

                if (msg.username === document.getElementById("username").value) {
                    messageElement.classList.add("user");
                } else {
                    messageElement.classList.add("other");
                }

                messageElement.innerHTML = `<strong>${msg.username}:</strong> ${msg.message} <span class="timestamp">${msg.timestamp}</span>`;
                chatBox.appendChild(messageElement);
            });
            chatBox.scrollTop = chatBox.scrollHeight;
        });
}
