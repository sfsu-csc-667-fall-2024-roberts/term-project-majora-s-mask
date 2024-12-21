import { WebSocket, WebSocketServer } from "ws";
import { safeJSONParse } from "../utils/bingoUtils";

// Define a type for a game board
interface GameBoard {
  board: string;
  crossed_numbers: string;
}

// Function to send game updates
function sendGameUpdate(
  gameId: string,
  boards: GameBoard[],
  currentTurnUserId: number
) {
  const formattedBoards = boards.map((board: GameBoard) => ({
    board: safeJSONParse(board.board), // Parse board safely
    crossedNumbers: safeJSONParse(board.crossed_numbers), // Parse crossed_numbers safely
  }));

  broadcastToGame(gameId, {
    type: "updateTurn",
    data: {
      boards: formattedBoards,
      currentTurnUserId,
    },
  });
  broadcastToGame(gameId, {
    type: "reloadState",
  });
}

// WebSocket server logic
const wss = new WebSocketServer({ noServer: true });
const clients: { [gameId: string]: WebSocket[] } = {};

// Broadcast to all clients in a game
function broadcastToGame(gameId: string, data: any): void {
  if (clients[gameId]) {
    clients[gameId].forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }
}

// WebSocket connection logic
wss.on("connection", (ws, req: any) => {
  const gameId = req.url.split("?gameId=")[1];

  if (!clients[gameId]) {
    clients[gameId] = [];
  }

  clients[gameId].push(ws);

  ws.on("message", async (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (!parsedMessage) {
      console.error("Invalid message received:", message);
      return;
    }
    // Destructure the expected fields from the parsed message
    const { chatRoomId, userId, gameId } = parsedMessage;
    console.log(`Received WebSocket message for game ${gameId}`);
    try {
      // Make the retrieve-messages call
      const retrieveResponse = await fetch(
        `http://localhost:3000/chat/retrieve-messages/${gameId}`,
        { method: "GET" }
      );

      if (retrieveResponse.ok) {
        const { messages } = await retrieveResponse.json();

        // Send the retrieved messages to the frontend
        ws.send(
          JSON.stringify({
            type: "chatUpdate",
            messages, // Include the retrieved messages
          })
        );

        console.log(`Retrieved and sent messages for game ${gameId}`);
      } else {
        console.error(
          `Failed to retrieve messages for game ${gameId}: ${retrieveResponse.statusText}`
        );
      }
    } catch (error) {
      console.error("Error retrieving messages:", error);
    }
  });

  ws.on("close", () => {
    clients[gameId] = clients[gameId].filter((client) => client !== ws);
  });
});

export { wss, broadcastToGame, sendGameUpdate };
