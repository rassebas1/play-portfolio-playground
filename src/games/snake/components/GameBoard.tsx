/**
 * src/games/snake/components/GameBoard.tsx
 *
 * Renders the main game board for the Snake game, displaying the snake's body
 * and the food item.
 */

import React from 'react';
import { SnakeGameState, Coordinate } from '../types';

/**
 * Props for the GameBoard component.
 * @interface GameBoardProps
 * @property {SnakeGameState} gameState - The current state of the Snake game,
 *                                       including snake segments, food position, and board dimensions.
 */
interface GameBoardProps {
  gameState: SnakeGameState;
}

const CELL_SIZE = 20; // Defines the size of each grid cell in pixels for rendering.

/**
 * React functional component for the Snake Game board.
 * It visually represents the game grid, the snake, and the food.
 *
 * @param {GameBoardProps} { gameState } - Props passed to the component.
 * @returns {JSX.Element} The rendered game board.
 */
const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { snake, food, boardWidth, boardHeight } = gameState;

  return (
    <div
      className="relative border-2 border-gray-700 bg-gray-800"
      style={{
        width: boardWidth * CELL_SIZE,   // Calculate board width based on cell size
        height: boardHeight * CELL_SIZE, // Calculate board height based on cell size
      }}
    >
      {/* Render Snake: Each segment of the snake is a div */}
      {snake.map((segment, index) => (
        <div
          key={index} // Using index as key is acceptable here as snake segments are re-rendered entirely
          className="absolute bg-green-500 rounded-sm"
          style={{
            left: segment.x * CELL_SIZE, // Position segment horizontally
            top: segment.y * CELL_SIZE,  // Position segment vertically
            width: CELL_SIZE,            // Set segment width
            height: CELL_SIZE,           // Set segment height
          }}
        />
      ))}

      {/* Render Food: The food item is a div */}
      <div
        className="absolute bg-red-500 rounded-full"
        style={{
          left: food.x * CELL_SIZE, // Position food horizontally
          top: food.y * CELL_SIZE,  // Position food vertically
          width: CELL_SIZE,         // Set food width
          height: CELL_SIZE,        // Set food height
        }}
      />
    </div>
  );
};

export default GameBoard;
