import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Undo2 } from 'lucide-react';

interface GameControlsProps {
  restartGame: () => void;
  undoMove: () => void;
  canUndo: boolean;
  moveCount: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  restartGame,
  undoMove,
  canUndo,
  moveCount,
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

      <Badge variant="secondary" className="px-3 py-1">
        Moves: {moveCount}
      </Badge>
    </div>
  );
};