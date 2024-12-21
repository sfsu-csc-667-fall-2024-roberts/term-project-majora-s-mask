export function connectChatWebSocket(gameId) {
  const chatContainer = document.getElementById("chat-messages");
  const sendMessageButton = document.getElementById("send-message");
  const chatMessageInput = document.getElementById("chat-message");
  let ws; // WebSocket instance

  console.log("connectChatWebSocket loaded and available globally.");
  if (ws) {
    ws.close(); // Close any existing WebSocket connection
  }

  ws = new WebSocket(`ws://localhost:3000?gameId=${gameId}&type=chat`);
  console.log(`WebSocket URL: ws://localhost:3000?gameId=${gameId}&type=chat`);

  ws.onopen = () => {
    console.log(`Connected to chat WebSocket for game ${gameId}.`);
  };

  ws.onmessage = (event) => {
    const { username, content } = JSON.parse(event.data);

    // Append the message to the chat container
    const messageElement = document.createElement("p");
    messageElement.textContent = `${username}: ${content}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the bottom
  };

  ws.onclose = () => {
    console.log(`Disconnected from chat WebSocket for game ${gameId}.`);
  };

  ws.onerror = (error) => {
    console.error("Chat WebSocket error:", error);
  };

  sendMessageButton.addEventListener("click", () => {
    const message = chatMessageInput.value.trim();
    if (message && ws) {
      ws.send(
        JSON.stringify({
          userId, // Ensure userId is passed dynamically
          content: message,
        })
      );
      chatMessageInput.value = ""; // Clear input after sending
    }
  });
}
