import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { Board, Direction, Tile } from '../types';
import { initializeBoard, isBoardFull } from '../utils/boardUtils';
import { processMove } from '../utils/moveProcessor';
import { canMove } from '../utils/moveProcessor2';
import { addRandomTile } from '../utils/tileUtils';
import { ANIMATION_DURATION } from '../constants';
import { GameReducer, initialState } from '../GameReducer';
import { useIds } from '../useIds';

/**
 * Custom hook for 2048 game logic and state management
 * Handles board state, moves, scoring, and game conditions
 */
export const use2048 = () => {
  const [getNextId] = useIds();
  const [state, dispatch] = useReducer(GameReducer, undefined, () => initializeBoard(getNextId));
  const { tiles, byIds, hasChanged, inMotion, score, highScore, isGameOver, isWon, canUndo } = state;

  const animatedTiles = byIds.map(id => tiles[id]);

  const animationDuration = 100; // Define animation duration

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const generateRandomTile = useCallback(() => {
    const newTile = addRandomTile(stateRef.current.tiles, stateRef.current.byIds, getNextId());
    if (newTile) {
      dispatch({ type: "ADD_TILE", tile: newTile });
    }
  }, [getNextId, dispatch]);

  /**
   * Makes a move in the specified direction
   */
  const makeMove = useCallback((direction: Direction) => {
    if (stateRef.current.isGameOver || (stateRef.current.isWon && !stateRef.current.isGameOver) || stateRef.current.inMotion) return;

    const currentBoard = Array(4).fill(null).map(() => Array(4).fill(null)) as Board;
    stateRef.current.byIds.forEach(id => {
      const tile = stateRef.current.tiles[id];
      currentBoard[tile.row][tile.col] = tile;
    });

    const result = processMove(currentBoard, direction);

    if (!result.moved) return;

    dispatch({ type: "START_MOVE" });

    // Update tiles based on processMove result
    const newTiles = { ...stateRef.current.tiles };
    const newByIds = [...stateRef.current.byIds];

    result.animatedTiles.forEach(animatedTile => {
      if (animatedTile.isRemoved) {
        delete newTiles[animatedTile.id];
        const index = newByIds.indexOf(animatedTile.id);
        if (index > -1) newByIds.splice(index, 1);
      } else {
        newTiles[animatedTile.id] = animatedTile;
      }
    });

    dispatch({ type: "UPDATE_ALL_TILES", tiles: newTiles, byIds: newByIds, score: result.score });

    // Add random tile after animation
    setTimeout(() => {
      generateRandomTile();
      dispatch({ type: "END_MOVE" });
    }, animationDuration);

    // Check for game over and win conditions
    const isGameOverAfterMove = (!canMove(result.board) || isBoardFull(currentBoard));
    const hasWonThisMove = result.hasWon;

    if (isGameOverAfterMove && !hasWonThisMove) {
      dispatch({ type: "GAME_OVER" });
    } else if (hasWonThisMove) {
      dispatch({ type: "WIN_GAME" });
    }

  }, [dispatch, generateRandomTile]);

  /**
   * Restarts the game with a fresh state
   */
  const restartGame = useCallback(() => {
    const newInitialState = initializeBoard(getNextId);
    dispatch({ type: "SET_INITIAL_STATE", newState: newInitialState });
  }, [dispatch, getNextId]);

  /**
   * Undoes the last move
   */
  const undoMove = useCallback(() => {
    if (canUndo) {
      dispatch({ type: "UNDO_MOVE", previousState: stateRef.current.previousState });
    }
  }, [canUndo, dispatch]);

  /**
   * Continues playing after winning (reaching 2048)
   */
  const continueGame = useCallback(() => {
    dispatch({ type: "CONTINUE_GAME" });
  }, [dispatch]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          makeMove('up');
          break;
        case 'ArrowDown':
          makeMove('down');
          break;
        case 'ArrowLeft':
          makeMove('left');
          break;
        case 'ArrowRight':
          makeMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [makeMove]);

  return {
    isGameOver,
    isWon,
    makeMove,
    restartGame,
    undoMove,
    continueGame,
    animatedTiles,
    score,
    highScore,
    canUndo,
  };
};