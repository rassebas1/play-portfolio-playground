/**
 * Pathfinding utilities for Tower Defense
 * 
 * Provides A* pathfinding algorithm for dynamic path recalculation
 * when towers block enemy paths.
 */

import { Cell } from '../types';
import { GRID_CONFIG } from '../constants';

interface Node {
  row: number;
  col: number;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // g + h
  parent: Node | null;
}

/**
 * Manhattan distance heuristic
 */
function heuristic(a: { row: number; col: number }, b: { row: number; col: number }): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Get valid neighbors for a cell
 */
function getNeighbors(
  node: Node,
  grid: Cell[][],
  rows: number,
  cols: number
): Node[] {
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 },  // Right
  ];

  const neighbors: Node[] = [];

  for (const dir of directions) {
    const newRow = node.row + dir.row;
    const newCol = node.col + dir.col;

    // Check bounds
    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;

    // Check if cell is walkable (not a tower)
    const cell = grid[newRow][newCol];
    if (cell.type === 'tower') continue;

    neighbors.push({
      row: newRow,
      col: newCol,
      g: 0,
      h: 0,
      f: 0,
      parent: node,
    });
  }

  return neighbors;
}

/**
 * A* pathfinding algorithm
 * 
 * @param start - Starting position
 * @param end - Destination position
 * @param grid - Game grid with tower positions
 * @returns Array of {row, col} positions forming the path, or null if no path exists
 */
export function findPath(
  start: { row: number; col: number },
  end: { row: number; col: number },
  grid: Cell[][]
): { row: number; col: number }[] | null {
  const rows = GRID_CONFIG.rows;
  const cols = GRID_CONFIG.cols;

  const openSet: Node[] = [];
  const closedSet = new Set<string>();

  const startNode: Node = {
    row: start.row,
    col: start.col,
    g: 0,
    h: heuristic(start, end),
    f: heuristic(start, end),
    parent: null,
  };

  openSet.push(startNode);

  while (openSet.length > 0) {
    // Find node with lowest f score
    let lowestIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    const current = openSet[lowestIndex];

    // Check if we reached the goal
    if (current.row === end.row && current.col === end.col) {
      const path: { row: number; col: number }[] = [];
      let node: Node | null = current;

      while (node) {
        path.unshift({ row: node.row, col: node.col });
        node = node.parent;
      }

      return path;
    }

    // Move current from open to closed
    openSet.splice(lowestIndex, 1);
    closedSet.add(`${current.row},${current.col}`);

    // Check neighbors
    const neighbors = getNeighbors(current, grid, rows, cols);

    for (const neighbor of neighbors) {
      if (closedSet.has(`${neighbor.row},${neighbor.col}`)) continue;

      const tentativeG = current.g + 1;

      const existingIndex = openSet.findIndex(
        (n) => n.row === neighbor.row && n.col === neighbor.col
      );

      if (existingIndex === -1) {
        // New node
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        openSet.push(neighbor);
      } else if (tentativeG < openSet[existingIndex].g) {
        // Better path found
        openSet[existingIndex].g = tentativeG;
        openSet[existingIndex].f = tentativeG + openSet[existingIndex].h;
        openSet[existingIndex].parent = current;
      }
    }
  }

  // No path found
  return null;
}

/**
 * Check if a path exists from spawn to base
 */
export function isPathBlocked(grid: Cell[][]): boolean {
  const path = findPath(GRID_CONFIG.spawnPoint, GRID_CONFIG.basePoint, grid);
  return path === null;
}

/**
 * Check if placing a tower at a position would block the path
 */
export function wouldBlockPath(
  grid: Cell[][],
  row: number,
  col: number
): boolean {
  // Temporarily place tower
  const testGrid = grid.map((r) => r.map((c) => ({ ...c })));
  testGrid[row][col] = { ...testGrid[row][col], type: 'tower' };

  return isPathBlocked(testGrid);
}

/**
 * Get the predefined path from constants
 * Used when no towers block the path
 */
export function getPredefinedPath(): { row: number; col: number }[] {
  return [...GRID_CONFIG.path];
}
