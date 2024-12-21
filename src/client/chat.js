export function connectChatWebSocket(gameId, chatRoomId, userId) {
  const chatContainer = document.getElementById("chat-messages");
  const sendMessageButton = document.getElementById("send-message");
  const chatMessageInput = document.getElementById("chat-message");

  // Initialize WebSocket connection
  const ws = new WebSocket(`ws://localhost:3000?gameId=${gameId}&type=chat`);

  // Handle WebSocket open event
  ws.onopen = () => {
    console.log(`Connected to chat WebSocket for game ${gameId}.`);
  };

  // Handle WebSocket message event
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chatUpdate") {
      // Display all past messages
      chatContainer.innerHTML = ""; // Clear existing messages
      message.messages.forEach((msg) => {
        const messageElement = document.createElement("p");
        messageElement.textContent = `${msg.sender_user_id}: ${msg.content}`;
        chatContainer.appendChild(messageElement);
      });
      chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll
    }

    if (message.type === "newMessage") {
      // Display a new incoming message
      const { userId: senderId, content } = message.data;
      const messageElement = document.createElement("p");
      messageElement.textContent = `${senderId}: ${content}`;
      chatContainer.appendChild(messageElement);
      chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll
    }
  };

  // Send chat message via WebSocket and REST API
  sendMessageButton.addEventListener("click", async () => {
    const messageText = chatMessageInput.value.trim();

    if (messageText && ws.readyState === WebSocket.OPEN) {
      // REST API call to save the message in the database
      try {
        const response = await fetch("/chat/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatRoomId, // Pass the correct chatRoomId
            userId, // Pass the userId of the sender
            message: messageText, // The actual message content
          }),
        });

        if (response.ok) {
          console.log("Message successfully saved to the database.");
        } else {
          console.error("Failed to save message to the database.");
        }
      } catch (error) {
        console.error("Error saving message via REST API:", error);
      }

      // WebSocket message broadcast for real-time updates
      ws.send(
        JSON.stringify({
          chatRoomId, // Pass the chatRoomId
          userId, // Pass the userId of the sender
          gameId,
        })
      );
      console.log("Message sent via WebSocket.");

      chatMessageInput.value = ""; // Clear the input field
    } else if (ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket connection is not open.");
      alert("Unable to send message. Chat is disconnected.");
    }
  });
}
