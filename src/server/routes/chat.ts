import express, { Request, Response } from 'express';
import db from "../config/db";
import { broadcastToGame } from "../config/websockets";

const chatRoutes = express.Router();

//Endpoint to send message to chat
chatRoutes.post("/:gameId/message", async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const { message } = req.body;
        const userId = (req.session as any)?.userId;

        if (!message || !userId) {
            res.status(400).json({ error: "Invalid request"});
            return;
        }

        await db("messages").insert({
            chat_room_id: gameId,
            sender_id: userId,
            content: message,
            timestamp: new Date(),
        });
        
        broadcastToGame(gameId, {
            type: "chatMessage",
            message: {
                userId,
                content: message,
                timestamp: new Date(),
            },
        });
        
        res.status(201).json( {message: "Message sent successfully"}); 
    } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Internal server error - Failed to send message" })
    }
});

export default chatRoutes;
