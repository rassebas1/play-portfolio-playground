import React, { useState, useCallback } from 'react';

/**
 * Type definition for the possible swipe directions.
 * @typedef {'up' | 'down' | 'left' | 'right' | null} SwipeDirection
 */
type SwipeDirection = 'up' | 'down' | 'left' | 'right' | null;

/**
 * Props for the useSwipeGesture hook.
 * @interface UseSwipeGestureProps
 * @property {(direction: SwipeDirection) => void} onSwipe - Callback function to be executed when a swipe gesture is detected.
 *                                                          It receives the detected direction ('up', 'down', 'left', 'right', or null).
 * @property {number} [minSwipeDistance=50] - The minimum distance in pixels a touch must travel to be considered a swipe.
 *                                            Defaults to 50 pixels.
 */
interface UseSwipeGestureProps {
  onSwipe: (direction: SwipeDirection) => void;
  minSwipeDistance?: number;
}

export const useSwipeGesture = ({ onSwipe, minSwipeDistance = 25 }: UseSwipeGestureProps) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  // State to store the starting Y coordinate of a touch event.
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  /**
   * Handles the `touchstart` event. Records the initial touch coordinates.
   * This function is memoized using `useCallback`.
   * @param {React.TouchEvent} e - The React touch event object.
   * @returns {void}
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]; // Get the first touch point.
    setTouchStartX(touch.clientX); // Store starting X.
    setTouchStartY(touch.clientY); // Store starting Y.
  }, []); // No dependencies, stable callback.

  /**
   * Handles the `touchend` event. Calculates the swipe distance and direction,
   * then calls the `onSwipe` callback.
   * This function is memoized using `useCallback`.
   * @param {React.TouchEvent} e - The React touch event object.
   * @returns {void}
   */
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // If touchStartX or touchStartY are null, it means touchstart wasn't properly recorded.
    if (touchStartX === null || touchStartY === null) return;

    const touch = e.changedTouches[0]; // Get the touch point that ended.
    const deltaX = touch.clientX - touchStartX; // Calculate horizontal distance moved.
    const deltaY = touch.clientY - touchStartY; // Calculate vertical distance moved.

    let direction: SwipeDirection = null; // Initialize direction to null.

    // Determine if the swipe is primarily horizontal or vertical.
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        // If swipe distance exceeds minimum, determine left or right.
        direction = deltaX > 0 ? 'right' : 'left';
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        // If swipe distance exceeds minimum, determine up or down.
        direction = deltaY > 0 ? 'down' : 'up';
      }
    }

    onSwipe(direction); // Call the provided onSwipe callback with the detected direction.

    // Reset touch coordinates for the next gesture.
    setTouchStartX(null);
    setTouchStartY(null);
  }, [onSwipe, minSwipeDistance, touchStartX, touchStartY]); // Dependencies for callback stability.

  // Return the event handlers to be attached to a DOM element.
  return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd };
};