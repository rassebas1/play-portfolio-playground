import React from 'react';
import { cn } from '@/lib/utils';
import Bird from './Bird';
import Pipe from './Pipe';
import Ground from './Ground';
import type { FlappyBirdState, GameDimensions } from '../types';

/**
 * Props for the GameArea component
 */
interface GameAreaProps {
  gameState: FlappyBirdState;
  dimensions: GameDimensions;
  onJump: () => void;
  className?: string;
}

/**
 * GameArea component for Flappy Bird
 * Main game viewport containing all game elements
 */
const GameArea: React.FC<GameAreaProps> = ({ 
  gameState, 
  dimensions, 
  onJump, 
  className 
}) => {
  const gameAreaStyle = {
    width: dimensions.width,
    height: dimensions.height,
  };

  /**
   * Handles click/touch events for jumping
   */
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    onJump();
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden border-4 border-primary/30 rounded-lg',
        'bg-gradient-to-b from-sky-200 via-sky-300 to-sky-400',
        'dark:from-sky-800 dark:via-sky-900 dark:to-slate-900',
        'cursor-pointer select-none',
        'shadow-elegant',
        className
      )}
      style={gameAreaStyle}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      role="button"
      tabIndex={0}
      aria-label="Game area - click or tap to make bird jump"
    >
      {/* Background clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-white/30 text-2xl animate-pulse">☁️</div>
        <div className="absolute top-20 right-16 text-white/20 text-xl animate-pulse delay-1000">☁️</div>
        <div className="absolute top-32 left-24 text-white/25 text-lg animate-pulse delay-2000">☁️</div>
      </div>

      {/* Sun */}
      <div className="absolute top-8 right-8 text-4xl animate-pulse">☀️</div>

      {/* Pipes */}
      {gameState.pipes.map(pipe => (
        <Pipe
          key={pipe.id}
          pipe={pipe}
          dimensions={dimensions}
        />
      ))}

      {/* Bird */}
      <Bird
        bird={gameState.bird}
        dimensions={dimensions}
      />

      {/* Ground */}
      <Ground dimensions={dimensions} />

      {/* Start instruction overlay */}
      {!gameState.gameStarted && !gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-30">
          <div className="text-center text-white">
            <div className="text-4xl mb-4 animate-bounce">🐦</div>
            <h3 className="text-2xl font-bold mb-2">Flappy Bird</h3>
            <p className="text-lg mb-4">Click or tap to start!</p>
            <p className="text-sm opacity-80">Keep clicking to stay airborne</p>
          </div>
        </div>
      )}

      {/* Score display */}
      {gameState.gameStarted && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-2xl font-bold">
            {gameState.score}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameArea;