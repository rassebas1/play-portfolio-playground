import React from 'react';
import { useTranslation } from 'react-i18next';
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
  canUndo = false,
  moveCount,
  score,
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex justify-center gap-2 mb-6 flex-wrap">
      <Button
        onClick={restartGame}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        {t('new_game')}
      </Button>
      
      {undoMove && (
        <Button
          onClick={undoMove}
          disabled={!canUndo}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Undo2 className="w-4 h-4" />
          {t('undo')}
        </Button>
      )}

      {moveCount !== undefined && (
        <Badge variant="secondary" className="px-3 py-1">
          {t('moves', { count: moveCount })}
        </Badge>
      )}

      {score !== undefined && (
        <Badge variant="secondary" className="px-3 py-1">
          {t('score', { count: score })}
        </Badge>
      )}
    </div>
  );
};