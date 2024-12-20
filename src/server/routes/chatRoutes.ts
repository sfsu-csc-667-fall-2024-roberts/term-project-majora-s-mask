import { Router } from "express";
import db from "../config/db"; // Database connection

const chatRoutes = Router();

// Fetch messages for a specific chat room
chatRoutes.get("/:gameId/messages", async (req, res) => {
  const { gameId } = req.params;

  try {
    // Fetch all messages tied to this chat_room_id
    const messages = await db("messages")
      .where({ chat_room_id: gameId })
      .orderBy("timestamp", "asc");

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Failed to fetch chat messages." });
  }
});

// Save a new message in the chat room
chatRoutes.post("/:gameId/messages", async (req, res) => {
  const { gameId } = req.params;
  const { sender_user_id, content } = req.body;

  if (!content || !sender_user_id) {
    return res.status(400).json({ error: "Invalid message data." });
  }

  try {
    const [newMessage] = await db("messages")
      .insert({
        chat_room_id: gameId,
        sender_user_id,
        content,
        timestamp: new Date(),
      })
      .returning("*");

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message." });
  }
});

export default chatRoutes;
