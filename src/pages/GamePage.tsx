import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import TicTacToe from '@/games/tic-tac-toe/TicTacToe';
import Game2048 from '@/games/2048/Game2048';
import FlappyBird from '@/games/flappy-bird/FlappyBird';
import SnakeGame from '@/games/snake/SnakeGame';
import MemoryGame from '@/games/memory-game/MemoryGame';
import BrickBreaker from '@/games/brick-breaker/BrickBreaker';
import type { GameType } from '@/types/global';
import useTitle from '@/hooks/use-title';
import { Button } from '@/components/ui/button';

/**
 * GamePage component.
 * This component is responsible for dynamically rendering the selected game
 * based on the `gameId` parameter in the URL. It also handles invalid game IDs
 * by redirecting to the home page and sets the document title.
 *
 * @returns {JSX.Element} The rendered game component or a redirection.
 */
const GamePage: React.FC = () => {
  // `useParams` hook to extract URL parameters, specifically `gameId`.
  const { gameId } = useParams<{ gameId: string }>();
  // `useNavigate` hook for programmatic navigation.
  const navigate = useNavigate();

  /**
   * Validates if the provided game ID string is one of the supported game types.
   * @param {string | undefined} id - The game ID to validate.
   * @returns {id is GameType} True if the ID is a valid game type, false otherwise.
   */
  const isValidGameId = (id: string | undefined): id is GameType => {
    const validGames: GameType[] = ['tic-tac-toe', '2048', 'flappy-bird', 'snake', 'memory-game', 'brick-breaker'];
    return id !== undefined && validGames.includes(id as GameType);
  };

  // Custom hook to set the document title dynamically based on the current game.
  useTitle(gameId ? `Playing ${gameId.replace('-', ' ')} | Portfolio` : 'Game | Portfolio');

  // If the `gameId` is invalid, redirect the user to the home page.
  if (!isValidGameId(gameId)) {
    return <Navigate to="/" replace />;
  }

  /**
   * Renders the appropriate game component based on the validated `gameId`.
   * If `gameId` somehow becomes invalid (should be caught by the check above),
   * it defaults to redirecting to the home page.
   * @returns {JSX.Element} The React component for the selected game.
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
      case 'memory-game':
        return <MemoryGame />;
      case 'brick-breaker':
        return <BrickBreaker />;
      default:
        // This case should ideally not be reached due to isValidGameId check.
        return <Navigate to="/" replace />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Button to navigate back to the games listing page */}
      <Button
        onClick={() => navigate('/games')}
        className="absolute top-4 left-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs sm:text-base px-2 sm:px-4"
      >
        &larr; Go back
      </Button>
      {/* Render the selected game component */}
      {renderGame()}
    </div>
  );
};

export default GamePage;