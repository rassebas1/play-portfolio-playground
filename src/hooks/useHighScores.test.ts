import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHighScores } from './useHighScores';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useHighScores', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    mockFetch.mockReset();
  });

  describe('initialization', () => {
    it('initializes with null high score when nothing is stored', () => {
      const { result } = renderHook(() => useHighScores('snake-game'));
      expect(result.current.highScore).toBeNull();
    });

    it('loads existing high score from localStorage', () => {
      localStorage.setItem('highScore_snake-game_score', '1500');
      const { result } = renderHook(() => useHighScores('snake-game'));
      expect(result.current.highScore).toBe(1500);
    });

    it('loads existing highest tile from localStorage for 2048', () => {
      localStorage.setItem('highestTile_2048', '2048');
      const { result } = renderHook(() => useHighScores('2048'));
      expect(result.current.highestTile).toBe(2048);
    });

    it('uses metric-specific localStorage key', () => {
      localStorage.setItem('highScore_snake-game_score', '1000');
      localStorage.setItem('highScore_snake-game_lines', '500');
      
      const { result: scoreResult } = renderHook(() => useHighScores('snake-game', 'score'));
      const { result: linesResult } = renderHook(() => useHighScores('snake-game', 'lines'));
      
      expect(scoreResult.current.highScore).toBe(1000);
      expect(linesResult.current.highScore).toBe(500);
    });
  });

  describe('updateHighScore', () => {
    it('updates high score when new score is higher (default strategy)', () => {
      const { result } = renderHook(() => useHighScores('snake-game'));
      
      act(() => {
        result.current.updateHighScore(100);
      });
      
      expect(result.current.highScore).toBe(100);
    });

    it('keeps existing score when new score is lower', () => {
      localStorage.setItem('highScore_snake-game_score', '500');
      const { result } = renderHook(() => useHighScores('snake-game'));
      
      act(() => {
        result.current.updateHighScore(100);
      });
      
      expect(result.current.highScore).toBe(500);
    });

    it('updates score with lowest strategy', () => {
      localStorage.setItem('highScore_snake-game_score', '500');
      const { result } = renderHook(() => useHighScores('snake-game'));
      
      act(() => {
        result.current.updateHighScore(100, 'lowest');
      });
      
      expect(result.current.highScore).toBe(100);
    });

    it('replaces score when new score is lower with lowest strategy', () => {
      const { result } = renderHook(() => useHighScores('snake-game'));
      
      act(() => {
        result.current.updateHighScore(500, 'lowest');
      });
      
      expect(result.current.highScore).toBe(500);
      
      act(() => {
        result.current.updateHighScore(100, 'lowest');
      });
      
      expect(result.current.highScore).toBe(100);
    });

    it('persists updated score to localStorage', () => {
      const { result } = renderHook(() => useHighScores('brick-breaker'));
      
      act(() => {
        result.current.updateHighScore(2000);
      });
      
      expect(localStorage.getItem('highScore_brick-breaker_score')).toBe('2000');
    });
  });

  describe('updateHighestTile', () => {
    it('updates highest tile when new tile is higher', () => {
      const { result } = renderHook(() => useHighScores('2048'));
      
      act(() => {
        result.current.updateHighestTile(512);
      });
      
      expect(result.current.highestTile).toBe(512);
    });

    it('keeps existing tile when new tile is lower', () => {
      localStorage.setItem('highestTile_2048', '1024');
      const { result } = renderHook(() => useHighScores('2048'));
      
      act(() => {
        result.current.updateHighestTile(256);
      });
      
      expect(result.current.highestTile).toBe(1024);
    });

    it('persists highest tile to localStorage', () => {
      const { result } = renderHook(() => useHighScores('2048'));
      
      act(() => {
        result.current.updateHighestTile(2048);
      });
      
      expect(localStorage.getItem('highestTile_2048')).toBe('2048');
    });
  });

  describe('resetHighScore', () => {
    it('resets high score and highest tile to null', () => {
      localStorage.setItem('highScore_snake-game_score', '1000');
      localStorage.setItem('highestTile_2048', '2048');
      const { result } = renderHook(() => useHighScores('snake-game'));
      
      act(() => {
        result.current.resetHighScore();
      });
      
      expect(result.current.highScore).toBeNull();
      expect(result.current.highestTile).toBeNull();
    });

    it('removes values from localStorage', () => {
      localStorage.setItem('highScore_snake-game_score', '1000');
      localStorage.setItem('highestTile_2048', '2048');
      const { result } = renderHook(() => useHighScores('snake-game'));
      
      act(() => {
        result.current.resetHighScore();
      });
      
      expect(localStorage.getItem('highScore_snake-game_score')).toBeNull();
    });
  });

describe('session management', () => {
    it('creates session when startSession is called for allowed game', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      
      const { result } = renderHook(() => useHighScores('snake'));
      
      act(() => {
        result.current.startSession();
      });
      
      let submitResult = false;
      await act(async () => {
        submitResult = await result.current.submitScore(100);
      });
      
      expect(submitResult).toBe(true);
      expect(mockFetch).toHaveBeenCalled();
    });

    it('does not create session for non-allowed game', async () => {
      const { result } = renderHook(() => useHighScores('tic-tac-toe'));
      
      act(() => {
        result.current.startSession();
      });
      
      let submitResult = true;
      await act(async () => {
        submitResult = await result.current.submitScore(100);
      });
      
      expect(submitResult).toBe(false);
    });

    it('increments move count when recordMove is called', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      
      const { result } = renderHook(() => useHighScores('snake'));
      
      act(() => {
        result.current.startSession();
        result.current.recordMove();
        result.current.recordMove();
      });

      let submitResult = false;
      await act(async () => {
        submitResult = await result.current.submitScore(100);
      });
      
      expect(submitResult).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: expect.stringContaining('"moves":2'),
        })
      );
    });

    it('ends session when endSession is called', async () => {
      const { result } = renderHook(() => useHighScores('snake'));
      
      act(() => {
        result.current.startSession();
        result.current.endSession();
      });
      
      let submitResult = true;
      await act(async () => {
        submitResult = await result.current.submitScore(100);
      });
      
      expect(submitResult).toBe(false);
    });
  });

  describe('submitScore', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
    });

    it('returns false when server sync is disabled', async () => {
      const { result } = renderHook(() => useHighScores('snake', 'score', false));
      
      act(() => {
        result.current.startSession();
      });
      
      let response = false;
      await act(async () => {
        response = await result.current.submitScore(100);
      });
      
      expect(response).toBe(false);
    });

    it('returns false when no session exists', async () => {
      const { result } = renderHook(() => useHighScores('snake'));
      
      let response = false;
      await act(async () => {
        response = await result.current.submitScore(100);
      });
      
      expect(response).toBe(false);
    });

    it('submits score to server successfully', async () => {
      const { result } = renderHook(() => useHighScores('snake', 'score', true));
      
      act(() => {
        result.current.startSession();
      });
      
      let response = false;
      await act(async () => {
        response = await result.current.submitScore(500);
      });
      
      expect(response).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/scores'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );
    });

    it('returns false when server submission fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useHighScores('snake', 'score', true));
      
      act(() => {
        result.current.startSession();
      });
      
      let response = true;
      await act(async () => {
        response = await result.current.submitScore(500);
      });
      
      expect(response).toBe(false);
    });
  });

  describe('error handling', () => {
    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('highScore_snake-game_score', 'not-a-number');
      
      const { result } = renderHook(() => useHighScores('snake-game'));
      
      expect(result.current.highScore).toBeNull();
    });

    it('handles localStorage quota exceeded', () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Quota exceeded');
      });
      
      const { result } = renderHook(() => useHighScores('snake-game'));
      
      act(() => {
        result.current.updateHighScore(100);
      });
      
      expect(result.current.highScore).toBe(100);
    });
  });

  describe('currentMetric', () => {
    it('returns the current metric being tracked', () => {
      const { result } = renderHook(() => useHighScores('tetris', 'lines'));
      expect(result.current.currentMetric).toBe('lines');
    });

    it('defaults to score when no metric specified', () => {
      const { result } = renderHook(() => useHighScores('snake'));
      expect(result.current.currentMetric).toBe('score');
    });
  });
});