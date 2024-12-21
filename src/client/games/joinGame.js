export async function joinGame(
  gameId,
  userId,
  connectWebSocket,
  loadGameBoard,
  connectChatWebSocket
) {
  if (!gameId) {
    alert("Please enter a valid Game ID.");
    return;
  }

  try {
    const response = await fetch("/game/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    });

    if (response.ok) {
      alert("Joined game successfully.");
      connectWebSocket(gameId, userId); // Connect WebSocket for the joined game
      loadGameBoard(gameId); // Reload the board dynamically
      connectChatWebSocket(gameId); // Connect chat WebSocket for the joined game
    } else {
      const error = await response.json();
      alert(`Failed to join game: ${error.message}`);
    }
  } catch (err) {
    console.error("Error joining game:", err);
    alert("An unexpected error occurred while joining the game.");
  }
}
