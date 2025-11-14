/**
 * src/games/2048/hooks/use2048.ts
 *
 * Custom React hook for managing the state and logic of the 2048 game.
 * It handles board state, tile movements, scoring, game over/win conditions,
 * and integrates with the high score system.
 */
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { Board, Direction, Tile } from '../types';
import { initializeBoard, isBoardFull } from '../utils/boardUtils';
import { processMove } from '../utils/moveProcessor';
import { canMove } from '../utils/moveProcessor2';
import { addRandomTile } from '../utils/tileUtils';
import { ANIMATION_DURATION } from '@/utils/2048_const';
import { GameReducer, initialState } from '../GameReducer';
import { useIds } from '../useIds';
import { useHighScores } from '@/hooks/useHighScores';

/**
 * Custom hook for 2048 game logic and state management.
 *
 * @returns {object} An object containing:
 *   - {boolean} isGameOver - True if the game is currently in a game over state.
 *   - {boolean} isWon - True if the player has reached the 2048 tile.
 *   - {function(direction: Direction): void} makeMove - Function to perform a tile move in a given direction.
 *   - {function(): void} restartGame - Function to reset and start a new game.
 *   - {function(): void} undoMove - Function to undo the last move.
 *   - {function(): void} continueGame - Function to continue playing after winning (reaching 2048).
 *   - {Tile[]} animatedTiles - An array of tiles with their current and previous positions for animation.
 *   - {number} score - The current score of the game.
 *   - {number | null} highScore - The highest score recorded for this game, or null if none exists.
 *   - {boolean} canUndo - True if the last move can be undone.
 */
export const use2048 = () => {
  // Custom hook to generate unique IDs for tiles
  const [getNextId] = useIds();
  // useReducer manages the complex state transitions of the game
  // initialState is generated dynamically to ensure unique tile IDs on first load
  const [state, dispatch] = useReducer(GameReducer, undefined, () => initializeBoard(getNextId));
  // Destructure relevant state variables for easier access
  const { tiles, byIds, hasChanged, inMotion, score, isGameOver, isWon, canUndo } = state;
  // useHighScores hook integrates persistent high score tracking for the '2048' game
  const { highScore, updateHighScore } = useHighScores('2048');

  // Memoized array of tiles for rendering, including animation data
  const animatedTiles = byIds.map(id => tiles[id]);

  const animationDuration = 100; // Define animation duration for tile movements

  // Ref to hold the current state, allowing callbacks to access the latest state without re-creating
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /**
   * Generates and adds a new random tile (2 or 4) to an empty spot on the board.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const generateRandomTile = useCallback(() => {
    const newTile = addRandomTile(stateRef.current.tiles, stateRef.current.byIds, getNextId());
    if (newTile) {
      dispatch({ type: "ADD_TILE", tile: newTile });
    }
  }, [getNextId, dispatch]); // Dependencies for callback stability

  /**
   * Makes a move in the specified direction, updating the board, score, and checking game conditions.
   * This function is memoized using `useCallback`.
   *
   * @param {Direction} direction - The direction of the move ('up', 'down', 'left', 'right').
   * @returns {void}
   */
  const makeMove = useCallback((direction: Direction) => {
    // Prevent moves if game is over, already won (and not continuing), or tiles are still animating
    if (stateRef.current.isGameOver || (stateRef.current.isWon && !stateRef.current.isGameOver) || stateRef.current.inMotion) return;

    // Reconstruct the current board from the state's tiles for processing
    const currentBoard = Array(4).fill(null).map(() => Array(4).fill(null)) as Board;
    stateRef.current.byIds.forEach(id => {
      const tile = stateRef.current.tiles[id];
      currentBoard[tile.row][tile.col] = tile;
    });

    // Process the move using the game logic utility
    const result = processMove(currentBoard, direction);

    // If no tiles moved, do nothing
    if (!result.moved) return;

    dispatch({ type: "START_MOVE" }); // Indicate start of move for animation purposes

    // Update tiles based on the result of the move processing
    const newTiles = { ...stateRef.current.tiles };
    const newByIds = [...stateRef.current.byIds];

    result.animatedTiles.forEach(animatedTile => {
      if (animatedTile.isRemoved) {
        // Remove merged tiles
        delete newTiles[animatedTile.id];
        const index = newByIds.indexOf(animatedTile.id);
        if (index > -1) newByIds.splice(index, 1);
      } else {
        // Update existing tiles with new positions/values
        newTiles[animatedTile.id] = animatedTile;
      }
    });

    // Dispatch action to update the board state with new tiles and score
    dispatch({ type: "UPDATE_ALL_TILES", tiles: newTiles, byIds: newByIds, score: result.score });

    // Add a random tile after a short delay to allow for animation
    setTimeout(() => {
      generateRandomTile(); // Add a new tile
      dispatch({ type: "END_MOVE" }); // Indicate end of move
    }, animationDuration);

    // Check for game over and win conditions after the move
    const isGameOverAfterMove = (!canMove(result.board) || isBoardFull(currentBoard));
    const hasWonThisMove = result.hasWon;

    if (isGameOverAfterMove && !hasWonThisMove) {
      dispatch({ type: "GAME_OVER" }); // Dispatch game over if no more moves are possible
    } else if (hasWonThisMove) {
      dispatch({ type: "WIN_GAME" }); // Dispatch win game if 2048 tile is created
    }

  }, [dispatch, generateRandomTile]); // Dependencies for callback stability

  /**
   * Restarts the game with a fresh state.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const restartGame = useCallback(() => {
    // Initialize a new board and set it as the initial state
    const newInitialState = initializeBoard(getNextId);
    dispatch({ type: "SET_INITIAL_STATE", newState: newInitialState });
  }, [dispatch, getNextId]); // Dependencies for callback stability

  /**
   * Undoes the last move, reverting to the previous game state.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const undoMove = useCallback(() => {
    if (canUndo) { // Only allow undo if `canUndo` is true
      dispatch({ type: "UNDO_MOVE", previousState: stateRef.current.previousState });
    }
  }, [canUndo, dispatch]); // Dependencies for callback stability

  /**
   * Allows the player to continue playing after reaching the 2048 tile.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const continueGame = useCallback(() => {
    dispatch({ type: "CONTINUE_GAME" }); // Dispatch action to continue game
  }, [dispatch]); // Dependencies for callback stability

  // Effect to dispatch 'END_MOVE' on initial render, ensuring correct state
  useEffect(() => {
    dispatch({ type: 'END_MOVE' });
  }, []); // Runs only once on mount

  // Effect to update the high score when the game is over or won.
  useEffect(() => {
    if (isGameOver || isWon) {
      // Update high score using the 'highest' strategy
      updateHighScore(score, 'highest');
    }
  }, [isGameOver, isWon, score, updateHighScore]); // Dependencies for high score update

  // Keyboard event handler for tile movements.
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault(); // Prevent default browser actions (e.g., scrolling)
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

    // Add and remove keyboard event listener
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [makeMove]); // Dependency on makeMove ensures listener is updated if callback changes

  // Return all relevant game state and control functions
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