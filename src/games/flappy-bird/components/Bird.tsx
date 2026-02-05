import React from 'react';
import { cn } from '@/lib/utils'; // Utility for conditionally joining class names
import type { Bird as BirdType, GameDimensions } from '../types';
import BirdSVG from '@/components/game/BirdSVG'; // Import BirdSVG

/**
 * Props for the Bird component.
 * @interface BirdProps
 * @property {BirdType} bird - The current state of the bird (position, velocity, rotation).
 * @property {GameDimensions} dimensions - Object containing game area dimensions, including birdSize.
 * @property {string} [className] - Optional additional CSS classes to apply to the bird element.
 */
interface BirdProps {
  bird: BirdType;
  dimensions: GameDimensions;
  isFlapping: boolean;
  isGameOver: boolean; // Added isGameOver prop
  className?: string;
}

/**
 * Bird component for Flappy Bird.
 * Renders the bird character within the game area, applying physics-based positioning and rotation
 * for a dynamic visual representation.
 *
 * @param {BirdProps} { bird, dimensions, className } - Props passed to the component.
 * @returns {JSX.Element} The rendered bird element.
 */
const Bird: React.FC<BirdProps> = ({ bird, dimensions, isFlapping, isGameOver, className }) => {
  const birdStyle = {
    left: bird.x - dimensions.birdSize / 2, // Center the bird horizontally
    top: bird.y - dimensions.birdSize / 2,  // Center the bird vertically
    width: dimensions.birdSize,             // Set bird's width
    height: dimensions.birdSize,            // Set bird's height
    transform: `rotate(${bird.rotation}deg)`, // Apply rotation for visual effect (e.g., tilting when falling)
  };

  return (
    <div
      className={cn(
        'absolute transition-transform duration-75 ease-linear',
        'flex items-center justify-center',
        'z-20',
        className
      )}
      style={birdStyle} // Apply calculated inline styles
      role="img" // ARIA role for accessibility
      aria-label="Flappy bird" // ARIA label for accessibility
    >
      <BirdSVG isFlapping={isFlapping} isGameOver={isGameOver} size={dimensions.birdSize} /> {/* Pass isGameOver prop */}
    </div>
  );
};

export default Bird;
