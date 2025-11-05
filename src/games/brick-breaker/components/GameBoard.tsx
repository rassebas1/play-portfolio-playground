// src/games/brick-breaker/components/GameBoard.tsx

import React, { useRef, useEffect } from "react";
import { GameState, GameStatus } from "../types";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "../../../utils/brick_breaker_const";

interface GameBoardProps {
  state: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Paddle
    ctx.fillStyle = "blue";
    ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);

    // Draw Ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // Draw Bricks
    state.bricks.forEach((brick) => {
      if (!brick.isBroken) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

    // Display game status messages
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";

    if (state.gameStatus === GameStatus.IDLE) {
      ctx.fillText("Press SPACE to Start", canvas.width / 2, canvas.height / 2);
    } else if (state.gameStatus === GameStatus.PAUSED) {
      ctx.fillText("PAUSED - Press SPACE to Resume", canvas.width / 2, canvas.height / 2);
    } else if (state.gameStatus === GameStatus.GAME_OVER) {
      ctx.fillText("GAME OVER - Press R to Restart", canvas.width / 2, canvas.height / 2);
    } else if (state.gameStatus === GameStatus.LEVEL_CLEARED) {
      ctx.fillText("LEVEL CLEARED! - Press R for Next Level", canvas.width / 2, canvas.height / 2);
    }

  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ border: "1px solid black", background: "#f0f0f0" }}
    />
  );
};

export default GameBoard;