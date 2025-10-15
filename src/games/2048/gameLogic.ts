import type { Board, Direction, MoveResult, Tile, TileAnimation } from './types';

/**
 * Creates an empty 4x4 board, where each cell is initially null.
 */
export const createEmptyBoard = (): Board => {
  return Array(4).fill(null).map(() => Array(4).fill(null));
};

/**
 * Gets all empty positions (cells with null value) on the board.
 */
export const getEmptyPositions = (board: Board): Array<{ row: number; col: number }> => {
  const empty: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === null) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
};

/**
 * Adds a random tile (2 or 4) to an empty position on the board.
 */
export const addRandomTile = (board: Board): Board => {
  const emptyPositions = getEmptyPositions(board);
  if (emptyPositions.length === 0) return board;

  const newBoard = board.map(row => [...row]);
  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const value = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% for 4
  
  newBoard[randomPosition.row][randomPosition.col] = {
    id: `${randomPosition.row}-${randomPosition.col}-${Date.now()}`,
    value,
    row: randomPosition.row,
    col: randomPosition.col,
    isNew: true,
  };
  return newBoard;
};

/**
 * Initializes the game board with two random tiles
 */
export const initializeBoard = (): Board => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

/**
 * Moves and merges tiles in a single row/column.
 * This function is the core of the game logic, handling the sliding and merging of tiles.
 */
export const moveAndMergeArray = (arr: (Tile | null)[]): { newArray: (Tile | null)[]; scoreGained: number; moved: boolean } => {
  let moved = false;
  let scoreGained = 0;

  // 1. Filter out nulls (empty cells) to compact the array.
  const filtered: Tile[] = arr.filter((val): val is Tile => val !== null);
  const newArr: (Tile | null)[] = [];

  for (let i = 0; i < filtered.length; i++) {
    const currentTile = { ...filtered[i] };
    // Check for merging with the next tile
    if (i < filtered.length - 1 && filtered[i].value === filtered[i + 1].value) {
      currentTile.value *= 2;
      scoreGained += currentTile.value;
      currentTile.isMerged = true;
      currentTile.mergedFrom = [filtered[i].id, filtered[i + 1].id];
      i++; // Skip the next tile as it has been merged
      moved = true;
    }
    newArr.push(currentTile);
  }

  // Pad with nulls to maintain the array length of 4.
  while (newArr.length < 4) {
    newArr.push(null);
  }

  // Check if the new array is different from the original array
  if (JSON.stringify(arr.map(t => t?.value)) !== JSON.stringify(newArr.map(t => t?.value))) {
    moved = true;
  }

  return { newArray: newArr, scoreGained, moved };
};

/**
 * Processes a move in the specified direction by applying the moveAndMergeArray logic to each row or column.
 */
export const processMove = (board: Board, direction: Direction): MoveResult => {
  let newBoard: Board = board.map(row => row.map(tile => tile ? { ...tile } : null));
  let totalScore = 0;
  let moved = false;
  let hasWon = false;
  const animations: TileAnimation[] = [];

  // Deep copy the board to capture previous positions for animations
  const oldBoard: Board = board.map(row => row.map(tile => tile ? { ...tile } : null));

  if (direction === 'left') {
    for (let row = 0; row < 4; row++) {
      const { newArray, scoreGained, moved: rowMoved } = moveAndMergeArray(newBoard[row]);
      if (rowMoved) moved = true;
      newBoard[row] = newArray;
      totalScore += scoreGained;
      
      if (newArray.some(tile => tile?.value === 2048)) {
        hasWon = true;
      }
    }
  } else if (direction === 'right') {
    for (let row = 0; row < 4; row++) {
      const reversed = [...newBoard[row]].reverse();
      const { newArray, scoreGained, moved: rowMoved } = moveAndMergeArray(reversed);
      const finalArray = newArray.reverse();
      if (rowMoved) moved = true;
      newBoard[row] = finalArray;
      totalScore += scoreGained;
      
      if (finalArray.some(tile => tile?.value === 2048)) {
        hasWon = true;
      }
    }
  } else if (direction === 'up') {
    for (let col = 0; col < 4; col++) {
      const column = [newBoard[0][col], newBoard[1][col], newBoard[2][col], newBoard[3][col]];
      const { newArray, scoreGained, moved: colMoved } = moveAndMergeArray(column);
      if (colMoved) moved = true;
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = newArray[row];
      }
      totalScore += scoreGained;
      
      if (newArray.some(tile => tile?.value === 2048)) {
        hasWon = true;
      }
    }
  } else if (direction === 'down') {
    for (let col = 0; col < 4; col++) {
      const column = [newBoard[0][col], newBoard[1][col], newBoard[2][col], newBoard[3][col]];
      const reversed = [...column].reverse();
      const { newArray, scoreGained, moved: colMoved } = moveAndMergeArray(reversed);
      const finalArray = newArray.reverse();
      if (colMoved) moved = true;
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = finalArray[row];
      }
      totalScore += scoreGained;
      
      if (finalArray.some(tile => tile?.value === 2048)) {
        hasWon = true;
      }
    }
  }

  // Update row and col properties for all tiles on the new board
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = newBoard[r][c];
      if (tile) {
        tile.row = r;
        tile.col = c;
      }
    }
  }

  // Generate animations after the new board is fully constructed
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const newTile = newBoard[r][c];
      const oldTile = oldBoard[r][c];

      if (newTile && oldTile && (newTile.row !== oldTile.row || newTile.col !== oldTile.col)) {
        animations.push({
          from: { row: oldTile.row, col: oldTile.col },
          to: { row: newTile.row, col: newTile.col },
          value: oldTile.value,
        });
      } else if (newTile && newTile.isMerged && newTile.mergedFrom) {
        newTile.mergedFrom.forEach(mergedId => {
          // Find the original position of the merged tile
          let mergedFromPos: { row: number; col: number } | undefined;
          oldBoard.forEach((oldRow, oldR) => {
            oldRow.forEach((t, oldC) => {
              if (t?.id === mergedId) {
                mergedFromPos = { row: oldR, col: oldC };
              }
            });
          });

          if (mergedFromPos) {
            animations.push({
              from: mergedFromPos,
              to: { row: newTile.row, col: newTile.col },
              value: newTile.value / 2, // Value before merge
              isMerged: true,
            });
          }
        });
      }
    }
  }

  return { board: newBoard, score: totalScore, moved, hasWon, animations };
};

/**
 * Checks if any moves are possible on the board.
 * This is used to determine if the game is over.
 */
export const canMove = (board: Board): boolean => {
  // 1. Check for any empty cells. If there is at least one, a move is possible.
  if (getEmptyPositions(board).length > 0) return true;
  
  // 2. Check for possible merges by comparing adjacent cells.
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const current = board[row][col];
      // Check right neighbor
      if (current !== null && col < 3 && board[row][col + 1] !== null && current.value === board[row][col + 1]?.value) return true;
      // Check bottom neighbor
      if (current !== null && row < 3 && board[row + 1][col] !== null && current.value === board[row + 1][col]?.value) return true;
    }
  }
  
  // 3. If no empty cells and no possible merges, no move is possible.
  return false;
};