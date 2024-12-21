import { loadGameBoard } from "./games/loadGameBoard.js";
import { populateGameList } from "./populateGameList.js";

export function initializeGames(
  games,
  startGameButton,
  gameBoardDiv,
  gameOptionsDiv
) {
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
}
