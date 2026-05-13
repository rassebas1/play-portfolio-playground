import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSnakeGame } from './useSnakeGame';

const mockUpdateHighScore = vi.fn();

vi.mock('@/hooks/useHighScores');
vi.mock('./useSnakeInput', () => ({ useSnakeInput: vi.fn() }));

import { useHighScores } from '@/hooks/useHighScores';

const createHighScoresMock = (overrides: Record<string, unknown> = {}) => ({
  highScore: null,
  updateHighScore: mockUpdateHighScore,
  highestTile: null,
  updateHighestTile: vi.fn(),
  resetHighScore: vi.fn(),
  session: null,
  startSession: vi.fn(),
  recordMove: vi.fn(),
  submitScore: vi.fn(),
  endSession: vi.fn(),
  currentMetric: 'score' as const,
  ...overrides,
});

describe('useSnakeGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(useHighScores).mockReturnValue(createHighScoresMock());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial game state', () => {
    const { result } = renderHook(() => useSnakeGame());

    expect(result.current.state.gameStarted).toBe(false);
    expect(result.current.state.gameOver).toBe(false);
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.snake).toHaveLength(3);
    expect(result.current.state.direction).toBe('UP');
    expect(result.current.state.speed).toBe(200);
    expect(result.current.state.difficulty).toBe(1);
    expect(result.current.state.food).toEqual({ x: 5, y: 5 });
    expect(result.current.highScore).toBeNull();
  });

  it('exposes all action functions', () => {
    const { result } = renderHook(() => useSnakeGame());

    expect(typeof result.current.startGame).toBe('function');
    expect(typeof result.current.resetGame).toBe('function');
    expect(typeof result.current.setDifficulty).toBe('function');
    expect(typeof result.current.dispatch).toBe('function');
  });

  it('starts the game', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame());

    expect(result.current.state.gameStarted).toBe(true);
    expect(result.current.state.gameOver).toBe(false);
    expect(result.current.state.score).toBe(0);
  });

  it.each([2, 5, 9])('starts game with difficulty %i and adjusts speed', (difficulty) => {
    const expectedSpeed = Math.max(50, 200 - (difficulty - 1) * 20);
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame(difficulty as Parameters<typeof result.current.startGame>[0]));

    expect(result.current.state.difficulty).toBe(difficulty);
    expect(result.current.state.speed).toBe(expectedSpeed);
    expect(result.current.state.gameStarted).toBe(true);
  });

  it('resets the game to initial state preserving difficulty and speed', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame(3));
    expect(result.current.state.gameStarted).toBe(true);

    act(() => result.current.resetGame());

    expect(result.current.state.gameStarted).toBe(false);
    expect(result.current.state.gameOver).toBe(false);
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.snake).toHaveLength(3);
    expect(result.current.state.difficulty).toBe(3);
    expect(result.current.state.speed).toBe(160);
  });

  it('sets difficulty via setDifficulty', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.setDifficulty(5));

    expect(result.current.state.gameStarted).toBe(false);
    expect(result.current.state.difficulty).toBe(5);
    expect(result.current.state.speed).toBe(120);
  });

  it('moves the snake one step per interval tick', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame());

    const initialHead = { ...result.current.state.snake[0] };

    act(() => vi.advanceTimersByTime(200));

    expect(result.current.state.snake[0]).toEqual({
      x: initialHead.x,
      y: initialHead.y - 1,
    });
  });

  it('collides with top wall after moving up 11 times and sets game over', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame());

    act(() => vi.advanceTimersByTime(2200));

    expect(result.current.state.gameOver).toBe(true);
    expect(result.current.state.snake[0]).toEqual({ x: 10, y: 0 });
  });

  it('stops the game loop after game over', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame());
    act(() => vi.advanceTimersByTime(2200));
    expect(result.current.state.gameOver).toBe(true);

    const headAfterCollision = { ...result.current.state.snake[0] };

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.state.snake[0]).toEqual(headAfterCollision);
  });

  it('moves the head two cells when advancing two ticks', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame());

    act(() => vi.advanceTimersByTime(400));

    expect(result.current.state.snake[0]).toEqual({ x: 10, y: 8 });
  });

  it('eats food at (5, 5), increases score, and grows the snake', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame(1));

    act(() => vi.advanceTimersByTime(1000));
    act(() => result.current.dispatch({ type: 'CHANGE_DIRECTION', payload: 'LEFT' }));
    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.state.score).toBe(1);
    expect(result.current.state.snake).toHaveLength(4);
    expect(result.current.state.food).not.toEqual({ x: 5, y: 5 });

    vi.restoreAllMocks();
  });

  it('updates high score when game over with positive score', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame(1));

    act(() => vi.advanceTimersByTime(1000));
    act(() => result.current.dispatch({ type: 'CHANGE_DIRECTION', payload: 'LEFT' }));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1200));

    expect(result.current.state.gameOver).toBe(true);
    expect(result.current.state.score).toBe(1);
    expect(mockUpdateHighScore).toHaveBeenCalledWith(1, 'highest');

    vi.restoreAllMocks();
  });

  it('does NOT update high score when game over with zero score', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame());
    act(() => vi.advanceTimersByTime(2200));

    expect(result.current.state.gameOver).toBe(true);
    expect(result.current.state.score).toBe(0);
    expect(mockUpdateHighScore).not.toHaveBeenCalled();
  });

  it('returns the highScore value from useHighScores', () => {
    vi.mocked(useHighScores).mockReturnValueOnce(
      createHighScoresMock({ highScore: 100 })
    );

    const { result } = renderHook(() => useSnakeGame());

    expect(result.current.highScore).toBe(100);
  });

  it('calls useHighScores with snake-game id', () => {
    renderHook(() => useSnakeGame());

    expect(useHighScores).toHaveBeenCalledWith('snake-game');
  });

  it('only updates high score once even with multiple idle ticks after game over', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame(1));

    act(() => vi.advanceTimersByTime(1000));
    act(() => result.current.dispatch({ type: 'CHANGE_DIRECTION', payload: 'LEFT' }));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1200));
    act(() => vi.advanceTimersByTime(2000));

    expect(mockUpdateHighScore).toHaveBeenCalledTimes(1);

    vi.restoreAllMocks();
  });

  it('does not trigger high score update while game is still playing', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => result.current.startGame());
    act(() => vi.advanceTimersByTime(400));

    expect(result.current.state.gameOver).toBe(false);
    expect(mockUpdateHighScore).not.toHaveBeenCalled();
  });
});
