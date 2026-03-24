/**
 * Tetris Game Reducer
 * State management using useReducer pattern
 */

import {
  TetrisState,
  TetrisAction,
  Piece,
} from './types';
import {
  createEmptyBoard,
  createPiece,
  getRandomTetromino,
  movePiece,
  rotatePiece,
  lockPiece,
  clearLines,
  calculateScore,
  checkGameOver,
  getGhostPosition,
  calculateLevel,
} from './gameLogic';
import { LINES_PER_LEVEL, TetrominoType } from './constants';

// Initial state factory
export const createInitialState = (): TetrisState => ({
  board: createEmptyBoard(),
  currentPiece: null,
  nextPiece: null,
  holdPiece: null,
  canHold: true,
  score: 0,
  level: 1,
  lines: 0,
  status: 'idle',
  clearedLines: [],
  ghostPosition: null,
});

// Reducer function
export const tetrisReducer = (
  state: TetrisState,
  action: TetrisAction
): TetrisState => {
  switch (action.type) {
    case 'NEW_GAME': {
      const firstPiece = createPiece(getRandomTetromino());
      const nextPieceType = getRandomTetromino();
      
      // Check if game over immediately (unlikely but possible)
      if (checkGameOver(firstPiece, state.board)) {
        return {
          ...createInitialState(),
          status: 'game_over',
        };
      }

      return {
        ...createInitialState(),
        currentPiece: firstPiece,
        nextPiece: nextPieceType,
        status: 'playing',
        ghostPosition: getGhostPosition(firstPiece, createEmptyBoard()),
      };
    }

    case 'PAUSE_GAME':
      if (state.status !== 'playing') return state;
      return { ...state, status: 'paused' };

    case 'RESUME_GAME':
      if (state.status !== 'paused') return state;
      return { ...state, status: 'playing' };

    case 'MOVE_LEFT': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      
      const movedLeft = movePiece(state.currentPiece, state.board, 'left');
      if (!movedLeft) return state;

      return {
        ...state,
        currentPiece: movedLeft,
        ghostPosition: getGhostPosition(movedLeft, state.board),
      };
    }

    case 'MOVE_RIGHT': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      
      const movedRight = movePiece(state.currentPiece, state.board, 'right');
      if (!movedRight) return state;

      return {
        ...state,
        currentPiece: movedRight,
        ghostPosition: getGhostPosition(movedRight, state.board),
      };
    }

    case 'MOVE_DOWN': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      
      const movedDown = movePiece(state.currentPiece, state.board, 'down');
      if (!movedDown) {
        // Piece can't move down - lock it
        const newBoard = lockPiece(state.currentPiece, state.board);
        const { newBoard: clearedBoard, clearedLines } = clearLines(newBoard);
        
        // Calculate score
        const linesCleared = clearedLines.length;
        const scoreGain = calculateScore(linesCleared, state.level);
        const newLines = state.lines + linesCleared;
        const newLevel = calculateLevel(newLines, LINES_PER_LEVEL);

        // Spawn next piece
        const nextPieceType = state.nextPiece || getRandomTetromino();
        const newPiece = createPiece(nextPieceType);
        const upcomingPiece = getRandomTetromino();

        // Check game over
        if (checkGameOver(newPiece, clearedBoard)) {
          return {
            ...state,
            board: clearedBoard,
            currentPiece: null,
            status: 'game_over',
            clearedLines,
            score: state.score + scoreGain,
            lines: newLines,
            level: newLevel,
          };
        }

        return {
          ...state,
          board: clearedBoard,
          currentPiece: newPiece,
          nextPiece: upcomingPiece,
          holdPiece: state.holdPiece,
          canHold: state.canHold,
          score: state.score + scoreGain,
          lines: newLines,
          level: newLevel,
          status: 'playing',
          clearedLines,
          ghostPosition: getGhostPosition(newPiece, clearedBoard),
        };
      }

      return {
        ...state,
        currentPiece: movedDown,
        ghostPosition: getGhostPosition(movedDown, state.board),
      };
    }

    case 'ROTATE': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      
      const rotated = rotatePiece(state.currentPiece, state.board, action.direction);
      if (!rotated) return state;

      return {
        ...state,
        currentPiece: rotated,
        ghostPosition: getGhostPosition(rotated, state.board),
      };
    }

    case 'HARD_DROP': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      
      // Drop piece to lowest possible position
      let droppedPiece = state.currentPiece;
      let dropDistance = 0;
      
      while (true) {
        const moved = movePiece(droppedPiece, state.board, 'down');
        if (!moved) break;
        droppedPiece = moved;
        dropDistance++;
      }

      // Lock the piece
      const newBoard = lockPiece(droppedPiece, state.board);
      const { newBoard: clearedBoard, clearedLines } = clearLines(newBoard);
      
      const scoreGain = dropDistance * 2; // 2 points per cell dropped
      const linesCleared = clearedLines.length;
      const lineScore = calculateScore(linesCleared, state.level);
      const newLines = state.lines + linesCleared;
      const newLevel = calculateLevel(newLines, LINES_PER_LEVEL);

      // Spawn next piece
      const nextPieceType = state.nextPiece || getRandomTetromino();
      const newPiece = createPiece(nextPieceType);
      const upcomingPiece = getRandomTetromino();

      if (checkGameOver(newPiece, clearedBoard)) {
        return {
          ...state,
          board: clearedBoard,
          currentPiece: null,
          status: 'game_over',
          clearedLines,
          score: state.score + scoreGain + lineScore,
          lines: newLines,
          level: newLevel,
        };
      }

      return {
        ...state,
        board: clearedBoard,
        currentPiece: newPiece,
        nextPiece: upcomingPiece,
        holdPiece: state.holdPiece,
        canHold: state.canHold,
        score: state.score + scoreGain + lineScore,
        lines: newLines,
        level: newLevel,
        status: 'playing',
        clearedLines,
        ghostPosition: getGhostPosition(newPiece, clearedBoard),
      };
    }

    case 'SOFT_DROP': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      
      const movedDown = movePiece(state.currentPiece, state.board, 'down');
      if (!movedDown) return state;

      return {
        ...state,
        currentPiece: movedDown,
        score: state.score + 1, // 1 point per soft drop
        ghostPosition: getGhostPosition(movedDown, state.board),
      };
    }

    case 'HOLD_PIECE': {
      if (state.status !== 'playing' || !state.currentPiece || !state.canHold) {
        return state;
      }

      const currentType = state.currentPiece.type;
      let newHoldPiece: TetrominoType;
      let newCurrentPiece: Piece;

      if (state.holdPiece) {
        // Swap with hold piece
        newHoldPiece = currentType;
        newCurrentPiece = createPiece(state.holdPiece);
      } else {
        // First hold - use next piece
        newHoldPiece = currentType;
        const nextPieceType = state.nextPiece || getRandomTetromino();
        newCurrentPiece = createPiece(nextPieceType);
      }

      // Spawn upcoming piece if we didn't use next
      if (!state.holdPiece) {
        return {
          ...state,
          holdPiece: newHoldPiece,
          canHold: false,
          currentPiece: newCurrentPiece,
          nextPiece: getRandomTetromino(),
          ghostPosition: getGhostPosition(newCurrentPiece, state.board),
        };
      }

      return {
        ...state,
        holdPiece: newHoldPiece,
        canHold: false,
        currentPiece: newCurrentPiece,
        ghostPosition: getGhostPosition(newCurrentPiece, state.board),
      };
    }

    case 'TICK': {
      // Same as MOVE_DOWN but for automatic game loop
      if (state.status !== 'playing' || !state.currentPiece) return state;
      
      const movedDown = movePiece(state.currentPiece, state.board, 'down');
      if (!movedDown) {
        // Lock piece
        const newBoard = lockPiece(state.currentPiece, state.board);
        const { newBoard: clearedBoard, clearedLines } = clearLines(newBoard);
        
        const linesCleared = clearedLines.length;
        const scoreGain = calculateScore(linesCleared, state.level);
        const newLines = state.lines + linesCleared;
        const newLevel = calculateLevel(newLines, LINES_PER_LEVEL);

        const nextPieceType = state.nextPiece || getRandomTetromino();
        const newPiece = createPiece(nextPieceType);
        const upcomingPiece = getRandomTetromino();

        if (checkGameOver(newPiece, clearedBoard)) {
          return {
            ...state,
            board: clearedBoard,
            currentPiece: null,
            status: 'game_over',
            clearedLines,
            score: state.score + scoreGain,
            lines: newLines,
            level: newLevel,
          };
        }

        return {
          ...state,
          board: clearedBoard,
          currentPiece: newPiece,
          nextPiece: upcomingPiece,
          holdPiece: state.holdPiece,
          canHold: state.canHold,
          score: state.score + scoreGain,
          lines: newLines,
          level: newLevel,
          status: 'playing',
          clearedLines,
          ghostPosition: getGhostPosition(newPiece, clearedBoard),
        };
      }

      return {
        ...state,
        currentPiece: movedDown,
        ghostPosition: getGhostPosition(movedDown, state.board),
      };
    }

    case 'LINE_CLEAR': {
      // Used for animation purposes - clears the clearedLines array
      return {
        ...state,
        clearedLines: [],
      };
    }

    case 'GAME_OVER':
      return {
        ...state,
        status: 'game_over',
        currentPiece: null,
      };

    default:
      return state;
  }
};
