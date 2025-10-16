import type { Board, Direction, MoveResult, Tile } from '../types';
import { createEmptyBoard, getEmptyPositions } from './boardUtils';
import { moveAndMergeLine } from './lineProcessor';

/**
 * Processes a move for the entire board in a given direction.
 */
export const processMove = (board: Board, direction: Direction): MoveResult => {
  const initialTiles = new Map<string, Tile>();
  board.forEach((row) => {
    row.forEach((tile) => {
      if (tile) {
        initialTiles.set(tile.id, tile);
      }
    });
  });

  const newBoard = createEmptyBoard();
  let totalScore = 0;
  let hasWon = false;
  let moved = false;
  const animatedTiles: Tile[] = [];

  const processLine = (line: (Tile | null)[], index: number, isVertical: boolean) => {
    const { newLine, score } = moveAndMergeLine(line);
    totalScore += score;

    const processedTileIds = new Set<string>(); // To track tiles that are in newLine

    for (let i = 0; i < 4; i++) {
      if (newLine[i]) {
        const tileId = newLine[i]!.id;
        processedTileIds.add(tileId);

        const initialTile = initialTiles.get(tileId);
        const previousPosition = initialTile ? { row: initialTile.row, col: initialTile.col } : undefined;

        const currentTileRow = isVertical ? i : index;
        const currentTileCol = isVertical ? index : i;
        const hasMoved = previousPosition && (previousPosition.row !== currentTileRow || previousPosition.col !== currentTileCol);
        const finalPreviousPosition = hasMoved ? previousPosition : undefined;

        const tileToAdd: Tile = { ...newLine[i]!, row: currentTileRow, col: currentTileCol, previousPosition: finalPreviousPosition, isNew: false };
        newBoard[currentTileRow][currentTileCol] = tileToAdd;
        animatedTiles.push(tileToAdd);
      }
    }

    // Identify removed tiles from the original 'line'
    line.forEach(originalTile => {
      if (originalTile && !processedTileIds.has(originalTile.id)) {
        // This tile was in the original line but is not in the new line, so it was removed (merged or moved off)
        animatedTiles.push({
          ...originalTile,
          isRemoved: true,
          previousPosition: { row: originalTile.row, col: originalTile.col }, // Its original position
          row: originalTile.row, // Keep its original row/col for animation start
          col: originalTile.col,
        });
      }
    });

    // Check if the line actually moved or merged
      // The 'moved' flag will be determined globally at the end of processMove
  };

  if (direction === 'left') {
    for (let i = 0; i < 4; i++) {
      processLine(board[i], i, false);
    }
  } else if (direction === 'right') {
    for (let i = 0; i < 4; i++) {
      const reversedLine = [...board[i]].reverse();
      const { newLine, score } = moveAndMergeLine(reversedLine);
      totalScore += score;
      // Instead of reversing newLine, map it directly to the correct positions
      for (let j = 0; j < 4; j++) {
        if (newLine[j]) {
          const tileId = newLine[j]!.id;
          const initialTile = initialTiles.get(tileId);
          const previousPosition = initialTile ? { row: initialTile.row, col: initialTile.col } : undefined;

          const currentTileRow = i;
          const currentTileCol = 3 - j; // Map back to original column index
          const hasMoved = previousPosition && (previousPosition.row !== currentTileRow || previousPosition.col !== currentTileCol);
          const finalPreviousPosition = hasMoved ? previousPosition : undefined;

          const tileToAdd: Tile = { ...newLine[j]!, row: currentTileRow, col: currentTileCol, previousPosition: finalPreviousPosition, isNew: false };
          newBoard[currentTileRow][currentTileCol] = tileToAdd;
          animatedTiles.push(tileToAdd);
        }
      }

      // Identify removed tiles from the original 'reversedLine'
      const processedTileIds = new Set<string>();
      newLine.forEach(tile => { if (tile) processedTileIds.add(tile.id); });

      board[i].forEach(originalTile => {
        if (originalTile && !processedTileIds.has(originalTile.id)) {
          animatedTiles.push({
            ...originalTile,
            isRemoved: true,
            previousPosition: { row: originalTile.row, col: originalTile.col },
            row: originalTile.row,
            col: originalTile.col,
          });
        }
      });
    }
  } else if (direction === 'up') {
    for (let i = 0; i < 4; i++) {
      const column = [board[0][i], board[1][i], board[2][i], board[3][i]];
      processLine(column, i, true);
    }
  } else if (direction === 'down') {
    for (let i = 0; i < 4; i++) {
      const column = [board[0][i], board[1][i], board[2][i], board[3][i]];
      const reversedColumn = [...column].reverse();
      const { newLine, score } = moveAndMergeLine(reversedColumn);
      totalScore += score;
      // Instead of reversing newLine, map it directly to the correct positions
      for (let j = 0; j < 4; j++) {
        if (newLine[j]) {
          const tileId = newLine[j]!.id;
          const initialTile = initialTiles.get(tileId);
          const previousPosition = initialTile ? { row: initialTile.row, col: initialTile.col } : undefined;

          const currentTileRow = 3 - j; // Map back to original row index
          const currentTileCol = i;
          const hasMoved = previousPosition && (previousPosition.row !== currentTileRow || previousPosition.col !== currentTileCol);
          const finalPreviousPosition = hasMoved ? previousPosition : undefined;

          const tileToAdd: Tile = { ...newLine[j]!, row: currentTileRow, col: currentTileCol, previousPosition: finalPreviousPosition, isNew: false };
          newBoard[currentTileRow][currentTileCol] = tileToAdd;
          animatedTiles.push(tileToAdd);
        }
      }

      // Identify removed tiles from the original 'column'
      const processedTileIds = new Set<string>();
      newLine.forEach(tile => { if (tile) processedTileIds.add(tile.id); });

      column.forEach(originalTile => {
        if (originalTile && !processedTileIds.has(originalTile.id)) {
          animatedTiles.push({
            ...originalTile,
            isRemoved: true,
            previousPosition: { row: originalTile.row, col: originalTile.col },
            row: originalTile.row,
            col: originalTile.col,
          });
        }
      });
    }
  }

  // Determine if any tile actually moved
  moved = animatedTiles.some(tile => 
    (tile.previousPosition && 
    (tile.previousPosition.row !== tile.row || tile.previousPosition.col !== tile.col)) || tile.isMerged
  );

  hasWon = newBoard.flat().some(tile => tile?.value === 2048);

  return { board: newBoard, score: totalScore, moved, hasWon, animatedTiles };
};