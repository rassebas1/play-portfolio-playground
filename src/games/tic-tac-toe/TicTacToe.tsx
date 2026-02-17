import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import GameBoard from './components/GameBoard';
import { useTicTacToe } from './hooks/useTicTacToe';

import { GameHeader } from '@/components/game/GameHeader';
import { GameControls } from '@/components/game/GameControls';
import { GameStatus } from './components/GameStatus';
import { GameRules } from './components/GameRules';
import { GameOverModal } from '@/components/game/GameOverModal';
import { WinCelebrationOverlay } from '@/components/game/WinCelebrationOverlay';

/**
 * Main Tic Tac Toe game component.
 * This component orchestrates the Tic Tac Toe game by integrating the `useTicTacToe` hook for game logic,
 * rendering the game board, controls, and displaying game status, rules, and high scores.
 */
const TicTacToe: React.FC = () => {
  // Initialize translation hook for tic-tac-toe game
  const { t } = useTranslation('games/tic-tac-toe');
  const { t: tCommon } = useTranslation('common');
  
  // Destructure game state and control functions from the custom useTicTacToe hook
  const {
    gameState,
    makeMove,
    resetGame,
    isCellInWinningLine,
    getCellValue,
    highScore,
  } = useTicTacToe();

  /**
   * Determines if the game is in an active playing state (i.e., not won, drawn, or idle).
   * @returns {boolean} True if the game is ongoing, false otherwise.
   */
  const isGameActive = gameState.gameResult === 'ongoing';
  
  // Ref for screen reader announcer
  const announcerRef = useRef<HTMLDivElement>(null);

  // State for win celebration overlay
  const [showCelebration, setShowCelebration] = useState(false);

  // Ref to track previous game result for transition detection
  const prevGameResultRef = useRef(gameState.gameResult);

  // Announce game state changes to screen readers
  useEffect(() => {
    if (announcerRef.current) {
      // Game status is now announced by the GameStatus component itself
      announcerRef.current.textContent = '';
    }
  }, [gameState.gameResult, gameState.currentPlayer]);

  // Trigger celebration only when transitioning from ongoing to win
  useEffect(() => {
    const prevResult = prevGameResultRef.current;
    const currentResult = gameState.gameResult;

    // Only trigger when game transitions from ongoing to win
    if (prevResult === 'ongoing' && currentResult === 'win') {
      setShowCelebration(true);
    }

    prevGameResultRef.current = currentResult;
  }, [gameState.gameResult]);

  // Handler when celebration completes
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Game Header: Displays the game title and a brief description */}
        <GameHeader 
          title={`🎯 ${t('title')}`}
          description={t('description')}
        />

        {/* Screen reader announcer - visually hidden */}
        <div
          ref={announcerRef}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        <div className="max-w-4xl mx-auto">
          {/* Floating Game Status - Now above the board */}
          <GameStatus
            gameResult={gameState.gameResult}
            winner={gameState.winner}
            moveCount={gameState.moveCount}
            gameStarted={gameState.gameStarted}
            currentPlayer={gameState.currentPlayer}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Game Controls: Buttons for restarting the game */}
            <GameControls
              restartGame={resetGame}
              canUndo={false}
              moveCount={gameState.moveCount}
            />

            {/* Custom display for "Fewest Moves to Win" (High Score) */}
            <Card className="text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {tCommon('fewest_moves')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-accent">
                  {highScore !== null ? highScore.toLocaleString() : '--'}
                </div>
              </CardContent>
            </Card>

            {/* Empty placeholder to maintain grid layout */}
            <div className="hidden lg:block" />
          </div>

          {/* Game Board - Full width, centered */}
          <Card className="mt-8 max-w-2xl mx-auto">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{tCommon('game_board')}</CardTitle>
              <CardDescription>
                {tCommon('keyboard_instructions')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <GameBoard
                onCellClick={makeMove}
                getCellValue={getCellValue}
                isCellInWinningLine={isCellInWinningLine}
                isGameActive={isGameActive}
                currentPlayer={gameState.currentPlayer}
                winningLine={gameState.winningLine}
              />
            </CardContent>
          </Card>

          {/* Game Rules */}
          <div className="mt-8">
            <GameRules />
          </div>

          {/* Win Celebration Overlay - Shows when game is won, blocks page */}
          <WinCelebrationOverlay
            isVisible={showCelebration}
            winner={gameState.winner || 'X'}
            duration={3000}
            winnerTitleKey="celebration.winner_title"
            winnerSubtitleKey="celebration.winner_subtitle"
            translationNamespace="games/tic-tac-toe"
            onComplete={handleCelebrationComplete}
          />

          {/* Game Over Modal - Only shows after celebration ends or on draw */}
          <GameOverModal
            isGameOver={gameState.gameResult !== 'ongoing' && !showCelebration}
            isWon={gameState.gameResult === 'win'}
            score={gameState.moveCount}
            bestScore={highScore ?? 0}
            restartGame={resetGame}
          />
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
