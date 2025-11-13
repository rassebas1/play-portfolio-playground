import React from 'react';
import { cn } from '@/lib/utils'; // Utility for conditionally joining class names
import type { Pipe as PipeType, GameDimensions } from '../types';

/**
 * Props for the Pipe component.
 * @interface PipeProps
 * @property {PipeType} pipe - The current state of the pipe (position, dimensions, etc.).
 * @property {GameDimensions} dimensions - Object containing game area dimensions.
 * @property {string} [className] - Optional additional CSS classes to apply to the pipe elements.
 */
interface PipeProps {
  pipe: PipeType;
  dimensions: GameDimensions;
  className?: string;
}

/**
 * Pipe component for Flappy Bird.
 * Renders both the top and bottom segments of a single pipe obstacle.
 * Each pipe consists of a main body and a slightly wider cap.
 *
 * @param {PipeProps} { pipe, dimensions, className } - Props passed to the component.
 * @returns {JSX.Element} The rendered pipe obstacle.
 */
const Pipe: React.FC<PipeProps> = ({ pipe, dimensions, className }) => {
  // Calculate inline styles for the top pipe segment.
  const topPipeStyle = {
    left: pipe.x, // Horizontal position of the pipe
    top: 0,       // Top pipe starts from the top edge of the game area
    width: pipe.width, // Width of the pipe
    height: pipe.topHeight, // Dynamic height of the top pipe segment
  };

  // Calculate inline styles for the bottom pipe segment.
  const bottomPipeStyle = {
    left: pipe.x, // Horizontal position of the pipe
    top: pipe.bottomY, // Vertical position where the bottom pipe starts
    width: pipe.width, // Width of the pipe
    // Height of the bottom pipe: total game height - bottomY - ground height
    height: dimensions.height - pipe.bottomY - dimensions.groundHeight,
  };

  // Combine common CSS classes for both pipe segments using `cn` utility.
  const pipeClasses = cn(
    'absolute', // Absolute positioning within the game area
    'bg-gradient-to-r from-primary to-primary-dark', // Gradient background for pipes
    'border-2 border-primary/60', // Border for pipe segments
    'shadow-elegant', // Custom shadow
    className // Allow external classes to be passed
  );

  return (
    <>
      {/* Top Pipe Segment */}
      <div
        className={pipeClasses}
        style={topPipeStyle} // Apply calculated styles
        role="presentation" // Indicate that this element is purely decorative
        aria-label="Top pipe obstacle" // ARIA label for accessibility
      >
        {/* Pipe cap for the top pipe */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-primary-dark to-primary border-t-2 border-primary/80"
          style={{ marginLeft: -4, marginRight: -4, width: pipe.width + 8 }} // Cap is slightly wider
        />
      </div>

      {/* Bottom Pipe Segment */}
      <div
        className={pipeClasses}
        style={bottomPipeStyle} // Apply calculated styles
        role="presentation" // Indicate that this element is purely decorative
        aria-label="Bottom pipe obstacle" // ARIA label for accessibility
      >
        {/* Pipe cap for the bottom pipe */}
        <div
          className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-primary-dark to-primary border-b-2 border-primary/80"
          style={{ marginLeft: -4, marginRight: -4, width: pipe.width + 8 }} // Cap is slightly wider
        />
      </div>
    </>
  );
};

export default Pipe;