import React, { useState, useCallback } from 'react';

type SwipeDirection = 'up' | 'down' | 'left' | 'right' | null;

interface UseSwipeGestureProps {
  onSwipe: (direction: SwipeDirection) => void;
  minSwipeDistance?: number;
}

export const useSwipeGesture = ({ onSwipe, minSwipeDistance = 50 }: UseSwipeGestureProps) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    let direction: SwipeDirection = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        direction = deltaX > 0 ? 'right' : 'left';
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        direction = deltaY > 0 ? 'down' : 'up';
      }
    }

    onSwipe(direction);

    // Reset touch coordinates
    setTouchStartX(null);
    setTouchStartY(null);
  }, [onSwipe, minSwipeDistance, touchStartX, touchStartY]);

  return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd };
};