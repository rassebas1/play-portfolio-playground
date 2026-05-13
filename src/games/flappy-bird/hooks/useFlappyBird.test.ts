import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlappyBird } from './useFlappyBird';
import type { Bird, Pipe, CollisionResult } from '@/games/flappy-bird/types';

const { mockUpdateHighScore } = vi.hoisted(() => {
  const muh = vi.fn();
  return { mockUpdateHighScore: muh };
});

vi.mock('./gameLogic', () => ({
  createInitialBird: vi.fn(
    (): Bird => ({ x: 100, y: 300, velocity: 0, rotation: 0, isFlapping: false }),
  ),
  updateBirdPhysics: vi.fn(
    (bird: Bird): Bird => ({
      ...bird,
      y: bird.y + bird.velocity + 0.6,
      velocity: Math.min(bird.velocity + 0.6, 15),
      rotation: Math.max(-30, Math.min(90, (bird.velocity + 0.6) * 3)),
    }),
  ),
  updatePipes: vi.fn(
    (pipes: Pipe[], _birdX: number): { pipes: Pipe[]; scoreIncrease: number } => ({
      pipes,
      scoreIncrease: 0,
    }),
  ),
  generatePipesIfNeeded: vi.fn(
    (pipes: Pipe[], _currentTime: number, _lastPipeTime: number): Pipe[] => pipes,
  ),
  checkCollision: vi.fn(
    (_bird: Bird, _pipes: Pipe[]): CollisionResult => ({ hasCollision: false }),
  ),
  birdJump: vi.fn(
    (bird: Bird): Bird => ({ ...bird, velocity: -10, isFlapping: true }),
  ),
}));

vi.mock('@/hooks/useHighScores', () => ({
  useHighScores: vi.fn(() => ({
    highScore: null,
    updateHighScore: mockUpdateHighScore,
    resetHighScore: vi.fn(),
  })),
}));

import * as gameLogic from './gameLogic';

describe('useFlappyBird', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should return bird at start position with no pipes', () => {
      const { result } = renderHook(() => useFlappyBird());

      expect(result.current.gameState.bird).toEqual({
        x: 100,
        y: 300,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      });
      expect(result.current.gameState.pipes).toEqual([]);
      expect(result.current.gameState.score).toBe(0);
      expect(result.current.gameState.isPlaying).toBe(false);
      expect(result.current.gameState.isGameOver).toBe(false);
      expect(result.current.gameState.gameStarted).toBe(false);
    });

    it('should return game dimensions', () => {
      const { result } = renderHook(() => useFlappyBird());

      expect(result.current.gameDimensions).toEqual({
        width: 400,
        height: 600,
        groundHeight: 80,
        birdSize: 40,
      });
    });

    it('should provide all control functions', () => {
      const { result } = renderHook(() => useFlappyBird());

      expect(typeof result.current.jump).toBe('function');
      expect(typeof result.current.startNewGame).toBe('function');
      expect(typeof result.current.startPlaying).toBe('function');
      expect(typeof result.current.restartGame).toBe('function');
    });
  });

  describe('startNewGame', () => {
    it('should reset bird and pipes, transition to ready state', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());

      expect(gameLogic.createInitialBird).toHaveBeenCalled();
      expect(result.current.gameState.bird).toEqual({
        x: 100,
        y: 300,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      });
      expect(result.current.gameState.pipes).toEqual([]);
      expect(result.current.gameState.gameStarted).toBe(true);
      expect(result.current.gameState.isPlaying).toBe(false);
      expect(result.current.gameState.isGameOver).toBe(false);
      expect(result.current.gameState.score).toBe(0);
    });
  });

  describe('startPlaying', () => {
    it('should transition from ready to playing', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());

      expect(result.current.gameState.isPlaying).toBe(true);
      expect(result.current.gameState.gameStarted).toBe(true);
    });

    it('should not transition if game has not been started', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startPlaying());

      expect(result.current.gameState.isPlaying).toBe(false);
    });

    it('should not transition if already playing', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      act(() => result.current.startPlaying());

      expect(result.current.gameState.isPlaying).toBe(true);
    });

    it('should not transition if game is over', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      (gameLogic.checkCollision as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        hasCollision: true,
        collisionType: 'pipe',
      });
      act(() => vi.advanceTimersByTime(16));
      act(() => result.current.startPlaying());

      expect(result.current.gameState.isPlaying).toBe(false);
    });
  });

  describe('jump', () => {
    it('should apply upward velocity when playing', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      act(() => result.current.jump());

      expect(gameLogic.birdJump).toHaveBeenCalledTimes(1);
      expect(result.current.gameState.bird.velocity).toBe(-10);
      expect(result.current.gameState.bird.isFlapping).toBe(true);
    });

    it('should be ignored when game is not playing', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.jump());

      expect(gameLogic.birdJump).not.toHaveBeenCalled();
    });

    it('should be ignored when game is over', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      (gameLogic.checkCollision as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        hasCollision: true,
        collisionType: 'pipe',
      });
      act(() => vi.advanceTimersByTime(16));
      act(() => result.current.jump());

      expect(gameLogic.birdJump).not.toHaveBeenCalled();
    });

    it('should be ignored before game is started', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.jump());

      expect(gameLogic.birdJump).not.toHaveBeenCalled();
    });
  });

  describe('game loop', () => {
    it('should run game loop when playing and stop when not', () => {
      const { result } = renderHook(() => useFlappyBird());

      expect(gameLogic.updateBirdPhysics).not.toHaveBeenCalled();

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      act(() => vi.advanceTimersByTime(32));

      expect(gameLogic.updateBirdPhysics).toHaveBeenCalled();
      expect(gameLogic.updatePipes).toHaveBeenCalled();
      expect(gameLogic.generatePipesIfNeeded).toHaveBeenCalled();
      expect(gameLogic.checkCollision).toHaveBeenCalled();
    });

    it('should apply gravity each frame and move bird downward', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      const yBefore = result.current.gameState.bird.y;

      act(() => vi.advanceTimersByTime(16));

      expect(result.current.gameState.bird.y).toBeGreaterThan(yBefore);
    });

    it('should call updateBirdPhysics with the current bird state', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      const birdBefore = { ...result.current.gameState.bird };
      act(() => result.current.startPlaying());
      act(() => vi.advanceTimersByTime(16));

      expect(gameLogic.updateBirdPhysics).toHaveBeenCalledWith(birdBefore);
    });

    it('should call updatePipes with current pipes and bird x position', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      act(() => vi.advanceTimersByTime(16));

      expect(gameLogic.updatePipes).toHaveBeenCalledWith([], 100);
    });

    it('should call generatePipesIfNeeded with updated pipes, time, and lastPipeRef', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      act(() => vi.advanceTimersByTime(16));

      expect(gameLogic.generatePipesIfNeeded).toHaveBeenCalledWith(
        [],
        expect.any(Number),
        0,
      );
    });

    it('should call checkCollision with updated bird and pipes', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      act(() => vi.advanceTimersByTime(16));

      expect(gameLogic.checkCollision).toHaveBeenCalledWith(
        expect.objectContaining({ x: 100 }),
        [],
      );
    });
  });

  describe('scoring', () => {
    it('should increase score when updatePipes returns scoreIncrease', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      (gameLogic.updatePipes as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        pipes: [],
        scoreIncrease: 1,
      });
      act(() => vi.advanceTimersByTime(16));

      expect(result.current.gameState.score).toBe(1);
    });

    it('should accumulate score over multiple frames', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());

      (gameLogic.updatePipes as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        pipes: [],
        scoreIncrease: 2,
      });
      act(() => vi.advanceTimersByTime(16));
      expect(result.current.gameState.score).toBe(2);

      (gameLogic.updatePipes as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        pipes: [],
        scoreIncrease: 3,
      });
      act(() => vi.advanceTimersByTime(16));
      expect(result.current.gameState.score).toBe(5);
    });

    it('should reset score on restart', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      (gameLogic.updatePipes as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        pipes: [],
        scoreIncrease: 5,
      });
      act(() => vi.advanceTimersByTime(16));
      expect(result.current.gameState.score).toBe(5);

      act(() => result.current.restartGame());
      expect(result.current.gameState.score).toBe(0);
    });
  });

  describe('collision', () => {
    it('should trigger game over on pipe collision', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      (gameLogic.checkCollision as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        hasCollision: true,
        collisionType: 'pipe',
      });
      act(() => vi.advanceTimersByTime(16));

      expect(result.current.gameState.isGameOver).toBe(true);
      expect(result.current.gameState.isPlaying).toBe(false);
    });

    it('should trigger game over on ground collision', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      (gameLogic.checkCollision as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        hasCollision: true,
        collisionType: 'ground',
      });
      act(() => vi.advanceTimersByTime(16));

      expect(result.current.gameState.isGameOver).toBe(true);
    });

    it('should trigger game over on ceiling collision', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      (gameLogic.checkCollision as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        hasCollision: true,
        collisionType: 'ceiling',
      });
      act(() => vi.advanceTimersByTime(16));

      expect(result.current.gameState.isGameOver).toBe(true);
    });

    it('should stop the game loop after collision', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      (gameLogic.checkCollision as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        hasCollision: true,
        collisionType: 'pipe',
      });
      act(() => vi.advanceTimersByTime(16));

      const updateBirdPhysicsMock = gameLogic.updateBirdPhysics as ReturnType<typeof vi.fn>;
      const callsBefore = updateBirdPhysicsMock.mock.calls.length;
      act(() => vi.advanceTimersByTime(100));

      expect(updateBirdPhysicsMock.mock.calls.length).toBe(callsBefore);
    });

    it('should not trigger game over when no collision', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      act(() => vi.advanceTimersByTime(50));

      expect(result.current.gameState.isGameOver).toBe(false);
      expect(result.current.gameState.isPlaying).toBe(true);
    });
  });

  describe('high score', () => {
    it('should update high score each frame via setBestScore', () => {
      renderHook(() => useFlappyBird());

      act(() => vi.advanceTimersByTime(16));

      expect(mockUpdateHighScore).not.toHaveBeenCalled();
    });

    it('should update high score when score increases during gameplay', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      (gameLogic.updatePipes as ReturnType<typeof vi.fn>).mockReturnValueOnce({
        pipes: [],
        scoreIncrease: 3,
      });
      act(() => vi.advanceTimersByTime(16));

      expect(result.current.gameState.score).toBe(3);
      expect(mockUpdateHighScore).toHaveBeenCalledWith(3, 'highest');
    });

    it('should expose highScore in game state', () => {
      const { result } = renderHook(() => useFlappyBird());

      expect(result.current.gameState.highScore).toBeNull();
    });
  });

  describe('restartGame', () => {
    it('should reset all state for a new game', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      act(() => vi.advanceTimersByTime(32));
      act(() => result.current.restartGame());

      expect(gameLogic.createInitialBird).toHaveBeenCalled();
      expect(result.current.gameState.bird).toEqual({
        x: 100,
        y: 300,
        velocity: 0,
        rotation: 0,
        isFlapping: false,
      });
      expect(result.current.gameState.pipes).toEqual([]);
      expect(result.current.gameState.score).toBe(0);
      expect(result.current.gameState.isPlaying).toBe(false);
      expect(result.current.gameState.isGameOver).toBe(false);
      expect(result.current.gameState.gameStarted).toBe(true);
    });
  });

  describe('isFlapping', () => {
    it('should reset isFlapping after 100ms timeout', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => result.current.startPlaying());
      act(() => result.current.jump());

      expect(result.current.gameState.bird.isFlapping).toBe(true);

      act(() => vi.advanceTimersByTime(100));

      expect(result.current.gameState.bird.isFlapping).toBe(false);
    });
  });

  describe('game loop lifecycle', () => {
    it('should not start game loop when isPlaying is false', () => {
      renderHook(() => useFlappyBird());

      act(() => vi.advanceTimersByTime(50));

      expect(gameLogic.updateBirdPhysics).not.toHaveBeenCalled();
    });

    it('should not start game loop when game is not started', () => {
      const { result } = renderHook(() => useFlappyBird());

      act(() => result.current.startNewGame());
      act(() => vi.advanceTimersByTime(50));

      expect(gameLogic.updateBirdPhysics).not.toHaveBeenCalled();
    });
  });
});
