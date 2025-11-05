// src/games/snake/components/GameBoard.tsx

import React from 'react';
import { SnakeGameState, Coordinate } from '../types';

interface GameBoardProps {
  gameState: SnakeGameState;
}

const CELL_SIZE = 20; // Size of each cell in pixels

/**
 * Renders the Snake game board, including the snake and the food.
 * @param {GameBoardProps} props The component props.
 * @returns {JSX.Element} The rendered game board.
 */
const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { snake, food, boardWidth, boardHeight } = gameState;

  return (
    <div
      className="relative border-2 border-gray-700 bg-gray-800"
      style={{
        width: boardWidth * CELL_SIZE,
        height: boardHeight * CELL_SIZE,
      }}
    >
      {/* Render Snake */}
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute bg-green-500 rounded-sm"
          style={{
            left: segment.x * CELL_SIZE,
            top: segment.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />
      ))}

      {/* Render Food */}
      <div
        className="absolute bg-red-500 rounded-full"
        style={{
          left: food.x * CELL_SIZE,
          top: food.y * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE,
        }}
      />
    </div>
  );
};

export default GameBoard;
