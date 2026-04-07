/**
 * Tests for A* pathfinding utilities.
 * Covers findPath, isPathBlocked, wouldBlockPath, and getPredefinedPath.
 */

import { describe, it, expect } from 'vitest';
import { findPath, isPathBlocked, wouldBlockPath, getPredefinedPath } from './pathfinding';
import { GRID_CONFIG } from '../constants';
import { Cell } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function createEmptyGrid(): Cell[][] {
  return Array.from({ length: GRID_CONFIG.rows }, (_, row) =>
    Array.from({ length: GRID_CONFIG.cols }, (_, col) => {
      const isPath = GRID_CONFIG.path.some((p) => p.row === row && p.col === col);
      const isSpawn = GRID_CONFIG.spawnPoint.row === row && GRID_CONFIG.spawnPoint.col === col;
      const isBase = GRID_CONFIG.basePoint.row === row && GRID_CONFIG.basePoint.col === col;
      let type: Cell['type'] = 'empty';
      if (isSpawn) type = 'spawn';
      else if (isBase) type = 'base';
      else if (isPath) type = 'path';
      return { row, col, type };
    })
  );
}

function placeTower(grid: Cell[][], row: number, col: number): Cell[][] {
  const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
  newGrid[row][col] = { ...newGrid[row][col], type: 'tower' as const, towerId: 'test-tower' };
  return newGrid;
}

// ─── findPath() ─────────────────────────────────────────────────────────────

describe('findPath()', () => {
  it('finds a path between spawn and base on an empty grid', () => {
    const grid = createEmptyGrid();
    const path = findPath(GRID_CONFIG.spawnPoint, GRID_CONFIG.basePoint, grid);

    expect(path).not.toBeNull();
    expect(path!.length).toBeGreaterThan(0);
    expect(path![0]).toEqual(GRID_CONFIG.spawnPoint);
    expect(path![path!.length - 1]).toEqual(GRID_CONFIG.basePoint);
  });

  it('finds a path between two arbitrary points', () => {
    const grid = createEmptyGrid();
    const path = findPath({ row: 0, col: 0 }, { row: 0, col: 5 }, grid);

    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path![path!.length - 1]).toEqual({ row: 0, col: 5 });
  });

  it('returns null when path is completely blocked', () => {
    const grid = createEmptyGrid();
    // Block an entire column to prevent any path
    const blockedGrid = grid.map((r) => r.map((c) => ({ ...c })));
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      blockedGrid[row][6] = { ...blockedGrid[row][6], type: 'tower' as const, towerId: `block-${row}` };
    }

    const path = findPath(GRID_CONFIG.spawnPoint, GRID_CONFIG.basePoint, blockedGrid);
    expect(path).toBeNull();
  });

  it('finds a path that avoids tower cells', () => {
    const grid = createEmptyGrid();
    // Place a single tower on a non-critical empty cell
    const gridWithTower = placeTower(grid, 0, 1);
    const path = findPath({ row: 0, col: 0 }, { row: 0, col: 5 }, gridWithTower);

    expect(path).not.toBeNull();
    // Path should not go through the tower
    for (const step of path!) {
      const cell = gridWithTower[step.row][step.col];
      expect(cell.type).not.toBe('tower');
    }
  });

  it('returns a path with adjacent steps (no teleportation)', () => {
    const grid = createEmptyGrid();
    const path = findPath({ row: 0, col: 0 }, { row: 3, col: 3 }, grid);

    expect(path).not.toBeNull();
    for (let i = 1; i < path!.length; i++) {
      const prev = path![i - 1];
      const curr = path![i];
      const dist = Math.abs(curr.row - prev.row) + Math.abs(curr.col - prev.col);
      expect(dist).toBe(1); // Manhattan distance of 1 = adjacent
    }
  });
});

// ─── isPathBlocked() ────────────────────────────────────────────────────────

describe('isPathBlocked()', () => {
  it('returns false on an empty grid', () => {
    const grid = createEmptyGrid();
    expect(isPathBlocked(grid)).toBe(false);
  });

  it('returns true when a complete wall of towers blocks the path', () => {
    const grid = createEmptyGrid();
    const blockedGrid = grid.map((r) => r.map((c) => ({ ...c })));
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      blockedGrid[row][3] = { ...blockedGrid[row][3], type: 'tower' as const, towerId: `wall-${row}` };
    }

    expect(isPathBlocked(blockedGrid)).toBe(true);
  });

  it('returns false when towers exist but path is still open', () => {
    const grid = createEmptyGrid();
    // Place a few towers that don't block the path
    const gridWithTowers = placeTower(grid, 0, 0);
    const gridWithMoreTowers = placeTower(gridWithTowers, 0, 1);

    expect(isPathBlocked(gridWithMoreTowers)).toBe(false);
  });
});

// ─── wouldBlockPath() ───────────────────────────────────────────────────────

describe('wouldBlockPath()', () => {
  it('returns false for placement that does not block the path', () => {
    const grid = createEmptyGrid();
    // Placing a tower on a corner shouldn't block the path
    expect(wouldBlockPath(grid, 0, 0)).toBe(false);
  });

  it('returns true for placement that would create a complete wall', () => {
    const grid = createEmptyGrid();
    // Build a partial wall leaving one gap
    const gridWithWall = grid.map((r) => r.map((c) => ({ ...c })));
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      if (row !== 4) {
        // Leave row 4 open
        gridWithWall[row][6] = { ...gridWithWall[row][6], type: 'tower' as const, towerId: `wall-${row}` };
      }
    }

    // Placing a tower at row 4, col 6 would complete the wall
    expect(wouldBlockPath(gridWithWall, 4, 6)).toBe(true);
  });

  it('does not modify the original grid', () => {
    const grid = createEmptyGrid();
    const originalCell = { ...grid[0][0] };

    wouldBlockPath(grid, 0, 0);

    expect(grid[0][0]).toEqual(originalCell);
  });
});

// ─── getPredefinedPath() ────────────────────────────────────────────────────

describe('getPredefinedPath()', () => {
  it('returns the path from constants', () => {
    const path = getPredefinedPath();
    expect(path).toEqual(GRID_CONFIG.path);
  });

  it('returns a copy, not the original array', () => {
    const path = getPredefinedPath();
    expect(path).not.toBe(GRID_CONFIG.path); // different reference
  });

  it('returns a path starting at spawn point', () => {
    const path = getPredefinedPath();
    expect(path[0]).toEqual(GRID_CONFIG.spawnPoint);
  });

  it('returns a path ending at base point', () => {
    const path = getPredefinedPath();
    expect(path[path.length - 1]).toEqual(GRID_CONFIG.basePoint);
  });

  it('returns a path with more than one waypoint', () => {
    const path = getPredefinedPath();
    expect(path.length).toBeGreaterThan(1);
  });
});
