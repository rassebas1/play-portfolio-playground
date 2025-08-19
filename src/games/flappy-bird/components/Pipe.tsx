import React from 'react';
import { cn } from '@/lib/utils';
import type { Pipe as PipeType, GameDimensions } from '../types';

/**
 * Props for the Pipe component
 */
interface PipeProps {
  pipe: PipeType;
  dimensions: GameDimensions;
  className?: string;
}

/**
 * Pipe component for Flappy Bird
 * Renders both top and bottom pipe segments
 */
const Pipe: React.FC<PipeProps> = ({ pipe, dimensions, className }) => {
  const topPipeStyle = {
    left: pipe.x,
    top: 0,
    width: pipe.width,
    height: pipe.topHeight,
  };

  const bottomPipeStyle = {
    left: pipe.x,
    top: pipe.bottomY,
    width: pipe.width,
    height: dimensions.height - pipe.bottomY - dimensions.groundHeight,
  };

  const pipeClasses = cn(
    'absolute',
    'bg-gradient-to-r from-primary to-primary-dark',
    'border-2 border-primary/60',
    'shadow-elegant',
    className
  );

  return (
    <>
      {/* Top Pipe */}
      <div
        className={pipeClasses}
        style={topPipeStyle}
        role="presentation"
        aria-label="Top pipe obstacle"
      >
        {/* Pipe cap */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-primary-dark to-primary border-t-2 border-primary/80"
          style={{ marginLeft: -4, marginRight: -4, width: pipe.width + 8 }}
        />
      </div>

      {/* Bottom Pipe */}
      <div
        className={pipeClasses}
        style={bottomPipeStyle}
        role="presentation"
        aria-label="Bottom pipe obstacle"
      >
        {/* Pipe cap */}
        <div
          className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-primary-dark to-primary border-b-2 border-primary/80"
          style={{ marginLeft: -4, marginRight: -4, width: pipe.width + 8 }}
        />
      </div>
    </>
  );
};

export default Pipe;