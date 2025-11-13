/**
 * src/games/brick-breaker/components/GameBoard.tsx
 *
 * Renders the main game board for the Brick Breaker game using an HTML5 Canvas.
 * It draws the paddle, ball, and bricks based on the current game state.
 */

import React, { useRef, useEffect } from "react";
import { GameState, GameStatus } from "../types";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "../../../utils/brick_breaker_const";

/**
 * Props for the GameBoard component.
 * @interface GameBoardProps
 * @property {GameState} state - The current state of the Brick Breaker game,
 *                               including paddle, ball, bricks, and game status.
 */
interface GameBoardProps {
  state: GameState;
}

/**
 * React functional component for the Brick Breaker game board.
 * It uses an HTML5 Canvas element to render all dynamic game elements.
 *
 * @param {GameBoardProps} { state } - Props passed to the component.
 * @returns {JSX.Element} The rendered game board canvas.
 */
const GameBoard: React.FC<GameBoardProps> = ({ state }) => {
  // Ref to access the HTMLCanvasElement directly.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Effect hook to handle drawing on the canvas whenever the game state changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas element is available

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Ensure 2D rendering context is available

    // Clear the entire canvas before drawing new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Paddle
    ctx.fillStyle = "blue"; // Set paddle color
    ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height); // Draw paddle rectangle

    // Draw Ball
    ctx.beginPath(); // Start a new path
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2); // Draw a circle for the ball
    ctx.fillStyle = "red"; // Set ball color
    ctx.fill(); // Fill the circle
    ctx.closePath(); // Close the path

    // Draw Bricks
    state.bricks.forEach((brick) => {
      if (!brick.isBroken) { // Only draw bricks that are not broken
        ctx.fillStyle = brick.color; // Set brick color
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height); // Draw brick rectangle
        ctx.strokeStyle = "black"; // Set border color
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height); // Draw brick border
      }
    });

    // Display game status messages (e.g., "Press SPACE to Start", "PAUSED", "GAME OVER")
    ctx.fillStyle = "black"; // Set text color
    ctx.font = "24px Arial"; // Set font style
    ctx.textAlign = "center"; // Center align text

    if (state.gameStatus === GameStatus.IDLE) {
      ctx.fillText("Press SPACE to Start", canvas.width / 2, canvas.height / 2);
    } else if (state.gameStatus === GameStatus.PAUSED) {
      ctx.fillText("PAUSED - Press SPACE to Resume", canvas.width / 2, canvas.height / 2);
    } else if (state.gameStatus === GameStatus.GAME_OVER) {
      ctx.fillText("GAME OVER - Press R to Restart", canvas.width / 2, canvas.height / 2);
    } else if (state.gameStatus === GameStatus.LEVEL_CLEARED) {
      ctx.fillText("LEVEL CLEARED! - Press R for Next Level", canvas.width / 2, canvas.height / 2);
    }

  }, [state]); // Re-run effect whenever the game state changes

  return (
    <canvas
      ref={canvasRef} // Attach ref to the canvas element
      width={CANVAS_WIDTH} // Set canvas width
      height={CANVAS_HEIGHT} // Set canvas height
      style={{ border: "1px solid black", background: "#f0f0f0" }} // Basic styling for the canvas
    />
  );
};

export default GameBoard;