import React from 'react';
import { cn } from '@/lib/utils'; // Utility for conditionally joining class names
import type { GameDimensions } from '../types';

/**
 * Props for the Ground component.
 * @interface GroundProps
 * @property {GameDimensions} dimensions - Object containing game area dimensions, specifically `groundHeight`.
 * @property {string} [className] - Optional additional CSS classes to apply to the ground element.
 */
interface GroundProps {
  dimensions: GameDimensions;
  className?: string;
}

/**
 * Ground component for Flappy Bird.
 * Renders the static ground element at the bottom of the game area.
 * It includes visual styling and decorative elements.
 *
 * @param {GroundProps} { dimensions, className } - Props passed to the component.
 * @returns {JSX.Element} The rendered ground element.
 */
const Ground: React.FC<GroundProps> = ({ dimensions, className }) => {
  // Calculate inline styles for positioning and size of the ground.
  const groundStyle = {
    bottom: 0, // Position at the bottom of its parent container
    width: dimensions.width, // Match the width of the game area
    height: dimensions.groundHeight, // Use the predefined ground height
  };

  return (
    <div
      className={cn(
        'absolute left-0', // Position absolutely at the bottom-left
        'bg-gradient-to-t from-muted-dark to-muted', // Gradient background for ground
        'border-t-4 border-primary/40', // Top border to separate from game area
        'z-10', // Ensure ground is above background but below bird/pipes
        className // Allow external classes to be passed
      )}
      style={groundStyle} // Apply calculated inline styles
      role="presentation" // Indicate that this element is purely decorative
      aria-label="Ground" // ARIA label for accessibility
    >
      {/* Ground pattern/texture for visual depth */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
      </div>
      
      {/* Decorative ground details (e.g., grass/plants) */}
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