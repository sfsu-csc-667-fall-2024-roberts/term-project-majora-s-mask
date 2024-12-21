import { connectWebSocket } from "./games/gameWebSocket.js";
import { loadGameBoard } from "./games/loadGameBoard.js";
// Function to populate the game list dynamically
export function populateGameList(games) {
  const gameList = document.getElementById("game-list");
  gameList.innerHTML = ""; // Clear the list
  games.forEach((game) => {
    const gameItem = document.createElement("li");
    gameItem.textContent = `Game ID: ${game.game_id}`;
    gameItem.dataset.gameId = game.game_id; // Attach game ID to the list item
    gameItem.addEventListener("click", () => {
      connectWebSocket(game.game_id); // Connect WebSocket for the selected game
      loadGameBoard(game.game_id, userId);
    });
    gameList.appendChild(gameItem);
  });
}
