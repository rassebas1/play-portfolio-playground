import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils'; // Utility for conditionally joining class names
import Bird from './Bird';
import Pipe from './Pipe';
import Ground from './Ground';
import type { FlappyBirdState } from '../types';
import type { GameDimensions } from '@/types/global';

/**
 * Props for the GameArea component.
 * @interface GameAreaProps
 * @property {FlappyBirdState} gameState - The current state of the Flappy Bird game.
 * @property {GameDimensions} dimensions - Object containing the width and height of the game area.
 * @property {() => void} onJump - Callback function to trigger the bird's jump action.
 * @property {string} [className] - Optional additional CSS classes to apply to the game area container.
 */
interface GameAreaProps {
  gameState: FlappyBirdState;
  dimensions: GameDimensions;
  onJump: () => void;
  className?: string;
}

/**
 * GameArea component for Flappy Bird.
 * This is the main viewport where all game elements (bird, pipes, ground, background) are rendered.
 * It also handles user interactions (clicks/touches) to make the bird jump.
 *
 * @param {GameAreaProps} { gameState, dimensions, onJump, className } - Props passed to the component.
 * @returns {JSX.Element} The rendered game area.
 */
const GameArea: React.FC<GameAreaProps> = ({
  gameState,
  dimensions,
  onJump,
  className
}) => {
  // Ref to the main game area DOM element, used for attaching event listeners.
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Inline style for setting the dimensions of the game area.
  const gameAreaStyle = {
    width: dimensions.width,
    height: dimensions.height,
  };

  /**
   * Handles click/touch events on the game area to make the bird jump.
   * Prevents default browser actions like scrolling.
   * This function is memoized using `useCallback`.
   * @param {Event} e - The event object (MouseEvent or TouchEvent).
   * @returns {void}
   */
  const handleInteraction = useCallback((e: Event) => {
    e.preventDefault(); // Prevent default browser behavior (e.g., scrolling on touch)
    onJump(); // Trigger the bird's jump action
  }, [onJump]); // Dependency on onJump ensures callback stability

  // Effect to attach and detach event listeners for touch interactions.
  useEffect(() => {
    const gameAreaElement = gameAreaRef.current;
    if (gameAreaElement) {
      // For touch devices, attach with passive: false to allow preventDefault
      gameAreaElement.addEventListener('touchstart', handleInteraction, { passive: false });
      // Note: For mouse clicks, React's `onClick` prop (used in JSX) handles `preventDefault` fine
      // without needing a manual `addEventListener` here.

      // Cleanup function: remove event listener when component unmounts or dependencies change
      return () => {
        gameAreaElement.removeEventListener('touchstart', handleInteraction);
      };
    }
  }, [handleInteraction]); // Dependency on handleInteraction ensures listener is updated if callback changes

  return (
    <div
      className={cn(
        'relative overflow-hidden border-4 border-primary/30 rounded-lg',
        'cursor-pointer select-none',
        'shadow-elegant',
        className
      )}
      style={gameAreaStyle} // Apply calculated dimensions
      onClick={handleInteraction as unknown as React.MouseEventHandler<HTMLDivElement>} // Attach click handler
      ref={gameAreaRef} // Attach ref to the DOM element
      role="button" // ARIA role for accessibility
      tabIndex={0} // Make the element focusable for keyboard interaction
      aria-label="Game area - click or tap to make bird jump" // ARIA label for accessibility
    >
      {/* Scrolling Background */}
      <div
        className="absolute inset-0 bg-repeat-x animate-scroll-bg"
        style={{
          backgroundImage: `url('/public/flappy_bird_bg.png')`, // Placeholder image, replace with actual asset
          backgroundSize: 'auto 100%', // Adjust as needed
        }}
      ></div>

      {/* Background clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-white/30 text-2xl animate-pulse">☁️</div>
        <div className="absolute top-20 right-16 text-white/20 text-xl animate-pulse delay-1000">☁️</div>
        <div className="absolute top-32 left-24 text-white/25 text-lg animate-pulse delay-2000">☁️</div>
      </div>

      {/* Sun element */}
      <div className="absolute top-8 right-8 text-4xl animate-pulse">☀️</div>

      {/* Render Pipes: Map through the pipes in the game state */}
      {gameState.pipes.map(pipe => (
        <Pipe
          key={pipe.id} // Unique key for each pipe
          pipe={pipe} // Pass pipe data
          dimensions={dimensions} // Pass game dimensions
        />
      ))}

      {/* Render Bird: The main player character */}
      <Bird
        bird={gameState.bird}
        dimensions={dimensions}
        isFlapping={gameState.bird.isFlapping}
        isGameOver={gameState.isGameOver} // Pass isGameOver prop
      />

      {/* Render Ground: The static ground element at the bottom */}
      <Ground dimensions={dimensions} />

      {/* Start instruction overlay: Shown when the game has not started and is not over */}
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

      {/* Score display: Shown when the game has started */}
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