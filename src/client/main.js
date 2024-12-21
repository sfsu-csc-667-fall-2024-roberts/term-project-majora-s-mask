import { createGame } from "./games/createGame";
import { joinGame } from "./games/joinGame";
import { loadGameBoard } from "./games/loadGameBoard";
import { connectChatWebSocket } from "./chat";
import { initializeGames } from "./initializeGames";
import { connectWebSocket } from "./games/gameWebSocket";
let globalChatRoomId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const startGameButton = document.getElementById("start-game");
  const gameBoardDiv = document.getElementById("game-board");
  const gameOptionsDiv = document.getElementById("game-options");
  const gameList = document.getElementById("game-list");
  const joinGameInput = document.getElementById("join-game-id");
  const joinGameButton = document.getElementById("join-game-button");

  initializeGames(games, startGameButton, gameBoardDiv, gameOptionsDiv);
  startGameButton.addEventListener("click", () => {
    const chatRoomId = createGame(
      userId,
      connectWebSocket,
      loadGameBoard,
      connectChatWebSocket
    ); // This should log the function definition
    globalChatRoomId = chatRoomId;
  });

  joinGameButton.addEventListener("click", async () => {
    const gameId = joinGameInput.value.trim();

    // Pass chatRoomId to joinGame
    joinGame(
      gameId,
      userId,
      connectWebSocket,
      loadGameBoard,
      connectChatWebSocket,
      globalChatRoomId
    );
  });
});
