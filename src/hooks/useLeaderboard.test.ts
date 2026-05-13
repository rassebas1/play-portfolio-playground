import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLeaderboard, useScoreSubmitter } from './useLeaderboard';
import type { HighScoresPort } from '@/services/highScores';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const createMockService = (overrides: Partial<HighScoresPort> = {}): HighScoresPort => ({
  fetchLeaderboard: vi.fn().mockResolvedValue([]),
  submitScore: vi.fn().mockResolvedValue(true),
  checkHealth: vi.fn().mockResolvedValue({ status: 'ok' } as any),
  ...overrides,
});

describe('useLeaderboard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.useRealTimers();
  });

  const mockScores: HighScore[] = [
    { username: 'AAA', score: 1000, created_at: '2024-01-01' },
    { username: 'BBB', score: 800, created_at: '2024-01-02' },
    { username: 'CCC', score: 600, created_at: '2024-01-03' },
  ];

  describe('initialization', () => {
    it('initializes with empty scores and loading false', () => {
      const { result } = renderHook(() => useLeaderboard('snake', 10, { autoFetch: false }));
      expect(result.current.scores).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('sets isOnline to true by default', () => {
      const { result } = renderHook(() => useLeaderboard('snake', 10, { autoFetch: false }));
      expect(result.current.isOnline).toBe(true);
    });
  });

  describe('fetchScores', () => {
    it('fetches leaderboard data successfully', async () => {
      const mockService = createMockService({
        fetchLeaderboard: vi.fn().mockResolvedValue(mockScores),
      });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      await act(async () => {
        await result.current.fetchScores();
      });

      expect(result.current.scores).toEqual(mockScores);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('handles fetch error and shows error message', async () => {
      const mockService = createMockService({
        fetchLeaderboard: vi.fn().mockRejectedValue(new Error('Failed to fetch')),
      });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      await act(async () => {
        await result.current.fetchScores();
      });

      expect(result.current.error).toBe('Failed to fetch');
      expect(result.current.loading).toBe(false);
    });

    it('respects limit parameter', async () => {
      const fetchLeaderboard = vi.fn().mockResolvedValue(mockScores);
      const mockService = createMockService({ fetchLeaderboard });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 5, { service: mockService, autoFetch: false })
      );

      await act(async () => {
        await result.current.fetchScores();
      });

      expect(fetchLeaderboard).toHaveBeenCalledWith('snake', 5, 'score');
    });

    it('respects metric parameter', async () => {
      const fetchLeaderboard = vi.fn().mockResolvedValue(mockScores);
      const mockService = createMockService({ fetchLeaderboard });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, metric: 'lines', autoFetch: false })
      );

      await act(async () => {
        await result.current.fetchScores();
      });

      expect(fetchLeaderboard).toHaveBeenCalledWith('snake', 10, 'lines');
    });
  });

  describe('auto-fetch on mount', () => {
    it('fetches scores when mounted with autoFetch: true', () => {
      const fetchLeaderboard = vi.fn().mockResolvedValue(mockScores);
      const mockService = createMockService({ fetchLeaderboard });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService })
      );

      // Hook should have initiated loading
      expect(result.current.loading).toBe(true);
    });

    it('does not auto-fetch when autoFetch is false', () => {
      const fetchLeaderboard = vi.fn();
      const mockService = createMockService({ fetchLeaderboard });

      renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      expect(fetchLeaderboard).not.toHaveBeenCalled();
    });
  });

  describe('offline handling', () => {
    it('loads cached scores when offline', async () => {
      const cachedData = { scores: mockScores, timestamp: Date.now() };
      sessionStorage.setItem('leaderboard_snake_10_score', JSON.stringify(cachedData));
      
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { autoFetch: false })
      );

      await act(async () => {
        await result.current.fetchScores();
      });

      expect(result.current.scores).toEqual(mockScores);
      expect(result.current.isOffline).toBe(true);
    });

    it('sets error message when offline with no cache', async () => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

      const fetchLeaderboard = vi.fn().mockImplementation(() => 
        Promise.reject(new Error('Network error'))
      );
      const mockService = createMockService({ fetchLeaderboard });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      await act(async () => {
        await result.current.fetchScores();
      });

      expect(result.current.error).toBe('Network error');
    });
  });

  describe('caching', () => {
    it('saves scores to cache after successful fetch', async () => {
      const mockService = createMockService({
        fetchLeaderboard: vi.fn().mockResolvedValue(mockScores),
      });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      await act(async () => {
        await result.current.fetchScores();
      });

      const cached = sessionStorage.getItem('leaderboard_snake_10_score');
      expect(cached).not.toBeNull();
    });

    it('loads from cache on fetch error', async () => {
      const cachedData = { scores: mockScores, timestamp: Date.now() };
      sessionStorage.setItem('leaderboard_snake_10_score', JSON.stringify(cachedData));

      const mockService = createMockService({
        fetchLeaderboard: vi.fn().mockRejectedValue(new Error('Network error')),
      });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      await act(async () => {
        await result.current.fetchScores();
      });

      expect(result.current.scores).toEqual(mockScores);
    });
  });

  describe('retry', () => {
    it('retries fetching scores', async () => {
      const fetchLeaderboard = vi.fn()
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce(mockScores);
      const mockService = createMockService({ fetchLeaderboard });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      await act(async () => {
        await result.current.fetchScores();
      });
      expect(result.current.error).not.toBeNull();

      await act(async () => {
        await result.current.retry();
      });
      expect(result.current.error).toBeNull();
      expect(result.current.scores).toEqual(mockScores);
    });
  });

  describe('submitScore', () => {
    it('validates username length (min)', async () => {
      const mockService = createMockService({
        submitScore: vi.fn().mockResolvedValue(true),
      });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      const session = { id: 'test', startTime: Date.now(), moves: 5, game: 'snake' };
      
      const response = await act(async () => 
        await result.current.submitScore('AB', 100, session)
      );

      expect(response).toBe(false);
      expect(result.current.error).toBe('Username must be 3-7 characters');
    });

    it('validates username length (max)', async () => {
      const mockService = createMockService({
        submitScore: vi.fn().mockResolvedValue(true),
      });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      const session = { id: 'test', startTime: Date.now(), moves: 5, game: 'snake' };
      
      const response = await act(async () => 
        await result.current.submitScore('ABCDEFGHIJ', 100, session)
      );

      expect(response).toBe(false);
      expect(result.current.error).toBe('Username must be 3-7 characters');
    });

    it('submits score successfully and refetches leaderboard', async () => {
      const submitScore = vi.fn().mockResolvedValue(true);
      const fetchLeaderboard = vi.fn().mockResolvedValue(mockScores);
      const mockService = createMockService({ submitScore, fetchLeaderboard });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      const session = { id: 'test', startTime: Date.now(), moves: 5, game: 'snake' };
      
      const response = await act(async () => 
        await result.current.submitScore('ABC', 100, session)
      );

      expect(response).toBe(true);
      expect(submitScore).toHaveBeenCalledWith({
        game: 'snake',
        username: 'ABC',
        score: 100,
        metric: 'score',
        sessionId: 'test',
        sessionDuration: expect.any(Number),
        moves: 5,
      });
    });

    it('returns false on submission failure', async () => {
      const submitScore = vi.fn().mockResolvedValue(false);
      const mockService = createMockService({ submitScore });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      const session = { id: 'test', startTime: Date.now(), moves: 5, game: 'snake' };
      
      const response = await act(async () => 
        await result.current.submitScore('ABC', 100, session)
      );

      expect(response).toBe(false);
    });

    it('uppercases username', async () => {
      const submitScore = vi.fn().mockResolvedValue(true);
      const mockService = createMockService({ submitScore });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      const session = { id: 'test', startTime: Date.now(), moves: 5, game: 'snake' };
      
      await act(async () => 
        await result.current.submitScore('abc', 100, session)
      );

      expect(submitScore).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'ABC' })
      );
    });
  });

  describe('lastFetched', () => {
    it('updates lastFetched timestamp after successful fetch', async () => {
      const mockService = createMockService({
        fetchLeaderboard: vi.fn().mockResolvedValue(mockScores),
      });

      const { result } = renderHook(() => 
        useLeaderboard('snake', 10, { service: mockService, autoFetch: false })
      );

      expect(result.current.lastFetched).toBeNull();

      await act(async () => {
        await result.current.fetchScores();
      });

      expect(result.current.lastFetched).not.toBeNull();
    });
  });
});

describe('useScoreSubmitter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('provides initial state', () => {
    const { result } = renderHook(() => useScoreSubmitter('snake'));
    expect(result.current.submitting).toBe(false);
    expect(result.current.submitted).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('validates username', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useScoreSubmitter('snake'));

    const response = await act(async () => 
      await result.current.submit('AB', 100, null)
    );

    expect(response).toBe(false);
    expect(result.current.error).toBe('Username must be 3-7 characters');
  });

  it('submits score successfully', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useScoreSubmitter('snake'));

    const session = { id: 'test', startTime: Date.now() - 5000, moves: 10, game: 'snake' };
    
    const response = await act(async () => 
      await result.current.submit('ABC', 100, session, { lines: 5 })
    );

    expect(response).toBe(true);
    expect(result.current.submitted).toBe(true);
  });

  it('handles submission error', async () => {
    mockFetch.mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useScoreSubmitter('snake'));

    const session = { id: 'test', startTime: Date.now() - 5000, moves: 10, game: 'snake' };
    
    await act(async () => 
      await result.current.submit('ABC', 100, session)
    );

    expect(result.current.error).not.toBeNull();
  });

  it('resets state', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useScoreSubmitter('snake'));

    const session = { id: 'test', startTime: Date.now() - 5000, moves: 10, game: 'snake' };
    
    await act(async () => 
      await result.current.submit('ABC', 100, session)
    );

    act(() => {
      result.current.reset();
    });

    expect(result.current.submitted).toBe(false);
    expect(result.current.error).toBeNull();
  });
});