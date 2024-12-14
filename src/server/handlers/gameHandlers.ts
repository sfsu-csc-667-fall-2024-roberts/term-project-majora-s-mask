import db from "../config/db";
import { generateBingoBoard } from "../utils/bingoUtils";

interface CreateGameRequestBody {
  playerIds: number[];
}

interface BingoBoard {
  game_id: number; // Ensure this is a number
  player_id: number;
  board: string; // JSON string of the 5x5 Bingo board
  crossed_numbers: string; // JSON string of crossed numbers
  created_at: Date;
}

/**
 * Handles the creation of a new game.
 * @param playerIds - Array of player IDs
 * @returns gameId - The ID of the newly created game
 */
export async function createGame(playerIds: number[]): Promise<number> {
  // Check that playerIds are valid
  if (!playerIds || playerIds.length === 0) {
    throw new Error("At least one player ID is required to create a game.");
  }

  // Create a new game and set the initial turn to the first player
  const insertedGame = await db("games")
    .insert({
      status: "active",
      timer: 60, // Example: 60 seconds per turn
      current_turn_user_id: playerIds[0], // Set the first player as the starting turn
      created_at: db.fn.now(),
    })
    .returning("game_id");

  // Ensure game_id is correctly extracted as a number
  const gameId = insertedGame[0]?.game_id || insertedGame[0];

  if (typeof gameId !== "number") {
    throw new Error("Failed to retrieve valid game_id from database.");
  }

  // Generate 5x5 bingo boards for each player
  const boards: BingoBoard[] = playerIds.map((playerId: number) => {
    const board = generateBingoBoard(); // Function to create a random 5x5 board
    return {
      game_id: gameId, // Correctly pass the integer game_id
      player_id: playerId,
      board: JSON.stringify(board),
      crossed_numbers: JSON.stringify([]), // Initially no numbers are crossed
      created_at: new Date(),
    };
  });

  // Insert boards into the database
  await db("game_boards").insert(boards);

  return gameId; // Return the newly created game ID
}
