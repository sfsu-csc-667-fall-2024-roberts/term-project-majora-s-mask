import { connectWebSocket } from "./websocket.js";
import { loadGameBoard, crossNumber } from "./gameBoard.js";

document.addEventListener("DOMContentLoaded", async () => {
  const startGameButton = document.getElementById("start-game");
  const gameBoardDiv = document.getElementById("game-board");
  const gameOptionsDiv = document.getElementById("game-options");
  const gameList = document.getElementById("game-list");
  const joinGameInput = document.getElementById("join-game-id");
  const joinGameButton = document.getElementById("join-game-button");
  let ws; // WebSocket instance

  // Initialize games on load
  if (games.length === 0) {
    // No games found, allow starting a new game
    startGameButton.style.display = "block";
    gameBoardDiv.innerHTML =
      "<p>You haven't started any games yet. Start a new game!</p>";
  } else if (games.length === 1) {
    // One game found, load it automatically
    loadGameBoard(games[0].game_id, userId);
  } else {
    // Multiple games found, show options
    gameOptionsDiv.style.display = "block";
    populateGameList(games);
  }

  // Handle starting a new game
  startGameButton.addEventListener("click", async () => {
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
        ws = connectWebSocket(data.gameId, handleWebSocketMessage, () => 
          loadGameBoard(data.gameId, userId) // Automatically load the new game
        ); // Connect WebSocket for the new game
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create game.");
      }
    } catch (err) {
      console.error("Failed to create game:", err);
      alert("An unexpected error occurred while creating the game.");
    }
  });

  // Handle joining a game
  joinGameButton.addEventListener("click", async () => {
    const gameId = joinGameInput.value.trim();

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
        ws = connectWebSocket(gameId, handleWebSocketMessage, () => 
          loadGameBoard(gameId, true) // Reload the board dynamically        
        ); // Connect WebSocket for the joined game
      } else {
        const error = await response.json();
        alert(`Failed to join game: ${error.message}`);
      }
    } catch (err) {
      console.error("Error joining game:", err);
      alert("An unexpected error occurred while joining the game.");
    }
  });

  // Function to populate the game list dynamically
  function populateGameList(games) {
    gameList.innerHTML = ""; // Clear the list
    games.forEach((game) => {
      const gameItem = document.createElement("li");
      gameItem.textContent = `Game ID: ${game.game_id} - Started At: ${new Date(
        game.created_at
      ).toLocaleString()}`;
      gameItem.dataset.gameId = game.game_id; // Attach game ID to the list item
      gameItem.addEventListener("click", () => {
        ws = connectWebSocket(game.game_id, handleWebSocketMessage, () => 
          loadGameBoard(game.game_id, userId)
        ); // Connect WebSocket for the selected game
      });
      gameList.appendChild(gameItem);
    });
  }

  // Function to handle WebSocket messages
  function handleWebSocketMessage(gameId) {
    if(message.type === "updateTurn") {
      const { currentTurnUserId } = message;
      
      const allCrossedNumbers = boards
        .map((board) => board.crossedNumbers || [])
        .flat();

        //update crossed numbers dynamically
      document.querySelectorAll(".bingo-cell").forEach((cell) => {
        const number = parseInt(cell.textContent, 10);
        if (allCrossedNumbers.includes(number)) {
          cell.classList.add("crossed-out");
        } else {
          cell.classList.remove("crossed-out");
        }
      });

      //update turn info
      const turnInfo = document.getElementById("turn-info");
      if (turnInfo) {
        turnInfo.textContent =
          currentTurnUserId === userId
            ? "It's your turn!"
            : `Waiting for Player ${currentTurnUserId}'s turn.`;
      }

      if (message.type === "reloadState") {
        console.log("Reloading game state...");
        loadGameBoard(gameId, true); // Force full reload for state changes like joining a game
      }
      if (message.type === "gameFinished") {
        alert(`Player ${message.winner} has won the game!`);
      }
    };
  }
});
