document.addEventListener("DOMContentLoaded", async () => {
  const startGameButton = document.getElementById("start-game");
  const gameBoardDiv = document.getElementById("game-board");
  const gameOptionsDiv = document.getElementById("game-options");
  const gameList = document.getElementById("game-list");
  const joinGameInput = document.getElementById("join-game-id");
  const joinGameButton = document.getElementById("join-game-button");

  // Initialize games on load
  if (games.length === 0) {
    // No games found, allow starting a new game
    startGameButton.style.display = "block";
    gameBoardDiv.innerHTML =
      "<p>You haven't started any games yet. Start a new game!</p>";
  } else if (games.length === 1) {
    // One game found, load it automatically
    loadGameBoard(games[0].game_id);
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
        loadGameBoard(data.gameId); // Automatically load the new game
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
        loadGameBoard(gameId); // Load the joined game
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
      gameItem.addEventListener("click", () => loadGameBoard(game.game_id));
      gameList.appendChild(gameItem);
    });
  }

  // Function to cross a number
  async function crossNumber(gameId, number) {
    try {
      const response = await fetch(`/game/${gameId}/cross`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number }),
      });

      if (response.ok) {
        loadGameBoard(gameId); // Reload the board after crossing a number
      } else {
        const error = await response.json();
        alert(`Failed to cross number: ${error.message}`);
      }
    } catch (err) {
      console.error("Error crossing number:", err);
      alert("An unexpected error occurred.");
    }
  }

  // Function to load the game board
  async function loadGameBoard(gameId) {
    try {
      const response = await fetch(`/game/${gameId}`);
      const data = await response.json();

      gameBoardDiv.innerHTML = ""; // Clear existing content

      // Render the bingo board
      data.board.forEach((row) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("bingo-row");

        row.forEach((number) => {
          const cellDiv = document.createElement("div");
          cellDiv.textContent = number;
          cellDiv.className = "bingo-cell";

          // Mark crossed-out numbers
          if (data.crossedNumbers.includes(number)) {
            cellDiv.classList.add("crossed-out");
          }

          // Attach event listener only if it's the player's turn
          if (data.currentTurnUserId === userId) {
            cellDiv.addEventListener("click", () =>
              crossNumber(gameId, number)
            );
          }

          rowDiv.appendChild(cellDiv);
        });

        gameBoardDiv.appendChild(rowDiv);
      });

      // Update turn information
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
});
