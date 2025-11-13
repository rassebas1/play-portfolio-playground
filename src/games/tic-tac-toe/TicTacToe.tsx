import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Trophy, Users } from 'lucide-react';
import GameBoard from './components/GameBoard';
import { useTicTacToe } from './hooks/useTicTacToe';

import { GameHeader } from '@/components/game/GameHeader';
import { GameControls } from '@/components/game/GameControls';
import { GameStatus } from './components/GameStatus';
import { GameRules } from './components/GameRules';
import { GameOverModal } from '@/components/game/GameOverModal';

/**
 * Main Tic Tac Toe game component.
 * This component orchestrates the Tic Tac Toe game by integrating the `useTicTacToe` hook for game logic,
 * rendering the game board, controls, and displaying game status, rules, and high scores.
 */
const TicTacToe: React.FC = () => {
  // Destructure game state and control functions from the custom useTicTacToe hook
  // gameState: object containing board, current player, game result, etc.
  // gameStatusMessage: human-readable message about current game status
  // makeMove: function to handle a player's move
  // resetGame: function to reset the game
  // isCellInWinningLine: utility to check if a cell is part of the winning line
  // getCellValue: utility to get the value of a cell
  // highScore: the fewest moves to win recorded for this game
  const {
    gameState,
    gameStatusMessage,
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Game Header: Displays the game title and a brief description */}
        <GameHeader 
          title="🎯 Tic Tac Toe"
          description="Classic strategy game for two players"
        />

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Game Controls: Buttons for restarting the game */}
            {/* restartGame: function to reset the game */}
            {/* canUndo: Tic-tac-toe typically doesn't have an undo feature */}
            {/* moveCount: current number of moves made */}
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
                  Fewest Moves
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-accent">
                  {/* Displays the fewest moves to win, or '--' if no high score is set */}
                  {highScore !== null ? highScore.toLocaleString() : '--'}
                </div>
              </CardContent>
            </Card>

            {/* Game Status Card: Displays current player, game result, and status message */}
            {/* gameResult: current result of the game ('ongoing', 'win', 'draw') */}
            {/* winner: the winning player ('X' or 'O') if gameResult is 'win' */}
            {/* gameStatusMessage: human-readable status message */}
            {/* moveCount: current number of moves */}
            {/* gameStarted: boolean indicating if the game has started */}
            {/* currentPlayer: the player whose turn it is */}
            <GameStatus
              gameResult={gameState.gameResult}
              winner={gameState.winner}
              gameStatusMessage={gameStatusMessage}
              moveCount={gameState.moveCount}
              gameStarted={gameState.gameStarted}
              currentPlayer={gameState.currentPlayer}
            />

            {/* Game Board: The interactive 3x3 grid for playing Tic Tac Toe */}
            <Card className="lg:col-span-2">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Game Board</CardTitle>
                <CardDescription>
                  Click any empty cell to make your move
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameBoard
                  onCellClick={makeMove} // Callback for when a cell is clicked
                  getCellValue={getCellValue} // Function to get a cell's value
                  isCellInWinningLine={isCellInWinningLine} // Function to check if a cell is part of the winning line
                  isGameActive={isGameActive} // Boolean to enable/disable cell clicks
                />
              </CardContent>
            </Card>
          </div>

          {/* Game Rules: Component displaying the rules of Tic Tac Toe */}
          <GameRules />

          {/* Game Over Modal: Displays when the game concludes (win or draw) */}
          <GameOverModal
            isGameOver={gameState.gameResult !== 'ongoing'} // Modal shows if game is not ongoing
            isWon={gameState.gameResult === 'win'} // True if the game was won
            score={gameState.moveCount} // The final move count is considered the score
            bestScore={highScore ?? 0} // The fewest moves to win (high score)
            restartGame={resetGame} // Function to restart the game
          />
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;