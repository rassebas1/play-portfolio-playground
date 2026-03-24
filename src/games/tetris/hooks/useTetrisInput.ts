/**
 * Tetris Input Hook
 * Handles keyboard and touch controls for the game
 */

import { useEffect, useCallback, useRef } from 'react';
import { TetrisControls } from '../types';

interface UseTetrisInputOptions {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotateClockwise: () => void;
  onRotateCounterclockwise: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  onPause: () => void;
  isPlaying: boolean;
}

export const useTetrisInput = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotateClockwise,
  onRotateCounterclockwise,
  onHardDrop,
  onHold,
  onPause,
  isPlaying,
}: UseTetrisInputOptions): { onKeyDown: (e: KeyboardEvent) => void } => {
  // Track if soft drop is active (down arrow held)
  const softDropRef = useRef(false);
  const softDropIntervalRef = useRef<number | null>(null);

  // Handle key down events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default for game keys
      const gameKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowDown',
        'ArrowUp',
        ' ',
        'x',
        'z',
        'c',
        'p',
        'Escape',
      ];

      if (!gameKeys.includes(e.key) && !e.key.toLowerCase().startsWith('arrow')) {
        return;
      }

      // Pause with Escape or P
      if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        onPause();
        return;
      }

      // Don't process other keys if not playing
      if (!isPlaying) return;

      e.preventDefault();

      switch (e.key) {
        case 'ArrowLeft':
          onMoveLeft();
          break;
        case 'ArrowRight':
          onMoveRight();
          break;
        case 'ArrowDown':
          // Start soft drop
          if (!softDropRef.current) {
            softDropRef.current = true;
            onMoveDown();
            // Continue soft drop every 50ms
            softDropIntervalRef.current = window.setInterval(() => {
              onMoveDown();
            }, 50);
          }
          break;
        case 'ArrowUp':
        case 'x':
        case 'X':
          onRotateClockwise();
          break;
        case 'z':
        case 'Z':
          onRotateCounterclockwise();
          break;
        case ' ':
          onHardDrop();
          break;
        case 'c':
        case 'C':
          onHold();
          break;
        default:
          break;
      }
    },
    [
      isPlaying,
      onMoveLeft,
      onMoveRight,
      onMoveDown,
      onRotateClockwise,
      onRotateCounterclockwise,
      onHardDrop,
      onHold,
      onPause,
    ]
  );

  // Handle key up events
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      softDropRef.current = false;
      if (softDropIntervalRef.current) {
        clearInterval(softDropIntervalRef.current);
        softDropIntervalRef.current = null;
      }
    }
  }, []);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (softDropIntervalRef.current) {
        clearInterval(softDropIntervalRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp]);

  return { onKeyDown: handleKeyDown };
};

// Swipe direction types for mobile
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

// Hook to detect swipe gestures
export const useTetrisSwipe = (
  options: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onTap?: () => void;
  },
  enabled: boolean = true
) => {
  const touchStartRef = { x: 0, y: 0 };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.x = e.touches[0].clientX;
    touchStartRef.y = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const dx = touchEndX - touchStartRef.x;
      const dy = touchEndY - touchStartRef.y;
      const minSwipeDistance = 30;

      // Determine if it's a swipe or tap
      if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
        // It's a tap - rotate clockwise
        options.onTap?.();
        return;
      }

      // Determine swipe direction
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > minSwipeDistance) {
          options.onSwipeRight?.();
        } else if (dx < -minSwipeDistance) {
          options.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (dy > minSwipeDistance) {
          options.onSwipeDown?.();
        } else if (dy < -minSwipeDistance) {
          options.onSwipeUp?.();
        }
      }
    },
    [enabled, options]
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};
