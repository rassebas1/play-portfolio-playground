import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface GameHeaderProps {
  resetGame: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ resetGame }) => {
  return (
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
  );
};