import React from 'react';
import { cn } from '@/lib/utils';
import type { GameDimensions } from '../types';

/**
 * Props for the Ground component
 */
interface GroundProps {
  dimensions: GameDimensions;
  className?: string;
}

/**
 * Ground component for Flappy Bird
 * Renders the animated ground/base of the game
 */
const Ground: React.FC<GroundProps> = ({ dimensions, className }) => {
  const groundStyle = {
    bottom: 0,
    width: dimensions.width,
    height: dimensions.groundHeight,
  };

  return (
    <div
      className={cn(
        'absolute left-0',
        'bg-gradient-to-t from-muted-dark to-muted',
        'border-t-4 border-primary/40',
        'z-10',
        className
      )}
      style={groundStyle}
      role="presentation"
      aria-label="Ground"
    >
      {/* Ground pattern/texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
      </div>
      
      {/* Ground details */}
      <div className="absolute top-2 left-0 right-0 flex justify-center space-x-8 text-muted-foreground/40">
        <span className="text-xs">🌱</span>
        <span className="text-xs">🌿</span>
        <span className="text-xs">🌱</span>
        <span className="text-xs">🌿</span>
        <span className="text-xs">🌱</span>
      </div>
    </div>
  );
};

export default Ground;