import { Router, RequestHandler } from "express";
import db from "../config/db";

const chatRoutes = Router();

// Create a chat room for a game
const createChatHandler: RequestHandler = async (req, res) => {
  const { gameId } = req.body;

  if (!gameId) {
    res.status(400).json({ error: "Game ID is required." });
    return;
  }

  try {
    // Check if the game exists
    const game = await db("games").where({ game_id: gameId }).first();

    if (!game) {
      res.status(400).json({ error: `Game ID ${gameId} does not exist.` });
      return;
    }

    // Check if a chat room already exists for the game
    let chatRoom = await db("chat_rooms").where({ game_id: gameId }).first();

    if (!chatRoom) {
      // Create a new chat room
      const [newChatRoom] = await db("chat_rooms")
        .insert({ game_id: gameId })
        .returning(["chat_room_id", "game_id"]);
      chatRoom = newChatRoom;
      console.log(`Chat room created for game ID ${gameId}`);
    }

    // Respond with chat room details
    res.status(201).json({ success: true, chatRoom });
  } catch (error) {
    console.error("Error creating chat room:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create chat room." });
  }
};

// Save a chat message
const sendMessageHandler: RequestHandler = async (req, res) => {
  const { chatRoomId, userId, message } = req.body;

  if (!chatRoomId || !userId || !message) {
    res.status(400).json({
      success: false,
      error: "Missing required fields (chatRoomId, userId, message).",
    });
    return;
  }

  try {
    // Save the message to the database
    await db("messages").insert({
      chat_room_id: chatRoomId,
      sender_user_id: userId,
      content: message,
      timestamp: new Date(), // Use current timestamp
    });

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, error: "Failed to send message." });
  }
};

// Retrieve all messages for a game
const retrieveMessagesHandler: RequestHandler<{ gameId: string }> = async (
  req,
  res
) => {
  const { gameId } = req.params;

  if (!gameId) {
    res.status(400).json({
      success: false,
      error: "Missing required parameter: gameId.",
    });
    return;
  }

  try {
    // Fetch all messages for the given gameId
    const messages = await db("messages")
      .join("chat_rooms", "messages.chat_room_id", "chat_rooms.chat_room_id")
      .where("chat_rooms.game_id", gameId)
      .select(
        "messages.message_id",
        "messages.sender_user_id",
        "messages.content",
        "messages.timestamp"
      )
      .orderBy("messages.timestamp", "asc"); // Order messages by timestamp

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve messages." });
  }
};

// Attach handlers to routes
chatRoutes.post("/create-chat", createChatHandler);
chatRoutes.post("/send-message", sendMessageHandler);
chatRoutes.get("/retrieve-messages/:gameId", retrieveMessagesHandler);

export { chatRoutes };
