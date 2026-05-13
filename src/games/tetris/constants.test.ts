import { describe, it, expect } from 'vitest';
import {
  BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES, TETROMINO_KEYS,
  getSpeedForLevel, MAX_LEVEL, LINES_PER_LEVEL,
  SCORING, EMPTY_CELL, getTetrominoColor,
} from './constants';

describe('tetris constants', () => {
  it('board dimensions are 10x20', () => {
    expect(BOARD_WIDTH).toBe(10);
    expect(BOARD_HEIGHT).toBe(20);
  });

  it('has all 7 tetromino types', () => {
    expect(TETROMINO_KEYS).toEqual(['I', 'O', 'T', 'S', 'Z', 'J', 'L']);
  });

  it('each tetromino has a shape matrix and color', () => {
    for (const key of TETROMINO_KEYS) {
      expect(TETROMINOES[key].shape.length).toBeGreaterThan(0);
      expect(TETROMINOES[key].color).toBeTruthy();
    }
  });

  it('getTetrominoColor returns correct color', () => {
    expect(getTetrominoColor('I')).toBe(TETROMINOES.I.color);
    expect(getTetrominoColor('O')).toBe(TETROMINOES.O.color);
  });

  it('getSpeedForLevel returns base speed at level 1', () => {
    expect(getSpeedForLevel(1)).toBe(1000);
  });

  it('getSpeedForLevel decreases with level', () => {
    const l1 = getSpeedForLevel(1);
    const l5 = getSpeedForLevel(5);
    expect(l5).toBeLessThan(l1);
  });

  it('getSpeedForLevel floors at 50ms', () => {
    expect(getSpeedForLevel(MAX_LEVEL)).toBeGreaterThanOrEqual(50);
  });

  it('scoring values are positive', () => {
    expect(SCORING.single).toBeGreaterThan(0);
    expect(SCORING.tetris).toBeGreaterThan(SCORING.single);
  });

  it('LINES_PER_LEVEL is 10', () => {
    expect(LINES_PER_LEVEL).toBe(10);
  });

  it('EMPTY_CELL is 0', () => {
    expect(EMPTY_CELL).toBe(0);
  });
});
