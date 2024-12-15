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
export function checkWinCondition(board: number[][], crossedNumbers: number[]) {
  // Check horizontal lines
  for (const row of board) {
    if (row.every((num) => crossedNumbers.includes(num))) return true;
  }

  // Check vertical lines
  for (let col = 0; col < board[0].length; col++) {
    const column = board.map((row) => row[col]);
    if (column.every((num) => crossedNumbers.includes(num))) return true;
  }

  return false;
}
