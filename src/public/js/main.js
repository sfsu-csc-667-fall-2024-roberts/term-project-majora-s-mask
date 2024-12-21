/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/chat.js":
/*!****************************!*\
  !*** ./src/client/chat.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectChatWebSocket: () => (/* binding */ connectChatWebSocket)\n/* harmony export */ });\nfunction connectChatWebSocket(gameId) {\n  const chatContainer = document.getElementById(\"chat-messages\");\n  const sendMessageButton = document.getElementById(\"send-message\");\n  const chatMessageInput = document.getElementById(\"chat-message\");\n  let ws; // WebSocket instance\n\n  console.log(\"connectChatWebSocket loaded and available globally.\");\n  if (ws) {\n    ws.close(); // Close any existing WebSocket connection\n  }\n\n  ws = new WebSocket(`ws://localhost:3000?gameId=${gameId}&type=chat`);\n  console.log(`WebSocket URL: ws://localhost:3000?gameId=${gameId}&type=chat`);\n\n  ws.onopen = () => {\n    console.log(`Connected to chat WebSocket for game ${gameId}.`);\n  };\n\n  ws.onmessage = (event) => {\n    const { username, content } = JSON.parse(event.data);\n\n    // Append the message to the chat container\n    const messageElement = document.createElement(\"p\");\n    messageElement.textContent = `${username}: ${content}`;\n    chatContainer.appendChild(messageElement);\n    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the bottom\n  };\n\n  ws.onclose = () => {\n    console.log(`Disconnected from chat WebSocket for game ${gameId}.`);\n  };\n\n  ws.onerror = (error) => {\n    console.error(\"Chat WebSocket error:\", error);\n  };\n\n  sendMessageButton.addEventListener(\"click\", () => {\n    const message = chatMessageInput.value.trim();\n    if (message && ws) {\n      ws.send(\n        JSON.stringify({\n          userId, // Ensure userId is passed dynamically\n          content: message,\n        })\n      );\n      chatMessageInput.value = \"\"; // Clear input after sending\n    }\n  });\n}\n\n\n//# sourceURL=webpack://term-project-majora-s-mask/./src/client/chat.js?");

/***/ }),

/***/ "./src/client/games/createGame.js":
/*!****************************************!*\
  !*** ./src/client/games/createGame.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createGame: () => (/* binding */ createGame)\n/* harmony export */ });\nasync function createGame(\n  userId,\n  connectWebSocket,\n  loadGameBoard,\n  connectChatWebSocket\n) {\n  try {\n    const response = await fetch(\"/game/create\", {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\",\n      },\n      body: JSON.stringify({\n        playerIds: [userId], // Add user to the game\n      }),\n    });\n\n    if (response.ok) {\n      const data = await response.json();\n      console.log(`Game created successfully (Game ID: ${data.gameId})`);\n      alert(\"Game created successfully!\");\n      connectWebSocket(data.gameId); // Connect WebSocket for the new game\n      loadGameBoard(data.gameId); // Automatically load the new game\n      connectChatWebSocket(data.gameId, userId);\n    } else {\n      const error = await response.json();\n      alert(error.message || \"Failed to create game.\");\n    }\n  } catch (err) {\n    console.error(\"Failed to create game:\", err);\n    alert(\"An unexpected error occurred while creating the game.\");\n  }\n}\n\n\n//# sourceURL=webpack://term-project-majora-s-mask/./src/client/games/createGame.js?");

/***/ }),

/***/ "./src/client/games/crossNumber.js":
/*!*****************************************!*\
  !*** ./src/client/games/crossNumber.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   crossNumber: () => (/* binding */ crossNumber)\n/* harmony export */ });\nasync function crossNumber(gameId, number) {\n  try {\n    const response = await fetch(`/game/${gameId}/cross`, {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\",\n      },\n      body: JSON.stringify({ number }),\n    });\n\n    if (response.ok) {\n      console.log(\"Number crossed successfully.\"); // Server will broadcast update via WebSocket\n    } else {\n      const error = await response.json();\n      alert(`Failed to cross number: ${error.message}`);\n    }\n  } catch (err) {\n    console.error(\"Error crossing number:\", err);\n    alert(\"An unexpected error occurred.\");\n  }\n}\n\n\n//# sourceURL=webpack://term-project-majora-s-mask/./src/client/games/crossNumber.js?");

/***/ }),

/***/ "./src/client/games/gameWebSocket.js":
/*!*******************************************!*\
  !*** ./src/client/games/gameWebSocket.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectWebSocket: () => (/* binding */ connectWebSocket)\n/* harmony export */ });\n/* harmony import */ var _loadGameBoard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadGameBoard.js */ \"./src/client/games/loadGameBoard.js\");\n // Ensure correct import path\n\nfunction connectWebSocket(gameId, userId) {\n  let ws = new WebSocket(`ws://localhost:3000?gameId=${gameId}`);\n\n  ws.onopen = async () => {\n    console.log(\"Connected to WebSocket server.\");\n    await (0,_loadGameBoard_js__WEBPACK_IMPORTED_MODULE_0__.loadGameBoard)(gameId); // Use imported loadGameBoard\n  };\n\n  ws.onmessage = (event) => {\n    const message = JSON.parse(event.data);\n\n    if (message.type === \"updateTurn\") {\n      const { currentTurnUserId, boards } = message.data;\n\n      const allCrossedNumbers = boards\n        .map((board) => board.crossedNumbers || [])\n        .flat();\n\n      // Update the crossed numbers dynamically\n      document.querySelectorAll(\".bingo-cell\").forEach((cell) => {\n        const number = parseInt(cell.textContent);\n        if (allCrossedNumbers.includes(number)) {\n          cell.classList.add(\"crossed-out\");\n        }\n      });\n\n      // Update the turn information\n      const turnInfo = document.getElementById(\"turn-info\");\n      if (turnInfo) {\n        turnInfo.textContent =\n          currentTurnUserId === userId\n            ? \"It's your turn!\"\n            : `Waiting for Player ${currentTurnUserId}'s turn.`;\n      }\n    }\n\n    if (message.type === \"reloadState\") {\n      console.log(\"Reloading game state...\");\n      (0,_loadGameBoard_js__WEBPACK_IMPORTED_MODULE_0__.loadGameBoard)(gameId); // Use imported loadGameBoard\n    }\n\n    if (message.type === \"gameFinished\") {\n      alert(`Player ${message.winner} has won the game!`);\n    }\n  };\n\n  ws.onclose = () => {\n    console.log(\"Disconnected from WebSocket server.\");\n  };\n\n  ws.onerror = (error) => {\n    console.error(\"WebSocket error:\", error);\n  };\n\n  return ws; // Return the WebSocket instance if needed for later use\n}\n\n\n//# sourceURL=webpack://term-project-majora-s-mask/./src/client/games/gameWebSocket.js?");

/***/ }),

/***/ "./src/client/games/joinGame.js":
/*!**************************************!*\
  !*** ./src/client/games/joinGame.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   joinGame: () => (/* binding */ joinGame)\n/* harmony export */ });\nasync function joinGame(\n  gameId,\n  userId,\n  connectWebSocket,\n  loadGameBoard,\n  connectChatWebSocket\n) {\n  if (!gameId) {\n    alert(\"Please enter a valid Game ID.\");\n    return;\n  }\n\n  try {\n    const response = await fetch(\"/game/join\", {\n      method: \"POST\",\n      headers: { \"Content-Type\": \"application/json\" },\n      body: JSON.stringify({ gameId }),\n    });\n\n    if (response.ok) {\n      alert(\"Joined game successfully.\");\n      connectWebSocket(gameId, userId); // Connect WebSocket for the joined game\n      loadGameBoard(gameId); // Reload the board dynamically\n      connectChatWebSocket(gameId); // Connect chat WebSocket for the joined game\n    } else {\n      const error = await response.json();\n      alert(`Failed to join game: ${error.message}`);\n    }\n  } catch (err) {\n    console.error(\"Error joining game:\", err);\n    alert(\"An unexpected error occurred while joining the game.\");\n  }\n}\n\n\n//# sourceURL=webpack://term-project-majora-s-mask/./src/client/games/joinGame.js?");

/***/ }),

/***/ "./src/client/games/loadGameBoard.js":
/*!*******************************************!*\
  !*** ./src/client/games/loadGameBoard.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadGameBoard: () => (/* binding */ loadGameBoard)\n/* harmony export */ });\n/* harmony import */ var _crossNumber_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./crossNumber.js */ \"./src/client/games/crossNumber.js\");\n\n\nasync function loadGameBoard(gameId) {\n  const gameBoardDiv = document.getElementById(\"game-board\");\n\n  try {\n    const response = await fetch(`/game/${gameId}`);\n    if (!response.ok) {\n      throw new Error(\"Failed to fetch game data.\");\n    }\n\n    const data = await response.json();\n\n    // Clear the game board\n    gameBoardDiv.innerHTML = \"\";\n\n    // Check if board data exists\n    if (!data.board || !Array.isArray(data.board)) {\n      gameBoardDiv.innerHTML = \"<p>No game board data available.</p>\";\n      return;\n    }\n\n    // Render the bingo board\n    data.board.forEach((row) => {\n      const rowDiv = document.createElement(\"div\");\n      rowDiv.classList.add(\"bingo-row\");\n\n      row.forEach((number) => {\n        const cellDiv = document.createElement(\"div\");\n        cellDiv.textContent = number;\n        cellDiv.className = \"bingo-cell\";\n\n        // Mark crossed-out numbers\n        if (data.crossedNumbers && data.crossedNumbers.includes(number)) {\n          cellDiv.classList.add(\"crossed-out\");\n        }\n\n        // Attach event listener if it's the player's turn\n        if (data.currentTurnUserId === userId) {\n          cellDiv.addEventListener(\"click\", () => (0,_crossNumber_js__WEBPACK_IMPORTED_MODULE_0__.crossNumber)(gameId, number));\n        }\n\n        rowDiv.appendChild(cellDiv);\n      });\n\n      gameBoardDiv.appendChild(rowDiv);\n    });\n\n    // Update turn info\n    const turnInfo = document.getElementById(\"turn-info\");\n    if (turnInfo) {\n      turnInfo.textContent =\n        data.currentTurnUserId === userId\n          ? \"It's your turn!\"\n          : `Waiting for Player ${data.currentTurnUserId}'s turn.`;\n    }\n  } catch (err) {\n    console.error(\"Failed to load game board:\", err);\n    alert(\"Failed to load game board. Please try again.\");\n  }\n}\n\n\n//# sourceURL=webpack://term-project-majora-s-mask/./src/client/games/loadGameBoard.js?");

/***/ }),

/***/ "./src/client/initializeGames.js":
/*!***************************************!*\
  !*** ./src/client/initializeGames.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initializeGames: () => (/* binding */ initializeGames)\n/* harmony export */ });\n/* harmony import */ var _games_loadGameBoard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./games/loadGameBoard.js */ \"./src/client/games/loadGameBoard.js\");\n/* harmony import */ var _populateGameList_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./populateGameList.js */ \"./src/client/populateGameList.js\");\n\n\n\nfunction initializeGames(\n  games,\n  startGameButton,\n  gameBoardDiv,\n  gameOptionsDiv\n) {\n  if (games.length === 0) {\n    // No games found, allow starting a new game\n    startGameButton.style.display = \"block\";\n    gameBoardDiv.innerHTML =\n      \"<p>You haven't started any games yet. Start a new game!</p>\";\n  } else if (games.length === 1) {\n    // One game found, load it automatically\n    (0,_games_loadGameBoard_js__WEBPACK_IMPORTED_MODULE_0__.loadGameBoard)(games[0].game_id);\n  } else {\n    // Multiple games found, show options\n    gameOptionsDiv.style.display = \"block\";\n    (0,_populateGameList_js__WEBPACK_IMPORTED_MODULE_1__.populateGameList)(games);\n  }\n}\n\n\n//# sourceURL=webpack://term-project-majora-s-mask/./src/client/initializeGames.js?");

/***/ }),

/***/ "./src/client/main.js":
/*!****************************!*\
  !*** ./src/client/main.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _games_createGame__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./games/createGame */ \"./src/client/games/createGame.js\");\n/* harmony import */ var _games_joinGame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./games/joinGame */ \"./src/client/games/joinGame.js\");\n/* harmony import */ var _games_loadGameBoard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./games/loadGameBoard */ \"./src/client/games/loadGameBoard.js\");\n/* harmony import */ var _chat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chat */ \"./src/client/chat.js\");\n/* harmony import */ var _initializeGames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./initializeGames */ \"./src/client/initializeGames.js\");\n/* harmony import */ var _games_gameWebSocket__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./games/gameWebSocket */ \"./src/client/games/gameWebSocket.js\");\n\n\n\n\n\n\n\ndocument.addEventListener(\"DOMContentLoaded\", async () => {\n  const startGameButton = document.getElementById(\"start-game\");\n  const gameBoardDiv = document.getElementById(\"game-board\");\n  const gameOptionsDiv = document.getElementById(\"game-options\");\n  const gameList = document.getElementById(\"game-list\");\n  const joinGameInput = document.getElementById(\"join-game-id\");\n  const joinGameButton = document.getElementById(\"join-game-button\");\n\n  (0,_initializeGames__WEBPACK_IMPORTED_MODULE_4__.initializeGames)(games, startGameButton, gameBoardDiv, gameOptionsDiv);\n  startGameButton.addEventListener(\"click\", () => {\n    (0,_games_createGame__WEBPACK_IMPORTED_MODULE_0__.createGame)(userId, _games_gameWebSocket__WEBPACK_IMPORTED_MODULE_5__.connectWebSocket, _games_loadGameBoard__WEBPACK_IMPORTED_MODULE_2__.loadGameBoard, _chat__WEBPACK_IMPORTED_MODULE_3__.connectChatWebSocket); // This should log the function definition\n  });\n\n  joinGameButton.addEventListener(\"click\", () => {\n    const gameId = gameIdInput.value.trim();\n    (0,_games_joinGame__WEBPACK_IMPORTED_MODULE_1__.joinGame)(\n      gameId,\n      userId,\n      _games_gameWebSocket__WEBPACK_IMPORTED_MODULE_5__.connectWebSocket,\n      _games_loadGameBoard__WEBPACK_IMPORTED_MODULE_2__.loadGameBoard,\n      _chat__WEBPACK_IMPORTED_MODULE_3__.connectChatWebSocket\n    );\n  });\n});\n\n\n//# sourceURL=webpack://term-project-majora-s-mask/./src/client/main.js?");

/***/ }),

/***/ "./src/client/populateGameList.js":
/*!****************************************!*\
  !*** ./src/client/populateGameList.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   populateGameList: () => (/* binding */ populateGameList)\n/* harmony export */ });\n/* harmony import */ var _games_gameWebSocket_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./games/gameWebSocket.js */ \"./src/client/games/gameWebSocket.js\");\n/* harmony import */ var _games_loadGameBoard_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./games/loadGameBoard.js */ \"./src/client/games/loadGameBoard.js\");\n\n\n// Function to populate the game list dynamically\nfunction populateGameList(games) {\n  const gameList = document.getElementById(\"game-list\");\n  gameList.innerHTML = \"\"; // Clear the list\n  games.forEach((game) => {\n    const gameItem = document.createElement(\"li\");\n    gameItem.textContent = `Game ID: ${game.game_id} - Started At: ${new Date(\n      game.created_at\n    ).toLocaleString()}`;\n    gameItem.dataset.gameId = game.game_id; // Attach game ID to the list item\n    gameItem.addEventListener(\"click\", () => {\n      (0,_games_gameWebSocket_js__WEBPACK_IMPORTED_MODULE_0__.connectWebSocket)(game.game_id); // Connect WebSocket for the selected game\n      (0,_games_loadGameBoard_js__WEBPACK_IMPORTED_MODULE_1__.loadGameBoard)(game.game_id, userId);\n    });\n    gameList.appendChild(gameItem);\n  });\n}\n\n\n//# sourceURL=webpack://term-project-majora-s-mask/./src/client/populateGameList.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/client/main.js");
/******/ 	
/******/ })()
;