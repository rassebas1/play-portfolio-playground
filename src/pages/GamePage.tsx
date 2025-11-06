import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import TicTacToe from '@/games/tic-tac-toe/TicTacToe';
import Game2048 from '@/games/2048/Game2048';
import FlappyBird from '@/games/flappy-bird/FlappyBird';
import SnakeGame from '@/games/snake/SnakeGame';
import BrickBreaker from '@/games/brick-breaker/BrickBreaker';
import type { GameType } from '@/types/global';
import useTitle from '@/hooks/use-title';
import { Button } from '@/components/ui/button';

/**
 * Renders the game page, routing to the appropriate game component based on the URL.
 */
const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  /**
   * Validates if the provided game ID is a valid and supported game.
   */
  const isValidGameId = (id: string | undefined): id is GameType => {
    const validGames: GameType[] = ['tic-tac-toe', '2048', 'flappy-bird', 'snake', 'memory', 'brick-breaker'];
    return id !== undefined && validGames.includes(id as GameType);
  };

  // Set the document title based on the game ID
  useTitle(gameId ? `Playing ${gameId.replace('-', ' ')} | Portfolio` : 'Game | Portfolio');

  // Redirect to home if the game ID is invalid
  if (!isValidGameId(gameId)) {
    return <Navigate to="/" replace />;
  }

  /**
   * Renders the selected game component or a coming soon message.
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
        return <SnakeGame />;
      case 'memory':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">🧩 Memory Game</h1>
              <p className="text-muted-foreground">Coming Soon!</p>
            </div>
          </div>
        );
      case 'brick-breaker':
        return <BrickBreaker />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <Button
        onClick={() => navigate('/games')}
        className="absolute top-4 left-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs sm:text-base px-2 sm:px-4"
      >
        &larr; Go back
      </Button>
      {renderGame()}
    </div>
  );
};

export default GamePage;