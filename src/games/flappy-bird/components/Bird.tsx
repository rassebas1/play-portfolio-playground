import React from 'react';
import { cn } from '@/lib/utils'; // Utility for conditionally joining class names
import type { Bird as BirdType, GameDimensions } from '../types';

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
const Bird: React.FC<BirdProps> = ({ bird, dimensions, className }) => {
  // Calculate inline styles for positioning, size, and rotation based on bird's state and game dimensions.
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
        'absolute transition-transform duration-75 ease-linear', // Smooth transition for movement and rotation
        'bg-gradient-to-br from-accent to-accent-glow', // Gradient background for the bird
        'rounded-full border-2 border-accent/40', // Rounded shape with a border
        'shadow-glow', // Custom glow shadow
        'flex items-center justify-center', // Center the emoji within the bird div
        'z-20', // Ensure bird is rendered above pipes but below overlays
        className // Allow external classes to be passed
      )}
      style={birdStyle} // Apply calculated inline styles
      role="img" // ARIA role for accessibility
      aria-label="Flappy bird" // ARIA label for accessibility
    >
      {/* Bird emoji/icon for visual representation */}
      <span className="text-lg select-none">🐦</span>
    </div>
  );
};

export default Bird;