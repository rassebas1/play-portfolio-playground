import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Undo2 } from 'lucide-react';

/**
 * Props for the GameControls component.
 * @interface GameControlsProps
 * @property {() => void} restartGame - Callback function to restart the game.
 * @property {() => void} [undoMove] - Optional callback function to undo the last move.
 * @property {boolean} [canUndo=false] - Optional boolean indicating if an undo operation is currently possible.
 * @property {number} [moveCount] - Optional number representing the current move count.
 * @property {number} [score] - Optional number representing the current score.
 */
interface GameControlsProps {
  restartGame: () => void;
  undoMove?: () => void;
  canUndo?: boolean;
  moveCount?: number;
  score?: number;
}

/**
 * GameControls component.
 * Provides common game control buttons (New Game, Undo) and displays optional
 * game-related information like move count or score.
 *
 * @param {GameControlsProps} props - Props passed to the component.
 * @returns {JSX.Element} The rendered game controls.
 */
export const GameControls: React.FC<GameControlsProps> = ({
  restartGame,
  undoMove,
  canUndo = false, // Default to false if not provided
  moveCount,
  score,
}) => {
  return (
    <div className="flex justify-center gap-2 mb-6 flex-wrap">
      {/* New Game Button */}
      <Button
        onClick={restartGame} // Attach restart game handler
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" /> {/* Icon for new game */}
        New Game
      </Button>
      
      {/* Undo Button: Conditionally rendered if undoMove function is provided */}
      {undoMove && (
        <Button
          onClick={undoMove} // Attach undo move handler
          disabled={!canUndo} // Disable if undo is not possible
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Undo2 className="w-4 h-4" /> {/* Icon for undo */}
          Undo
        </Button>
      )}

      {/* Move Count Badge: Conditionally rendered if moveCount is provided */}
      {moveCount !== undefined && (
        <Badge variant="secondary" className="px-3 py-1">
          Moves: {moveCount}
        </Badge>
      )}

      {/* Score Badge: Conditionally rendered if score is provided */}
      {score !== undefined && (
        <Badge variant="secondary" className="px-3 py-1">
          Score: {score}
        </Badge>
      )}
    </div>
  );
};