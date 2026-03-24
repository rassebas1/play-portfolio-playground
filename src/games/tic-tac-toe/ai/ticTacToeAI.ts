import type { Board, Position, Player, Difficulty, AIMoveResult } from '../types';

/**
 * AI Module for Tic Tac Toe
 * 
 * Implements 5 difficulty levels:
 * - Beginner: Random moves
 * - Easy: Block wins, take wins, else random
 * - Medium: Minimax depth 3 with randomness
 * - Hard: Full minimax (unbeatable)
 * - Expert: Full minimax with 10% mistake chance
 */

const WINNING_SCORE = 100;
const LOSING_SCORE = -100;
const DRAW_SCORE = 0;

/**
 * Get all empty cells from the board
 */
export function getEmptyCells(board: Board): Position[] {
  const cells: Position[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

/**
 * Check if there's a winner on the board
 */
export function checkWinner(board: Board): { winner: Player | null; line: Position[] | null } {
  const winPatterns: Position[][] = [
    // Rows
    [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
    [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
    [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
    // Columns
    [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
    [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
    [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
    // Diagonals
    [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
    [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
  ];

  for (const pattern of winPatterns) {
    const [p1, p2, p3] = pattern;
    const cell1 = board[p1.row][p1.col];
    const cell2 = board[p2.row][p2.col];
    const cell3 = board[p3.row][p3.col];

    if (cell1 && cell1 === cell2 && cell2 === cell3) {
      return { winner: cell1, line: pattern };
    }
  }

  return { winner: null, line: null };
}

/**
 * Check if board is full
 */
export function isBoardFull(board: Board): boolean {
  return getEmptyCells(board).length === 0;
}

/**
 * Make a move on a copy of the board
 */
export function makeMove(board: Board, position: Position, player: Player): Board {
  return board.map((row, r) =>
    row.map((cell, c) => (r === position.row && c === position.col ? player : cell))
  );
}

/**
 * Algorithm 1: Beginner - Random moves
 * Simply picks any empty cell at random
 */
function randomMove(board: Board, _player: Player): Position | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

/**
 * Algorithm 2: Easy - Block/Win strategy
 * 1. Take winning move if available
 * 2. Block opponent's winning move
 * 3. Otherwise random
 */
function blockOrWinMove(board: Board, player: Player): Position | null {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  
  // 1. Try to win
  const winningMove = findWinningMove(board, player);
  if (winningMove) return winningMove;
  
  // 2. Block opponent's winning move
  const blockingMove = findWinningMove(board, opponent);
  if (blockingMove) return blockingMove;
  
  // 3. Take center if available
  if (board[1][1] === null) return { row: 1, col: 1 };
  
  // 4. Take corners
  const corners = [
    { row: 0, col: 0 }, { row: 0, col: 2 },
    { row: 2, col: 0 }, { row: 2, col: 2 }
  ].filter(pos => board[pos.row][pos.col] === null);
  
  if (corners.length > 0) {
    const randomIndex = Math.floor(Math.random() * corners.length);
    return corners[randomIndex];
  }
  
  // 5. Random
  return randomMove(board, player);
}

/**
 * Find a winning move for a player
 */
function findWinningMove(board: Board, player: Player): Position | null {
  const emptyCells = getEmptyCells(board);
  
  for (const cell of emptyCells) {
    const newBoard = makeMove(board, cell, player);
    const { winner } = checkWinner(newBoard);
    if (winner === player) {
      return cell;
    }
  }
  
  return null;
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  const opponent: Player = aiPlayer === 'X' ? 'O' : 'X';
  const { winner } = checkWinner(board);
  
  // Terminal states
  if (winner === aiPlayer) return WINNING_SCORE - depth;
  if (winner === opponent) return LOSING_SCORE + depth;
  if (isBoardFull(board) || depth >= 5) return DRAW_SCORE;
  
  const emptyCells = getEmptyCells(board);
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const cell of emptyCells) {
      const newBoard = makeMove(board, cell, aiPlayer);
      const score = minimax(newBoard, depth + 1, alpha, beta, false, aiPlayer);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const cell of emptyCells) {
      const newBoard = makeMove(board, cell, opponent);
      const score = minimax(newBoard, depth + 1, alpha, beta, true, aiPlayer);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}

/**
 * Algorithm 3: Medium - Shallow minimax (depth 3)
 * Looks 3 moves ahead with small randomness
 */
function minimaxShallow(board: Board, player: Player): Position | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  
  const moves: { position: Position; score: number }[] = [];
  
  for (const cell of emptyCells) {
    const newBoard = makeMove(board, cell, player);
    const score = minimax(newBoard, 0, -Infinity, Infinity, false, player);
    moves.push({ position: cell, score });
  }
  
  // Sort by score descending
  moves.sort((a, b) => b.score - a.score);
  
  // Add small randomness - pick from top 2 moves sometimes
  if (moves.length > 1 && Math.random() < 0.3) {
    return moves[1].position;
  }
  
  return moves[0].position;
}

/**
 * Algorithm 4: Hard - Full minimax (unbeatable)
 */
function minimaxFull(board: Board, player: Player): Position | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  
  // If first move, take center or corner
  if (emptyCells.length === 9) {
    if (board[1][1] === null) return { row: 1, col: 1 };
    const corners = [
      { row: 0, col: 0 }, { row: 0, col: 2 },
      { row: 2, col: 0 }, { row: 2, col: 2 }
    ];
    return corners[Math.floor(Math.random() * corners.length)];
  }
  
  const moves: { position: Position; score: number }[] = [];
  
  for (const cell of emptyCells) {
    const newBoard = makeMove(board, cell, player);
    const score = minimax(newBoard, 0, -Infinity, Infinity, false, player);
    moves.push({ position: cell, score });
  }
  
  // Sort by score descending
  moves.sort((a, b) => b.score - a.score);
  
  return moves[0].position;
}

/**
 * Algorithm 5: Expert - Minimax with 10% mistake chance
 * Perfect AI but occasionally makes mistakes
 */
function minimaxWithMistake(board: Board, player: Player): Position | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  
  // If first move, take center or corner
  if (emptyCells.length === 9) {
    if (board[1][1] === null) return { row: 1, col: 1 };
    const corners = [
      { row: 0, col: 0 }, { row: 0, col: 2 },
      { row: 2, col: 0 }, { row: 2, col: 2 }
    ];
    return corners[Math.floor(Math.random() * corners.length)];
  }
  
  const moves: { position: Position; score: number }[] = [];
  
  for (const cell of emptyCells) {
    const newBoard = makeMove(board, cell, player);
    const score = minimax(newBoard, 0, -Infinity, Infinity, false, player);
    moves.push({ position: cell, score });
  }
  
  // Sort by score descending
  moves.sort((a, b) => b.score - a.score);
  
  // 10% chance to make a mistake (pick 2nd or 3rd best)
  if (moves.length > 1 && Math.random() < 0.1) {
    const mistakeIndex = Math.min(1, moves.length - 1);
    return moves[mistakeIndex].position;
  }
  
  return moves[0].position;
}

/**
 * Main function to get AI move based on difficulty
 */
export function getAIMove(board: Board, difficulty: Difficulty, player: Player): AIMoveResult {
  let position: Position | null;
  let algorithm: string;
  
  switch (difficulty) {
    case 'beginner':
      position = randomMove(board, player);
      algorithm = 'random';
      break;
    case 'easy':
      position = blockOrWinMove(board, player);
      algorithm = 'block-win';
      break;
    case 'medium':
      position = minimaxShallow(board, player);
      algorithm = 'minimax-3';
      break;
    case 'hard':
      position = minimaxFull(board, player);
      algorithm = 'minimax-full';
      break;
    case 'expert':
      position = minimaxWithMistake(board, player);
      algorithm = 'minimax-mistake';
      break;
    default:
      position = minimaxShallow(board, player);
      algorithm = 'minimax-3';
  }
  
  return {
    position: position ?? { row: -1, col: -1 },
    algorithm,
  };
}

// Export individual algorithms for testing
export { 
  randomMove, 
  blockOrWinMove, 
  minimaxShallow, 
  minimaxFull, 
  minimaxWithMistake 
};
