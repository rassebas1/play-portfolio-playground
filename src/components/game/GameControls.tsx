import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Undo2 } from 'lucide-react';

interface GameControlsProps {
  restartGame: () => void;
  undoMove?: () => void;
  canUndo?: boolean;
  moveCount?: number;
  score?: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  restartGame,
  undoMove,
  canUndo = false,
  moveCount,
  score,
}) => {
  return (
    <div className="flex justify-center gap-2 mb-6 flex-wrap">
      <Button
        onClick={restartGame}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
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
          Undo
        </Button>
      )}

      {moveCount !== undefined && (
        <Badge variant="secondary" className="px-3 py-1">
          Moves: {moveCount}
        </Badge>
      )}

      {score !== undefined && (
        <Badge variant="secondary" className="px-3 py-1">
          Score: {score}
        </Badge>
      )}
    </div>
  );
};