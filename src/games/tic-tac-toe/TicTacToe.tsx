import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Trophy, Users } from 'lucide-react';
import GameBoard from './components/GameBoard';
import { useTicTacToe } from './hooks/useTicTacToe';

import { GameHeader } from './components/GameHeader';
import { GameStatus } from './components/GameStatus';
import { GameRules } from './components/GameRules';

/**
 * Main Tic Tac Toe game component
 * Orchestrates the entire game interface including board, controls, and status
 */
const TicTacToe: React.FC = () => {
  // Game state and actions from custom hook
  const {
    gameState,
    gameStatusMessage,
    makeMove,
    resetGame,
    isCellInWinningLine,
    getCellValue
  } = useTicTacToe();

  /**
   * Determines if the game is in an active playing state
   */
  const isGameActive = gameState.gameResult === 'ongoing';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <GameHeader resetGame={resetGame} />

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Game Status Card */}
            <GameStatus
              gameResult={gameState.gameResult}
              winner={gameState.winner}
              gameStatusMessage={gameStatusMessage}
              moveCount={gameState.moveCount}
              gameStarted={gameState.gameStarted}
              currentPlayer={gameState.currentPlayer}
            />

            {/* Game Board */}
            <Card className="lg:col-span-2">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Game Board</CardTitle>
                <CardDescription>
                  Click any empty cell to make your move
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameBoard
                  onCellClick={makeMove}
                  getCellValue={getCellValue}
                  isCellInWinningLine={isCellInWinningLine}
                  isGameActive={isGameActive}
                />
              </CardContent>
            </Card>
          </div>

          {/* Game Rules */}
          <GameRules />
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;