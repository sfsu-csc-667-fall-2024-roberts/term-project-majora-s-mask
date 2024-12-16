/**
 * Generate a 5x5 Bingo board with numbers 1-25 in random order.
 * @returns A 2D array representing the Bingo board
 */
export function generateBingoBoard(): number[][] {
  const numbers: number[] = Array.from({ length: 25 }, (_, i) => i + 1); // 1-25 numbers
  shuffle(numbers); // Shuffle the numbers randomly
  const board: number[][] = [];
  for (let i = 0; i < 5; i++) {
    board.push(numbers.slice(i * 5, i * 5 + 5));
  }
  return board;
}
export function safeJSONParse(data: any): any {
  try {
    if (typeof data === "string") {
      return JSON.parse(data);
    }
    return data; // Already an array or object
  } catch (error) {
    console.error("Invalid JSON encountered:", data);
    return []; // Default to an empty array
  }
}
/**
 * Shuffle an array of numbers using Fisher-Yates algorithm.
 * @param array - Array of numbers to shuffle
 */
export function shuffle(array: number[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Helper to check win condition
export function checkWinCondition(
  board: number[][],
  crossedNumbers: number[]
): boolean {
  const size = board.length;

  // Check each row
  for (let i = 0; i < size; i++) {
    const row = board[i];
    if (row.every((num) => crossedNumbers.includes(num))) {
      return true;
    }
  }

  // Check each column
  for (let j = 0; j < size; j++) {
    const column = board.map((row) => row[j]);
    if (column.every((num) => crossedNumbers.includes(num))) {
      return true;
    }
  }

  return false;
}
