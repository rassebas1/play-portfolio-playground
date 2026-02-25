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
        size="lg"
        className="min-h-[48px] min-w-[120px] touch-manipulation"
      >
        <RotateCcw className="w-5 h-5" />
        {t('new_game')}
      </Button>
      
      {undoMove && (
        <Button
          onClick={undoMove}
          disabled={!canUndo}
          variant="outline"
          size="lg"
          className="min-h-[48px] min-w-[100px] touch-manipulation"
        >
          <Undo2 className="w-5 h-5" />
          {t('undo')}
        </Button>
      )}

      {moveCount !== undefined && (
        <Badge variant="secondary" className="px-4 py-3 min-h-[48px] flex items-center text-base">
          {t('moves', { count: moveCount })}
        </Badge>
      )}

      {score !== undefined && (
        <Badge variant="secondary" className="px-4 py-3 min-h-[48px] flex items-center text-base">
          {t('score', { count: score })}
        </Badge>
      )}
    </div>
  );
};