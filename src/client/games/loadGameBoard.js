import { crossNumber } from "./crossNumber.js";

export async function loadGameBoard(gameId) {
  const gameBoardDiv = document.getElementById("game-board");

  try {
    const response = await fetch(`/game/${gameId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch game data.");
    }

    const data = await response.json();

    // Clear the game board
    gameBoardDiv.innerHTML = "";

    // Check if board data exists
    if (!data.board || !Array.isArray(data.board)) {
      gameBoardDiv.innerHTML = "<p>No game board data available.</p>";
      return;
    }

    // Render the bingo board
    data.board.forEach((row) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("bingo-row");

      row.forEach((number) => {
        const cellDiv = document.createElement("div");
        cellDiv.textContent = number;
        cellDiv.className = "bingo-cell";

        // Mark crossed-out numbers
        if (data.crossedNumbers && data.crossedNumbers.includes(number)) {
          cellDiv.classList.add("crossed-out");
        }

        // Attach event listener if it's the player's turn
        if (data.currentTurnUserId === userId) {
          cellDiv.addEventListener("click", () => crossNumber(gameId, number));
        }

        rowDiv.appendChild(cellDiv);
      });

      gameBoardDiv.appendChild(rowDiv);
    });

    // Update turn info
    const turnInfo = document.getElementById("turn-info");
    if (turnInfo) {
      turnInfo.textContent =
        data.currentTurnUserId === userId
          ? "It's your turn!"
          : `Waiting for Player ${data.currentTurnUserId}'s turn.`;
    }
  } catch (err) {
    console.error("Failed to load game board:", err);
    alert("Failed to load game board. Please try again.");
  }
}
