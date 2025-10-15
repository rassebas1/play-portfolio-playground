import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Trophy, Users } from 'lucide-react';
import GameBoard from './components/GameBoard';
import { useTicTacToe } from './hooks/useTicTacToe';

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

  /**
   * Gets appropriate status badge variant based on game result
   */
  const getStatusBadgeVariant = () => {
    switch (gameState.gameResult) {
      case 'win':
        return 'default';
      case 'draw':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  /**
   * Gets the appropriate icon for current game status
   */
  const getStatusIcon = () => {
    if (gameState.gameResult === 'win') {
      return <Trophy className="w-4 h-4 mr-1" />;
    }
    if (gameState.gameResult === 'draw') {
      return <Users className="w-4 h-4 mr-1" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-8">
          
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🎯 Tic Tac Toe</h1>
            <p className="text-muted-foreground">Classic strategy game for two players</p>
          </div>
          
          <Button 
            onClick={resetGame}
            variant="outline" 
            size="sm"
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Game
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div class="grid lg:grid-cols-3 gap-8">
            
            {/* Game Status Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Game Status</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Badge 
                  variant={getStatusBadgeVariant()}
                  className="text-sm px-3 py-1"
                >
                  {getStatusIcon()}
                  {gameStatusMessage}
                </Badge>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Move Count: {gameState.moveCount}</div>
                  {gameState.gameStarted && (
                    <div>Next Player: 
                      <span className={`ml-1 font-semibold ${
                        gameState.currentPlayer === 'X' ? 'text-game-info' : 'text-game-danger'
                      }`}>
                        {gameState.currentPlayer}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Rules:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Players take turns placing X or O</li>
                    <li>• First player to get 3 in a row wins</li>
                    <li>• Rows, columns, or diagonals count</li>
                    <li>• If all cells are filled, it&apos;s a draw</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Strategy Tips:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Control the center when possible</li>
                    <li>• Block opponent&apos;s winning moves</li>
                    <li>• Create multiple winning opportunities</li>
                    <li>• Think ahead and plan your moves</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;