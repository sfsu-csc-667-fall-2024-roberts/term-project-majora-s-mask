export async function createGame(
  userId,
  connectWebSocket,
  loadGameBoard,
  connectChatWebSocket
) {
  try {
    const response = await fetch("/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerIds: [userId], // Add user to the game
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Game created successfully (Game ID: ${data.gameId})`);
      alert("Game created successfully!");
      connectWebSocket(data.gameId); // Connect WebSocket for the new game
      loadGameBoard(data.gameId); // Automatically load the new game
      connectChatWebSocket(data.gameId, userId);
    } else {
      const error = await response.json();
      alert(error.message || "Failed to create game.");
    }
  } catch (err) {
    console.error("Failed to create game:", err);
    alert("An unexpected error occurred while creating the game.");
  }
}
