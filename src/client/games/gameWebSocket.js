import { loadGameBoard } from "./loadGameBoard.js"; // Ensure correct import path

export function connectWebSocket(gameId, userId) {
  let ws = new WebSocket(`ws://localhost:3000?gameId=${gameId}`);

  ws.onopen = async () => {
    console.log("Connected to WebSocket server.");
    await loadGameBoard(gameId); // Use imported loadGameBoard
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "updateTurn") {
      const { currentTurnUserId, boards } = message.data;

      const allCrossedNumbers = boards
        .map((board) => board.crossedNumbers || [])
        .flat();

      // Update the crossed numbers dynamically
      document.querySelectorAll(".bingo-cell").forEach((cell) => {
        const number = parseInt(cell.textContent);
        if (allCrossedNumbers.includes(number)) {
          cell.classList.add("crossed-out");
        }
      });

      // Update the turn information
      const turnInfo = document.getElementById("turn-info");
      if (turnInfo) {
        turnInfo.textContent =
          currentTurnUserId === userId
            ? "It's your turn!"
            : `Waiting for Player ${currentTurnUserId}'s turn.`;
      }
    }

    if (message.type === "reloadState") {
      console.log("Reloading game state...");
      loadGameBoard(gameId); // Use imported loadGameBoard
    }

    if (message.type === "gameFinished") {
      alert(`Player ${message.winner} has won the game!`);
    }
  };

  ws.onclose = () => {
    console.log("Disconnected from WebSocket server.");
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return ws; // Return the WebSocket instance if needed for later use
}
