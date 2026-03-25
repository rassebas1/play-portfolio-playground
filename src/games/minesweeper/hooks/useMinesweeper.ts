import { useReducer, useEffect, useCallback } from 'react';
import type { GameState, GameAction, Difficulty, Cell } from '@/games/minesweeper/types';
import { DIFFICULTY_CONFIG, INITIAL_DIFFICULTY } from '@/games/minesweeper/constants';

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

const placeMines = (board: Cell[][], mines: number, safeRow: number, safeCol: number): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const rows = newBoard.length;
  const cols = newBoard[0].length;
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

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const key = `${r},${c}`;
    
    if (!safeCells.has(key) && newBoard[r][c].value !== 'mine') {
      newBoard[r][c].value = 'mine';
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].value !== 'mine') {
        let adjacentMines = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].value === 'mine') {
              adjacentMines++;
            }
          }
        }
        newBoard[r][c].value = adjacentMines > 0 ? adjacentMines : 'empty';
      }
    }
  }

  return newBoard;
};

const getInitialState = (difficulty: Difficulty): GameState => {
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
    firstClick: true,
  };
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'INITIALIZE': {
      return getInitialState(action.payload.difficulty);
    }

    case 'REVEAL_CELL': {
      const { row, col } = action.payload;
      const cell = state.board[row][col];
      
      if (cell.isRevealed || cell.isFlagged || state.gameStatus === 'won' || state.gameStatus === 'lost') {
        return state;
      }

      let newBoard = state.board.map(r => r.map(c => ({ ...c })));
      let newRevealedCount = state.revealedCount;
      let newGameStatus: 'idle' | 'playing' | 'won' | 'lost' = state.gameStatus;
      let newFirstClick = state.firstClick;
      let hitMine = false;

      if (state.firstClick) {
        newBoard = placeMines(newBoard, state.config.mines, row, col);
        newFirstClick = false;
        newGameStatus = 'playing';
      }

      const revealCell = (r: number, c: number) => {
        const currentCell = newBoard[r][c];
        if (currentCell.isRevealed || currentCell.isFlagged) return;
        
        currentCell.isRevealed = true;
        currentCell.state = 'revealed';
        newRevealedCount++;

        if (currentCell.value === 'mine') {
          hitMine = true;
          newBoard = newBoard.map(row =>
            row.map(cell => {
              if (cell.value === 'mine' && !cell.isRevealed) {
                return { ...cell, isRevealed: true };
              }
              return cell;
            })
          );
          return;
        }

        if (currentCell.value === 'empty' || currentCell.value === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < newBoard.length && nc >= 0 && nc < newBoard[0].length) {
                revealCell(nr, nc);
              }
            }
          }
        }
      };

      revealCell(row, col);

      if (hitMine) {
        newGameStatus = 'lost';
      } else {
        const totalNonMineCells = state.config.rows * state.config.cols - state.config.mines;
        if (newRevealedCount >= totalNonMineCells) {
          newGameStatus = 'won';
        }
      }

      return {
        ...state,
        board: newBoard,
        gameStatus: newGameStatus,
        revealedCount: newRevealedCount,
        firstClick: newFirstClick,
      };
    }

    case 'TOGGLE_FLAG': {
      const { row, col } = action.payload;
      const cell = state.board[row][col];

      if (cell.isRevealed || state.gameStatus === 'won' || state.gameStatus === 'lost') {
        return state;
      }

      const newBoard = state.board.map(r => r.map(c => ({ ...c })));
      newBoard[row][col].isFlagged = !cell.isFlagged;
      newBoard[row][col].state = newBoard[row][col].isFlagged ? 'flagged' : 'hidden';

      const flagCount = newBoard.flat().filter(c => c.isFlagged).length;

      return {
        ...state,
        board: newBoard,
        flagCount,
      };
    }

    case 'RESTART': {
      return getInitialState(state.difficulty);
    }

    case 'TICK': {
      if (state.gameStatus !== 'playing') return state;
      return {
        ...state,
        elapsedTime: state.elapsedTime + 1,
      };
    }

    case 'SET_DIFFICULTY': {
      return getInitialState(action.payload.difficulty);
    }

    default:
      return state;
  }
};

export const useMinesweeper = () => {
  const [state, dispatch] = useReducer(gameReducer, getInitialState(INITIAL_DIFFICULTY));

  useEffect(() => {
    if (state.gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.gameStatus]);

  const initialize = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'INITIALIZE', payload: { difficulty } });
  }, []);

  const revealCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'REVEAL_CELL', payload: { row, col } });
  }, []);

  const toggleFlag = useCallback((row: number, col: number) => {
    dispatch({ type: 'TOGGLE_FLAG', payload: { row, col } });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: { difficulty } });
  }, []);

  return {
    state,
    initialize,
    revealCell,
    toggleFlag,
    restart,
    setDifficulty,
  };
};