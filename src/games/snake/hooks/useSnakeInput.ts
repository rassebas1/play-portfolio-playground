import { useEffect, useCallback } from 'react';
import { Direction, GameAction } from '../types';

interface UseSnakeInputProps {
  dispatch: React.Dispatch<GameAction>;
  gameStarted: boolean;
  gameOver: boolean;
}

export const useSnakeInput = ({ dispatch, gameStarted, gameOver }: UseSnakeInputProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!gameStarted || gameOver) return;

    let newDirection: Direction | undefined;
    switch (event.key) {
      case 'ArrowUp':
        newDirection = 'UP';
        break;
      case 'ArrowDown':
        newDirection = 'DOWN';
        break;
      case 'ArrowLeft':
        newDirection = 'LEFT';
        break;
      case 'ArrowRight':
        newDirection = 'RIGHT';
        break;
    }

    if (newDirection) {
      event.preventDefault(); // Prevent default scroll behavior
      dispatch({ type: 'CHANGE_DIRECTION', payload: newDirection });
    }
  }, [gameStarted, gameOver, dispatch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};
