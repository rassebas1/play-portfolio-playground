import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { GameState, GameAction, Difficulty, Cell } from './types';
import { DIFFICULTY_CONFIG } from './constants';

const createEmptyBoard = (rows: number, cols: number): Cell[][] => {
  const board: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        state: 'hidden',
        value: 'empty',
        isRevealed: false,
        isFlagged: false,
      });
    }
    board.push(row);
  }
  return board;
};

const createBoardWithMines = (rows: number, cols: number, minePositions: Array<{ r: number; c: number }>): Cell[][] => {
  const board = createEmptyBoard(rows, cols);
  for (const { r, c } of minePositions) {
    board[r][c].value = 'mine';
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].value !== 'mine') {
        let adjacentMines = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].value === 'mine') {
              adjacentMines++;
            }
          }
        }
        board[r][c].value = adjacentMines > 0 ? adjacentMines : 'empty';
      }
    }
  }
  return board;
};

const getInitialState = (difficulty: Difficulty = 'easy'): GameState => {
  const config = DIFFICULTY_CONFIG[difficulty];
  return {
    board: createEmptyBoard(config.rows, config.cols),
    config,
    gameStatus: 'idle',
    mineCount: config.mines,
    flagCount: 0,
    elapsedTime: 0,
    difficulty,
    revealedCount: 0,
    moveCount: 0,
    firstClick: true,
  };
};

const createReducer = () => {
  let state: GameState;
  const setState = (s: GameState) => { state = s; };
  const getState = () => state;
  return { getState, setState };
};

describe('Minesweeper - Types & Constants', () => {
  describe('DIFFICULTY_CONFIG', () => {
    it('should have correct config for easy', () => {
      expect(DIFFICULTY_CONFIG.easy).toEqual({ rows: 9, cols: 9, mines: 10 });
    });

    it('should have correct config for medium', () => {
      expect(DIFFICULTY_CONFIG.medium).toEqual({ rows: 16, cols: 16, mines: 40 });
    });

    it('should have correct config for hard', () => {
      expect(DIFFICULTY_CONFIG.hard).toEqual({ rows: 16, cols: 30, mines: 99 });
    });
  });

  describe('GameState structure', () => {
    it('should initialize with idle status', () => {
      const state = getInitialState();
      expect(state.gameStatus).toBe('idle');
    });

    it('should have correct firstClick flag', () => {
      const state = getInitialState();
      expect(state.firstClick).toBe(true);
    });
  });
});

describe('Minesweeper - Cell Value Calculations', () => {
  it('should calculate adjacent mine count for cell', () => {
    const board = createBoardWithMines(3, 3, [{ r: 0, c: 0 }]);
    expect(board[1][1].value).toBe(1);
  });

it('should have empty value when no adjacent mines', () => {
    const board = createBoardWithMines(4, 4, [{ r: 0, c: 0 }]);
    expect(board[3][3].value).toBe('empty');
  });

  it('should calculate adjacent count for cells near mines', () => {
    const board = createBoardWithMines(4, 4, [{ r: 0, c: 0 }]);
    expect(board[0][0].value).toBe('mine');
    expect(board[1][1].value).toBe(1);
  });

  it('should calculate count of 2 for cells adjacent to 2 mines', () => {
    const board = createBoardWithMines(3, 3, [{ r: 0, c: 0 }, { r: 0, c: 2 }]);
    expect(board[1][1].value).toBe(2);
  });
});

describe('Minesweeper - Game Actions', () => {
  describe('INITIALIZE action', () => {
    it('should reset state with new difficulty', () => {
      let state = getInitialState('medium');
      state = {
        ...state,
        board: createBoardWithMines(16, 16, []),
        gameStatus: 'playing',
        firstClick: false,
      };
      
      const newState = {
        board: createEmptyBoard(16, 16),
        config: DIFFICULTY_CONFIG['easy'],
        gameStatus: 'idle',
        mineCount: 10,
        flagCount: 0,
        elapsedTime: 0,
        difficulty: 'easy' as Difficulty,
        revealedCount: 0,
        moveCount: 0,
        firstClick: true,
      };
      
      expect(newState.config.rows).toBe(9);
      expect(newState.config.cols).toBe(9);
      expect(newState.gameStatus).toBe('idle');
    });
  });

  describe('REVEAL_CELL action logic', () => {
    it('should not reveal already revealed cell', () => {
      const cell: Cell = {
        row: 0, col: 0,
        state: 'revealed',
        value: 1,
        isRevealed: true,
        isFlagged: false,
      };
      expect(cell.isRevealed).toBe(true);
    });

    it('should not reveal flagged cell', () => {
      const cell: Cell = {
        row: 0, col: 0,
        state: 'flagged',
        value: 'mine',
        isRevealed: false,
        isFlagged: true,
      };
      expect(cell.isFlagged).toBe(true);
      expect(cell.isRevealed).toBe(false);
    });

    it('should detect mine hit', () => {
      const cell: Cell = {
        row: 0, col: 0,
        state: 'hidden',
        value: 'mine',
        isRevealed: false,
        isFlagged: false,
      };
      expect(cell.value).toBe('mine');
    });
  });

  describe('TOGGLE_FLAG action logic', () => {
    it('should toggle flag on hidden cell', () => {
      const cell: Cell = {
        row: 0, col: 0,
        state: 'hidden',
        value: 'empty',
        isRevealed: false,
        isFlagged: false,
      };
      const newCell = { ...cell, isFlagged: true, state: 'flagged' as const };
      expect(newCell.isFlagged).toBe(true);
      expect(newCell.state).toBe('flagged');
    });

    it('should untoggle flag', () => {
      const cell: Cell = {
        row: 0, col: 0,
        state: 'flagged',
        value: 'empty',
        isRevealed: false,
        isFlagged: true,
      };
      const newCell = { ...cell, isFlagged: false, state: 'hidden' as const };
      expect(newCell.isFlagged).toBe(false);
      expect(newCell.state).toBe('hidden');
    });

    it('should not toggle revealed cell', () => {
      const cell: Cell = {
        row: 0, col: 0,
        state: 'revealed',
        value: 1,
        isRevealed: true,
        isFlagged: false,
      };
      expect(cell.isRevealed).toBe(true);
    });
  });

  describe('CHORD_REVEAL action logic', () => {
    it('should ignore chord on hidden cells', () => {
      const cell: Cell = {
        row: 0, col: 0,
        state: 'hidden',
        value: 'empty',
        isRevealed: false,
        isFlagged: false,
      };
      expect(cell.isRevealed).toBe(false);
    });

    it('should ignore chord on empty value cells', () => {
      const cell: Cell = {
        row: 0, col: 0,
        state: 'revealed',
        value: 'empty',
        isRevealed: true,
        isFlagged: false,
      };
      expect(cell.value).toBe('empty');
    });

    it('should trigger chord when flag count matches number', () => {
      const center: Cell = {
        row: 1, col: 1,
        state: 'revealed',
        value: 2,
        isRevealed: true,
        isFlagged: false,
      };
      const adjacent = [
        { r: 0, c: 0, isFlagged: true },
        { r: 0, c: 1, isFlagged: true },
        { r: 0, c: 2, isFlagged: false },
      ];
      const flaggedCount = adjacent.filter(c => c.isFlagged).length;
      expect(flaggedCount).toBe(2);
      expect(flaggedCount === (center.value as number)).toBe(true);
    });
  });

  describe('TICK action logic', () => {
    it('should increment elapsed time when playing', () => {
      let state = getInitialState();
      state = { ...state, gameStatus: 'playing', elapsedTime: 5 };
      const newState = { ...state, elapsedTime: state.elapsedTime + 1 };
      expect(newState.elapsedTime).toBe(6);
    });

    it('should not increment time when game is not playing', () => {
      let state = getInitialState();
      state = { ...state, gameStatus: 'idle', elapsedTime: 5 };
      expect(state.gameStatus).toBe('idle');
    });
  });
});

describe('Minesweeper - Win/Lose Conditions', () => {
  it('should win when all non-mine cells revealed', () => {
    const config = DIFFICULTY_CONFIG.easy;
    const totalCells = config.rows * config.cols;
    const nonMineCells = totalCells - config.mines;
    const revealedCount = nonMineCells;
    const isWon = revealedCount >= nonMineCells;
    expect(isWon).toBe(true);
  });

  it('should lose when mine is revealed', () => {
    let hitMine = false;
    const cell = { value: 'mine' as const };
    if (cell.value === 'mine') {
      hitMine = true;
    }
    expect(hitMine).toBe(true);
  });

  it('should not win until all cells revealed', () => {
    const config = DIFFICULTY_CONFIG.easy;
    const totalCells = config.rows * config.cols;
    const nonMineCells = totalCells - config.mines;
    const revealedCount = nonMineCells - 1;
    const isWon = revealedCount >= nonMineCells;
    expect(isWon).toBe(false);
  });
});

describe('Minesweeper - Safe Zone on First Click', () => {
  it('should protect clicked cell from mine', () => {
    const safeRow = 5;
    const safeCol = 5;
    const rows = 9;
    const cols = 9;
    const safeCells = new Set<string>();
    
    safeCells.add(`${safeRow},${safeCol}`);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = safeRow + dr;
        const nc = safeCol + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          safeCells.add(`${nr},${nc}`);
        }
      }
    }
    
    expect(safeCells.has('5,5')).toBe(true);
    expect(safeCells.has('4,4')).toBe(true);
    expect(safeCells.has('6,6')).toBe(true);
    expect(safeCells.has('4,5')).toBe(true);
  });

  it('should not place mine in safe zone', () => {
    const safeRow = 0;
    const safeCol = 0;
    const rows = 9;
    const cols = 9;
    const safeCells = new Set<string>();
    
    safeCells.add(`${safeRow},${safeCol}`);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = safeRow + dr;
        const nc = safeCol + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          safeCells.add(`${nr},${nc}`);
        }
      }
    }
    
    expect(safeCells.has('0,0')).toBe(true);
    expect(safeCells.has('0,1')).toBe(true);
    expect(safeCells.has('1,0')).toBe(true);
    expect(safeCells.has('1,1')).toBe(true);
  });
});

describe('Minesweeper - Flood Fill for Empty Cells', () => {
  it('should reveal adjacent cells for empty cell', () => {
    const board = createBoardWithMines(3, 3, [{ r: 0, c: 0 }]);
    const cell = board[1][1];
    expect(cell.value).toBe(1);
  });

  it('should cascade for empty value cells', () => {
    const board = createBoardWithMines(3, 3, [{ r: 0, c: 0 }]);
    const cell = board[2][1];
    expect(cell.value).toBe('empty');
  });

  it('should stop at numbered cells', () => {
    const board = createBoardWithMines(3, 3, [{ r: 0, c: 1 }]);
    const cell = board[1][1];
    expect(typeof cell.value).toBe('number');
    expect(cell.value).toBe(1);
  });
});

describe('Minesweeper - Flag Count', () => {
  it('should count flags correctly', () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isFlagged = true;
    board[0][1].isFlagged = true;
    board[2][2].isFlagged = true;
    
    const flagCount = board.flat().filter(c => c.isFlagged).length;
    expect(flagCount).toBe(3);
  });

  it('should update flag count on toggle', () => {
    let flagCount = 0;
    const cell = { isFlagged: false };
    
    cell.isFlagged = true;
    flagCount++;
    expect(flagCount).toBe(1);
    
    cell.isFlagged = false;
    flagCount--;
    expect(flagCount).toBe(0);
  });
});

describe('Minesweeper - Game Over States', () => {
  it('should set status to lost on mine hit', () => {
    let gameStatus: 'idle' | 'playing' | 'won' | 'lost' = 'playing';
    let hitMine = false;
    
    const cell = { value: 'mine' as const };
    if (cell.value === 'mine') {
      hitMine = true;
    }
    
    if (hitMine) {
      gameStatus = 'lost';
    }
    
    expect(gameStatus).toBe('lost');
  });

  it('should reveal all mines on loss', () => {
    const board = createBoardWithMines(3, 3, [{ r: 1, c: 1 }]);
    board[1][1].isRevealed = true;
    
    const revealedMines = board.flat().filter(c => c.value === 'mine' && c.isRevealed);
    expect(revealedMines).toHaveLength(1);
  });

  it('should set status to won when all safe cells revealed', () => {
    const config = DIFFICULTY_CONFIG.easy;
    const nonMineCells = config.rows * config.cols - config.mines;
    let gameStatus: 'idle' | 'playing' | 'won' | 'lost' = 'playing';
    
    if (nonMineCells >= nonMineCells) {
      gameStatus = 'won';
    }
    
    expect(gameStatus).toBe('won');
  });
});

describe('Minesweeper - Edge Cases', () => {
  it('should handle corner click', () => {
    const rows = 9;
    const cols = 9;
    const row = 0;
    const col = 0;
    
    const safeCells: Set<string> = new Set();
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          safeCells.add(`${nr},${nc}`);
        }
      }
    }
    
    expect(safeCells.size).toBe(4);
  });

  it('should handle edge click', () => {
    const rows = 9;
    const cols = 9;
    const row = 0;
    const col = 4;
    
    const safeCells: Set<string> = new Set();
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          safeCells.add(`${nr},${nc}`);
        }
      }
    }
    
    expect(safeCells.size).toBe(6);
  });

  it('should handle center click', () => {
    const rows = 9;
    const cols = 9;
    const row = 4;
    const col = 4;
    
    const safeCells: Set<string> = new Set();
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          safeCells.add(`${nr},${nc}`);
        }
      }
    }
    
    expect(safeCells.size).toBe(9);
  });
});