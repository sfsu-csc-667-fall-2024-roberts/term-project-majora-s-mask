import express, { Request, Response } from "express";
import { createGame } from "../handlers/gameHandlers";
import { RequestHandler } from "express";
import db from "../config/db";
import { generateBingoBoard, checkWinCondition } from "../utils/bingoUtils";
import { sendGameUpdate, broadcastToGame } from "../config/websockets";

const gameRoutes = express.Router();

interface CrossNumberRequestBody {
  number: number;
}

// Route to render the game page
const loadGamePageHandler: RequestHandler = async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;

    if (!userId) {
      res.status(400).send("User not logged in.");
      return;
    }

    // Fetch all games for the logged-in user
    const games = await db("game_boards")
      .join("games", "game_boards.game_id", "games.game_id")
      .where("game_boards.player_id", userId)
      .select("games.game_id", "games.created_at", "games.status");

    // Render the template and pass the games and userId
    res.render("game", {
      title: "Game",
      userId,
      games, // Pass games array to the EJS template
    });
  } catch (err) {
    console.error("Error fetching user games:", err);
    res.status(500).send("Failed to load game page.");
  }
};

// Use the handler for the GET "/" route
gameRoutes.get("/", loadGamePageHandler);

// Route to create a new game
const createGameHandler: RequestHandler = async (req, res) => {
  try {
    const { playerIds } = req.body;

    if (!playerIds || !Array.isArray(playerIds)) {
      res.status(400).json({ error: "Invalid player IDs." });
      return;
    }

    const gameId = await createGame(playerIds);
    res.status(201).json({ message: "Game created successfully", gameId });
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ error: "Failed to create game." });
  }
};

gameRoutes.post("/create", createGameHandler);

const getGameByIdHandler: RequestHandler<{ gameId: string }> = async (
  req,
  res
) => {
  try {
    const { gameId } = req.params;
    const userId = (req.session as any)?.userId;

    if (!userId) {
      res.status(401).json({ error: "User not logged in." });
      return;
    }

    // Fetch the user's board for the specified game
    const gameBoard = await db("game_boards")
      .where({ game_id: gameId, player_id: userId })
      .first();

    if (!gameBoard) {
      res
        .status(404)
        .json({ error: "User does not have a board in this game." });
      return;
    }

    // Fetch the game details
    const game = await db("games").where({ game_id: gameId }).first();

    if (!game) {
      res.status(404).json({ error: "Game not found." });
      return;
    }

    // Debugging: Log the fetched data (remove or comment out in production)
    console.log("Fetched game board:", gameBoard);
    console.log("Fetched game:", game);

    // Parse the board and crossed_numbers JSON fields
    const board =
      typeof gameBoard.board === "string"
        ? JSON.parse(gameBoard.board)
        : gameBoard.board;

    const crossedNumbers =
      typeof gameBoard.crossed_numbers === "string"
        ? JSON.parse(gameBoard.crossed_numbers)
        : gameBoard.crossed_numbers;

    // Include `current_turn_user_id` in the response
    res.status(200).json({
      board,
      crossedNumbers,
      currentTurnUserId: game.current_turn_user_id,
    });
  } catch (error) {
    console.error("Error fetching game data:", error);
    res.status(500).json({ error: "Failed to fetch game data." });
    return;
  }
};

// Use the handler in the route
gameRoutes.get("/:gameId", getGameByIdHandler);

// Explicitly define the RequestHandler type

const crossNumberHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { gameId } = req.params;
    const { number } = req.body as CrossNumberRequestBody;
    const userId = (req.session as any)?.userId;

    if (!number || typeof number !== "number" || !userId) {
      res.status(400).json({ error: "Invalid input." });
      return;
    }

    // Fetch the current game
    const game = await db("games").where({ game_id: gameId }).first();
    if (!game) {
      res.status(404).json({ error: "Game not found." });
      return;
    }

    // Check if it's the current user's turn
    if (game.current_turn_user_id !== userId) {
      res.status(403).json({ error: "It's not your turn." });
      return;
    }

    // Fetch all game boards for the game
    const boards = await db("game_boards").where({ game_id: gameId });
    if (!boards || boards.length === 0) {
      res.status(404).json({ error: "Game not found." });
      return;
    }

    // Update crossed numbers for all players in the game
    for (const board of boards) {
      const crossedNumbers =
        typeof board.crossed_numbers === "string"
          ? JSON.parse(board.crossed_numbers)
          : board.crossed_numbers || [];

      if (!crossedNumbers.includes(number)) {
        crossedNumbers.push(number);
        await db("game_boards")
          .where({ board_id: board.board_id })
          .update({ crossed_numbers: JSON.stringify(crossedNumbers) });
      }
    }

    // Check if the current player (who just played) has won
    const currentPlayerBoard = await db("game_boards")
      .where({ game_id: gameId, player_id: userId })
      .first();

    const playerBoard = currentPlayerBoard.board;
    const playerCrossed = currentPlayerBoard.crossed_numbers || "[]";

    if (checkWinCondition(playerBoard, playerCrossed)) {
      // Update the game status to finished
      await db("games")
        .where({ game_id: gameId })
        .update({ status: "completed" });

      // Notify all players that the current player has won
      sendGameUpdate(gameId, boards, userId);

      // You might send a special message indicating a win
      broadcastToGame(gameId, {
        type: "gameFinished",
        winner: userId,
      });

      console.log(`Player ${userId} has won the game ${gameId}.`);
      res.status(200).json({ message: "You have won the game!" });
      return;
    }

    // Determine the next player's turn
    const allPlayerIds = boards.map((b) => b.player_id);
    const currentPlayerIndex = allPlayerIds.indexOf(userId);
    const nextPlayerId =
      allPlayerIds[(currentPlayerIndex + 1) % allPlayerIds.length];

    // Update the current turn in the `games` table
    await db("games").where({ game_id: gameId }).update({
      current_turn_user_id: nextPlayerId,
    });

    // Use `sendGameUpdate` to broadcast the updated state
    sendGameUpdate(gameId, boards, nextPlayerId);

    console.log(
      `Player ${userId} played ${number}. Next turn: ${nextPlayerId}`
    );

    res.status(200).json({ message: "Number crossed and turn updated." });
  } catch (error) {
    console.error("Error crossing number:", error);
    res.status(500).json({ error: "Failed to cross number and update turn." });
  }
};
// Attach the handler to the route
gameRoutes.post("/:gameId/cross", crossNumberHandler);

const getGamesForUserHandler: RequestHandler = async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;

    if (!userId) {
      res.status(400).json({ error: "User not logged in." });
      return;
    }

    // Fetch all games for this user
    const games = await db("game_boards")
      .join("games", "game_boards.game_id", "games.game_id")
      .where("game_boards.player_id", userId)
      .select("games.game_id", "games.created_at", "games.status");

    if (!games || games.length === 0) {
      res.status(200).json({ games: [] });
      return;
    }

    res.status(200).json({ games });
  } catch (error) {
    console.error("Error fetching games for user:", error);
    res.status(500).json({ error: "Failed to fetch games." });
  }
};

// Add this route to the game routes
gameRoutes.get("/user/games", getGamesForUserHandler);

// Route to join a game
const joinGameHandler: RequestHandler = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = (req.session as any)?.userId;

    if (!gameId || !userId) {
      res.status(400).json({ error: "Invalid game ID or user ID." });
      return;
    }

    // Check if the game exists
    const game = await db("games").where({ game_id: gameId }).first();
    if (!game) {
      res.status(404).json({ error: "Game not found." });
      return;
    }

    // Check if the user is already in the game
    const existingBoard = await db("game_boards")
      .where({ game_id: gameId, player_id: userId })
      .first();

    if (existingBoard) {
      res.status(200).json({ message: "User already in the game." });
      return;
    }

    // Add the user to the game with a new board
    const newBoard = {
      game_id: gameId,
      player_id: userId,
      board: JSON.stringify(generateBingoBoard()), // Make sure generateBingoBoard is imported
      crossed_numbers: JSON.stringify([]),
      created_at: new Date(),
    };
    await db("game_boards").insert(newBoard);

    const boards = await db("game_boards").where({ game_id: gameId });

    // Broadcast the updated state
    sendGameUpdate(gameId, boards, game.current_turn_user_id);
    res.status(201).json({ message: "User joined the game successfully." });
  } catch (error) {
    console.error("Error joining game:", error);
    res.status(500).json({ error: "Failed to join game." });
  }
};

// Route to handle user turns
const takeTurnHandler: RequestHandler = async (req, res) => {
  try {
    const { gameId, number } = req.body;
    const userId = (req.session as any)?.userId;

    if (!gameId || !number || !userId) {
      res.status(400).json({ error: "Invalid input data." });
      return;
    }

    // Fetch the game and validate turn
    const game = await db("games").where({ game_id: gameId }).first();
    if (!game) {
      res.status(404).json({ error: "Game not found." });
      return;
    }

    if (game.current_turn_user_id !== userId) {
      res.status(403).json({ error: "It's not your turn." });
      return;
    }

    // Update crossed numbers for all players in the game
    const players = await db("game_boards").where({ game_id: gameId });

    for (const player of players) {
      const crossedNumbers = JSON.parse(player.crossed_numbers || "[]");
      if (!crossedNumbers.includes(number)) {
        crossedNumbers.push(number);

        await db("game_boards")
          .where({ board_id: player.board_id })
          .update({ crossed_numbers: JSON.stringify(crossedNumbers) });
      }
    }

    // Move to the next player's turn
    const allPlayerIds = players.map((p) => p.player_id);
    const currentPlayerIndex = allPlayerIds.indexOf(userId);
    const nextPlayerId =
      allPlayerIds[(currentPlayerIndex + 1) % allPlayerIds.length];

    await db("games").where({ game_id: gameId }).update({
      current_turn_user_id: nextPlayerId,
    });

    res.status(200).json({ message: "Turn completed successfully." });
  } catch (error) {
    console.error("Error taking turn:", error);
    res.status(500).json({ error: "Failed to take turn." });
  }
};

// Attach handlers
gameRoutes.post("/join", joinGameHandler);
gameRoutes.post("/turn", takeTurnHandler);

export default gameRoutes;
