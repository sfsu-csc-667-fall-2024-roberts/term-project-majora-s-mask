export async function createGame(
  userId,
  connectWebSocket,
  loadGameBoard,
  connectChatWebSocket
) {
  try {
    // Step 1: Create a new game
    const gameResponse = await fetch("/game/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerIds: [userId] }),
    });

    if (!gameResponse.ok) {
      const errorData = await gameResponse.json();
      alert(errorData.message || "Failed to create game.");
      return;
    }

    const gameData = await gameResponse.json();
    const gameId = gameData.gameId;
    console.log(`Game created successfully (Game ID: ${gameId})`);

    // Step 2: Create a chat room for the new game
    const chatResponse = await fetch("/chat/create-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    });

    if (!chatResponse.ok) {
      const chatError = await chatResponse.json();
      alert(chatError.error || "Failed to create chat room.");
      return; // Stop if chat room creation fails
    }

    const chatData = await chatResponse.json();
    const chatRoomId = chatData.chatRoom.chat_room_id; // Retrieve the chatRoomId
    console.log(`Chat room created successfully (Chat Room ID: ${chatRoomId})`);

    // Step 3: Connect WebSocket for the game
    connectWebSocket(gameId);

    // Step 4: Load the new game board
    loadGameBoard(gameId);

    // Step 5: Connect chat WebSocket, passing the chatRoomId along
    connectChatWebSocket(gameId, chatRoomId, userId);

    alert("Game created successfully!");
    console.log(
      `Game created successfully (Game ID: ${gameId}, Chat Room ID: ${chatRoomId})`
    );
    return chatRoomId; // Return the chatRoomId for future use
  } catch (err) {
    console.error("Error creating game:", err);
    alert("An unexpected error occurred while creating the game.");
  }
}
