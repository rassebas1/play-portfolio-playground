import type { Tile } from './types';

/**
 * Moves and merges tiles in a single row/column.
 * This is the core logic of the 2048 game.
 */
export const moveAndMergeLine = (line: (Tile | null)[]): { newLine: (Tile | null)[]; score: number } => {
  const filtered = line.filter(tile => tile !== null) as Tile[];
  let score = 0;
  const mergedLine: Tile[] = [];

  for (let i = 0; i < filtered.length; i++) {
    const current = filtered[i];
    const next = filtered[i + 1];

    if (current && next && current.value === next.value) {
      const { row, col, ...rest } = current; // Destructure to omit row and col
      const mergedTile: Tile = {
        ...rest,
        value: current.value * 2,
        isMerged: true,
      };
      mergedLine.push(mergedTile);
      score += mergedTile.value;
      i++; // Skip the next tile as it has been merged
    } else if (current) {
      mergedLine.push(current);
    }
  }

  const newLine: (Tile | null)[] = Array(4).fill(null);
  for (let i = 0; i < mergedLine.length; i++) {
    newLine[i] = mergedLine[i];
  }

  return { newLine, score };
};