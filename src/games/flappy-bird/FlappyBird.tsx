import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Play, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GameHeader } from '@/components/game/GameHeader';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameOverModal } from '@/components/game/GameOverModal';
import { GameControls } from '@/components/game/GameControls';
import { Instructions } from '@/components/game/Instructions';
import { Leaderboard } from '@/components/ui/Leaderboard';
import { useFlappyBird } from './hooks/useFlappyBird';
import GameArea from './components/GameArea';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { GameSession, createGameSession } from '@/types/highScores';

/**
 * Main Flappy Bird Game Component.
 * This component orchestrates the Flappy Bird game by integrating the `useFlappyBird` hook for game logic,
 * rendering the game area, controls, and displaying game status and scores.
 */
const FlappyBird: React.FC = () => {
  const { gameState, gameDimensions, jump, startNewGame, restartGame } = useFlappyBird();
  const navigate = useNavigate();
  const { t } = useTranslation('games/flappy-bird');
  const { t: tCommon } = useTranslation('common');
  const [session, setSession] = useState<GameSession | null>(null);

  useEffect(() => {
    const gameStarted = gameState.score > 0;
    if (gameStarted && !session) {
      setSession(createGameSession('flappy-bird'));
    }
    if (!gameStarted && !gameState.isGameOver) {
      setSession(null);
    }
  }, [gameState.score, gameState.isGameOver, session]);

  useEffect(() => {
    if (session && gameState.score > 0) {
      setSession(prev => prev ? { ...prev, moves: prev.moves + 1 } : null);
    }
  }, [gameState.score]);

  /**
   * Navigates the user back to the main portfolio page.
   * @returns {void}
   */
  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Game Header: Displays the game title and a brief description */}
        <GameHeader 
          title={t('title')}
          description={t('description')}
        />

        {/* Score Section: Displays current score and the highest score */}
        {/* score: current game score */}
        {/* bestScore: highest score recorded for the game (defaults to 0 if null) */}
        <Scoreboard score={gameState.score} bestScore={gameState.highScore ?? 0} />

        {/* Game Controls: Buttons for restarting, etc. */}
        {/* restartGame: function to restart the game */}
        <GameControls restartGame={startNewGame} />

        {/* Game Area: The main canvas where the game is played */}
        {/* gameState: current state of the game (bird, pipes, etc.) */}
        {/* dimensions: game area dimensions */}
        {/* onJump: function to handle bird jumps (e.g., on tap/click) */}
        <div className="flex justify-center mb-6">
          <GameArea
            gameState={gameState}
            dimensions={gameDimensions}
            onJump={jump}
          />
        </div>

        {/* Instructions: Provides guidance on how to play the game */}
        <Instructions>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Desktop:</span> {t('instructions.desktop')}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Mobile:</span> {t('instructions.mobile')}
          </p>
          <p className="text-xs text-muted-foreground/80">
            {t('how_to_play.items.3')}
          </p>
        </Instructions>

        {/* Game Over Modal: Displays when the game is over */}
        <GameOverModal
          isGameOver={gameState.isGameOver} // True if game is over
          isWon={false} // Flappy Bird doesn't have a "win" state
          score={gameState.score} // Final score of the game
          bestScore={gameState.highScore ?? 0} // Highest score recorded
          restartGame={restartGame} // Function to restart the game
        />
      </div>

      <div className="mt-8">
        <Leaderboard game="flappy-bird" limit={10} currentSession={session} />
      </div>
    </div>
  );
};

export default FlappyBird;