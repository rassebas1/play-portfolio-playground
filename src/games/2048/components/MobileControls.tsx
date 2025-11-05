import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface MobileControlsProps {
  makeMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isGameOver: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  makeMove,
  isGameOver,
}) => {
  return (
    <div className="block sm:hidden mb-6">
      <div className="text-center text-sm text-muted-foreground mb-3">
        Swipe or use buttons to move
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
        <div className="col-start-2">
          <Button
            onClick={() => makeMove('up')}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={isGameOver}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={() => makeMove('left')}
          variant="outline"
          size="sm"
          disabled={isGameOver}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => makeMove('down')}
          variant="outline"
          size="sm"
          disabled={isGameOver}
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => makeMove('right')}
          variant="outline"
          size="sm"
          disabled={isGameOver}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};