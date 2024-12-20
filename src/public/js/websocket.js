import { loadGameBoard } from "./gameBoard";

//Function to connect to a WebSocket server
export function connectWebSocket(gameId, onMessage, onOpen){
    if (ws) {
        ws.close(); //close any existing WebSocket connection
    }

    const ws = new WebSocket(`ws://localhost::3000?gameId=${gameId}`);

    ws.onopen = async () => { 
        console.log("Connected to WebSocket server.");
        if (onOpen) await onOpen();
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (onMessage) onMessage(message);
    };

    ws.onclose = () => {
        console.log("Disconnected from WebSocket server.");
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    return ws;
}