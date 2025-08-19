import React from 'react';
import { cn } from '@/lib/utils';
import type { Bird as BirdType, GameDimensions } from '../types';

/**
 * Props for the Bird component
 */
interface BirdProps {
  bird: BirdType;
  dimensions: GameDimensions;
  className?: string;
}

/**
 * Bird component for Flappy Bird
 * Renders the bird with physics-based positioning and rotation
 */
const Bird: React.FC<BirdProps> = ({ bird, dimensions, className }) => {
  const birdStyle = {
    left: bird.x - dimensions.birdSize / 2,
    top: bird.y - dimensions.birdSize / 2,
    width: dimensions.birdSize,
    height: dimensions.birdSize,
    transform: `rotate(${bird.rotation}deg)`,
  };

  return (
    <div
      className={cn(
        'absolute transition-transform duration-75 ease-linear',
        'bg-gradient-to-br from-accent to-accent-glow',
        'rounded-full border-2 border-accent/40',
        'shadow-glow',
        'flex items-center justify-center',
        'z-20',
        className
      )}
      style={birdStyle}
      role="img"
      aria-label="Flappy bird"
    >
      {/* Bird emoji/icon */}
      <span className="text-lg select-none">🐦</span>
    </div>
  );
};

export default Bird;