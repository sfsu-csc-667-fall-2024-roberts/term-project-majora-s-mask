import express from "express";
import db from "../config/db";
import { broadcastToGame } from "../config/websockets";

const chatRoutes = express.Router();

// Save chat messages
chatRoutes.post("/save-message", async (req, res) => {
  const { gameId, userId, message } = req.body;

  try {
    // Save the message to the database
    await db("chat_messages").insert({
      game_id: gameId,
      user_id: userId,
      message,
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(500).send({ success: false, error: "Failed to save message." });
  }
});

// Retrieve username and broadcast the message
async function retrieveAndBroadcastMessage(
  gameId: string,
  userId: string,
  message: string
): Promise<void> {
  try {
    const user = await db("users").where("user_id", userId).first();
    if (!user) {
      console.error(`User not found for userId: ${userId}`);
      return;
    }

    const username = user.username;

    // Broadcast the message
    broadcastToGame(gameId, {
      type: "chatMessage",
      username,
      content: message,
    });
  } catch (error) {
    console.error("Error retrieving username or broadcasting message:", error);
  }
}

export { chatRoutes, retrieveAndBroadcastMessage };
