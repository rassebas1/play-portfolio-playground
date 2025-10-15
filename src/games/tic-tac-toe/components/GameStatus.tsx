import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users } from 'lucide-react';
import type { GameResult, Player } from '../types';

interface GameStatusProps {
  gameResult: GameResult;
  winner: Player | null;
  gameStatusMessage: string;
  moveCount: number;
  gameStarted: boolean;
  currentPlayer: Player;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  gameResult,
  winner,
  gameStatusMessage,
  moveCount,
  gameStarted,
  currentPlayer,
}) => {
  /**
   * Gets appropriate status badge variant based on game result
   */
  const getStatusBadgeVariant = () => {
    switch (gameResult) {
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
    if (gameResult === 'win') {
      return <Trophy className="w-4 h-4 mr-1" />;
    }
    if (gameResult === 'draw') {
      return <Users className="w-4 h-4 mr-1" />;
    }
    return null;
  };

  return (
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
          <div>Move Count: {moveCount}</div>
          {gameStarted && (
            <div>Next Player:
              <span className={`ml-1 font-semibold ${
                currentPlayer === 'X' ? 'text-game-info' : 'text-game-danger'
              }`}>
                {currentPlayer}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};