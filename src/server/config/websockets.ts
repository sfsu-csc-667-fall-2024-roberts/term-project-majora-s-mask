import WebSocket, { WebSocketServer, WebSocket as WS } from "ws";

// Create a WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Define a type for the clients map
interface ClientsMap {
  [gameId: string]: WS[];
}

// Store WebSocket clients mapped to their gameId
const clients: ClientsMap = {};

// WebSocket connection handler
wss.on("connection", (ws: WS, req: any) => {
  const gameId = req.url.split("?gameId=")[1]; // Extract the gameId from the URL

  if (!clients[gameId]) {
    clients[gameId] = [];
  }

  clients[gameId].push(ws);

  ws.on("message", (message: string) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === "updateTurn") {
      // Broadcast turn update
      broadcastToGame(gameId, parsedMessage.data);
    }

    if (parsedMessage.type === "chat") {
      // Broadcast chat messages
      broadcastToGame(gameId, parsedMessage.data);
    }
  });

  ws.on("close", () => {
    if (clients[gameId]) {
      clients[gameId] = clients[gameId].filter((client) => client !== ws);
    }
  });
});

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

export { wss, broadcastToGame };
