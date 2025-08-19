import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import TicTacToe from '@/games/tic-tac-toe/TicTacToe';
import Game2048 from '@/games/2048/Game2048';
import FlappyBird from '@/games/flappy-bird/FlappyBird';
import type { GameType } from '@/types/global';

/**
 * Game page wrapper component
 * Routes to the appropriate game component based on URL parameters
 */
const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();

  /**
   * Validates if the provided game ID is supported
   */
  const isValidGameId = (id: string | undefined): id is GameType => {
    const validGames: GameType[] = ['tic-tac-toe', '2048', 'flappy-bird', 'snake', 'memory'];
    return id !== undefined && validGames.includes(id as GameType);
  };

  // Redirect to home if invalid game ID
  if (!isValidGameId(gameId)) {
    return <Navigate to="/" replace />;
  }

  /**
   * Renders the appropriate game component based on game ID
   */
  const renderGame = () => {
    switch (gameId) {
      case 'tic-tac-toe':
        return <TicTacToe />;
      case '2048':
        return <Game2048 />;
      case 'flappy-bird':
        return <FlappyBird />;
      case 'snake':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">🐍 Snake</h1>
              <p className="text-muted-foreground">Coming Soon!</p>
            </div>
          </div>
        );
      case 'memory':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">🧩 Memory Game</h1>
              <p className="text-muted-foreground">Coming Soon!</p>
            </div>
          </div>
        );
      default:
        return <Navigate to="/" replace />;
    }
  };

  return renderGame();
};

export default GamePage;