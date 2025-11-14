import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users } from 'lucide-react';
import type { GameResult, Player } from '../types';

/**
 * Props for the GameStatus component.
 * @interface GameStatusProps
 * @property {GameResult} gameResult - The current result of the game ('ongoing', 'win', 'draw').
 * @property {Player | null} winner - The winning player ('X' or 'O') if gameResult is 'win', otherwise null.
 * @property {string} gameStatusMessage - A human-readable message describing the current game status.
 * @property {number} moveCount - The total number of moves made in the current game.
 * @property {boolean} gameStarted - True if the game has started, false otherwise.
 * @property {Player} currentPlayer - The player whose turn it is currently.
 */
interface GameStatusProps {
  gameResult: GameResult;
  winner: Player | null;
  gameStatusMessage: string;
  moveCount: number;
  gameStarted: boolean;
  currentPlayer: Player;
}

/**
 * GameStatus component for Tic Tac Toe.
 * Displays the current status of the game, including messages, move count,
 * and the current player. It uses badges and icons for visual cues.
 *
 * @param {GameStatusProps} props - Props passed to the component.
 * @returns {JSX.Element} The rendered game status card.
 */
export const GameStatus: React.FC<GameStatusProps> = ({
  gameResult,
  winner,
  gameStatusMessage,
  moveCount,
  gameStarted,
  currentPlayer,
}) => {
  /**
   * Determines the appropriate badge variant (color/style) based on the game result.
   * @returns {'default' | 'secondary' | 'outline'} The variant string for the Badge component.
   */
  const getStatusBadgeVariant = () => {
    switch (gameResult) {
      case 'win':
        return 'default'; // Green for win
      case 'draw':
        return 'secondary'; // Grey for draw
      default:
        return 'outline'; // Default for ongoing/idle
    }
  };

  /**
   * Gets the appropriate icon to display next to the status message.
   * @returns {JSX.Element | null} A Lucide icon component or null if no icon is needed.
   */
  const getStatusIcon = () => {
    if (gameResult === 'win') {
      return <Trophy className="w-4 h-4 mr-1" />; // Trophy icon for a win
    }
    if (gameResult === 'draw') {
      return <Users className="w-4 h-4 mr-1" />; // Users icon for a draw
    }
    return null; // No icon for ongoing/idle
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Game Status</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {/* Badge displaying the main game status message */}
        <Badge
          variant={getStatusBadgeVariant()} // Dynamic variant based on game result
          className="text-sm px-3 py-1"
        >
          {getStatusIcon()} {/* Dynamic icon */}
          {gameStatusMessage} {/* The status message */}
        </Badge>

        {/* Display move count and current player */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>Move Count: {moveCount}</div>
          {gameStarted && ( // Only show current player if the game has started
            <div>Next Player:
              <span className={`ml-1 font-semibold ${
                currentPlayer === 'X' ? 'text-game-info' : 'text-game-danger' // Dynamic color for current player
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