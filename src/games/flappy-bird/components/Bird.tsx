import React from 'react';
import { cn } from '@/lib/utils';
import type { Bird as BirdType, GameDimensions } from '../types';
import BirdSVG from '@/components/game/BirdSVG'; // Import BirdSVG

/**
 * Props for the Bird component
 */
interface BirdProps {
  bird: BirdType;
  dimensions: GameDimensions;
  isFlapping: boolean;
  isGameOver: boolean; // Added isGameOver prop
  className?: string;
}

/**
 * Bird component for Flappy Bird
 * Renders the bird with physics-based positioning and rotation
 */
const Bird: React.FC<BirdProps> = ({ bird, dimensions, isFlapping, isGameOver, className }) => {
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
        'flex items-center justify-center',
        'z-20',
        className
      )}
      style={birdStyle}
      role="img"
      aria-label="Flappy bird"
    >
      <BirdSVG isFlapping={isFlapping} isGameOver={isGameOver} size={dimensions.birdSize} /> {/* Pass isGameOver prop */}
    </div>
  );
};

export default Bird;
