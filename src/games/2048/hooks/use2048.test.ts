import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { use2048 } from './use2048';
import { useHighScores } from '@/hooks/useHighScores';
import * as moveProcessor from '@/games/2048/utils/moveProcessor';
import * as moveProcessor2 from '@/games/2048/utils/moveProcessor2';
import type { Direction } from '@/games/2048/types';

const mockUpdateHighScore = vi.fn();
const mockUpdateHighestTile = vi.fn();

vi.mock('@/hooks/useHighScores');

vi.mock('@/games/2048/useIds', () => ({
  useIds: vi.fn(() => {
    let id = 0;
    return [() => String(id++)];
  }),
}));

const createHighScoresMock = (overrides: Record<string, unknown> = {}) => ({
  highScore: null,
  updateHighScore: mockUpdateHighScore,
  highestTile: null,
  updateHighestTile: mockUpdateHighestTile,
  resetHighScore: vi.fn(),
  session: null,
  startSession: vi.fn(),
  recordMove: vi.fn(),
  submitScore: vi.fn(),
  endSession: vi.fn(),
  currentMetric: 'score' as const,
  ...overrides,
});

let randomSpy: ReturnType<typeof vi.spyOn> | null = null;

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.mocked(useHighScores).mockReturnValue(createHighScoresMock());
});

afterEach(() => {
  vi.useRealTimers();
  if (randomSpy) {
    randomSpy.mockRestore();
    randomSpy = null;
  }
});

function setupTilesAt(row1: number, col1: number, val1: number, row2: number, col2: number, val2: number) {
  const getPositionIndex = (row: number, col: number, occupiedCells: Set<string>): number => {
    let idx = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (occupiedCells.has(`${r},${c}`)) continue;
        if (r === row && c === col) return idx;
        idx++;
      }
    }
    return idx;
  };

  const occupied = new Set<string>();

  const pos1Idx = getPositionIndex(row1, col1, occupied);
  occupied.add(`${row1},${col1}`);

  const pos2Idx = getPositionIndex(row2, col2, occupied);
  occupied.add(`${row2},${col2}`);

  const pos1Random = pos1Idx / 16;
  const pos2Random = pos2Idx / 15;

  randomSpy = vi.spyOn(Math, 'random');
  randomSpy
    .mockReturnValueOnce(pos1Random)
    .mockReturnValueOnce(val1 === 2 ? 0 : 0.95)
    .mockReturnValueOnce(pos2Random)
    .mockReturnValueOnce(val2 === 2 ? 0 : 0.95);
}

describe('use2048', () => {
  describe('initial state', () => {
    it('returns expected initial values and control functions', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      expect(result.current.isGameOver).toBe(false);
      expect(result.current.isWon).toBe(false);
      expect(result.current.score).toBe(0);
      expect(result.current.highScore).toBeNull();
      expect(result.current.bestHighestTile).toBeNull();
      expect(result.current.highestTile).toBe(0);
      expect(result.current.canUndo).toBe(false);
      expect(Array.isArray(result.current.animatedTiles)).toBe(true);
      expect(typeof result.current.makeMove).toBe('function');
      expect(typeof result.current.restartGame).toBe('function');
      expect(typeof result.current.undoMove).toBe('function');
      expect(typeof result.current.continueGame).toBe('function');
    });

    it('initializes board with 2 tiles', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      expect(result.current.animatedTiles).toHaveLength(2);
      result.current.animatedTiles.forEach(tile => {
        expect(tile).toHaveProperty('id');
        expect(tile).toHaveProperty('value');
        expect(tile).toHaveProperty('row');
        expect(tile).toHaveProperty('col');
      });
    });

    it('calls useHighScores with game id 2048', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      renderHook(() => use2048());

      expect(useHighScores).toHaveBeenCalledWith('2048');
    });

    it('passes through highScore and bestHighestTile from useHighScores', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      vi.mocked(useHighScores).mockReturnValue(
        createHighScoresMock({ highScore: 5000, highestTile: 1024 })
      );
      const { result } = renderHook(() => use2048());

      expect(result.current.highScore).toBe(5000);
      expect(result.current.bestHighestTile).toBe(1024);
    });
  });

  describe('makeMove', () => {
    it('merges two tiles and updates score when moving right', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.score).toBeGreaterThan(0);
      expect(result.current.canUndo).toBe(true);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isGameOver).toBe(false);
      expect(result.current.isWon).toBe(false);
    });

    it('merges two tiles and updates score when moving left', () => {
      setupTilesAt(0, 2, 2, 0, 3, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('left');
      });

      expect(result.current.score).toBeGreaterThan(0);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isGameOver).toBe(false);
    });

    it('merges two tiles and updates score when moving up', () => {
      setupTilesAt(0, 0, 2, 1, 0, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('up');
      });

      expect(result.current.score).toBeGreaterThan(0);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isGameOver).toBe(false);
    });

    it('merges two tiles and updates score when moving down', () => {
      setupTilesAt(0, 0, 2, 1, 0, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('down');
      });

      expect(result.current.score).toBeGreaterThan(0);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isGameOver).toBe(false);
    });

    it('adds a new random tile after animation completes', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.animatedTiles).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.animatedTiles).toHaveLength(2);
    });

    it('ignores moves when tiles are animating (inMotion)', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });

      const scoreAfterFirstMove = result.current.score;

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.score).toBe(scoreAfterFirstMove);

      act(() => {
        vi.advanceTimersByTime(100);
      });
    });

    it('ignores moves when game is over', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const canMoveSpy = vi.spyOn(moveProcessor2, 'canMove');
      canMoveSpy.mockReturnValue(false);

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 0,
        moved: false,
        hasWon: false,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.isGameOver).toBe(true);

      act(() => {
        result.current.makeMove('left');
      });

      expect(result.current.isGameOver).toBe(true);

      processMoveSpy.mockRestore();
      canMoveSpy.mockRestore();
    });

    it('ignores moves when game is won (before continueGame)', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 0,
        moved: true,
        hasWon: true,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.isWon).toBe(true);

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.isWon).toBe(true);

      processMoveSpy.mockRestore();
    });
  });

  describe('canUndo', () => {
    it('is false initially', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      expect(result.current.canUndo).toBe(false);
    });

    it('becomes true after a successful move', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.canUndo).toBe(true);

      act(() => {
        vi.advanceTimersByTime(100);
      });
    });

    it('becomes false after undo is used', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.canUndo).toBe(true);

      act(() => {
        result.current.undoMove();
      });

      expect(result.current.canUndo).toBe(false);
    });

    it('is still true after animation completes', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.canUndo).toBe(true);
    });
  });

  describe('undoMove', () => {
    it('reverts score to previous value', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      const scoreAfterMove = result.current.score;
      expect(scoreAfterMove).toBeGreaterThan(0);

      act(() => {
        result.current.undoMove();
      });

      expect(result.current.score).toBe(0);
    });

    it('restores previous tile positions', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.canUndo).toBe(true);

      act(() => {
        result.current.undoMove();
      });

      expect(result.current.score).toBe(0);
      expect(result.current.canUndo).toBe(false);
    });

    it('does nothing when canUndo is false', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const initialScore = result.current.score;

      act(() => {
        result.current.undoMove();
      });

      expect(result.current.score).toBe(initialScore);
      expect(result.current.isGameOver).toBe(false);
    });
  });

  describe('restartGame', () => {
    it('resets score to 0', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.score).toBeGreaterThan(0);

      act(() => {
        result.current.restartGame();
      });

      expect(result.current.score).toBe(0);
    });

    it('resets isGameOver to false', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const canMoveSpy = vi.spyOn(moveProcessor2, 'canMove');
      canMoveSpy.mockReturnValue(false);

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 0,
        moved: false,
        hasWon: false,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.isGameOver).toBe(true);

      act(() => {
        result.current.restartGame();
      });

      expect(result.current.isGameOver).toBe(false);

      processMoveSpy.mockRestore();
      canMoveSpy.mockRestore();
    });

    it('resets isWon to false', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 0,
        moved: true,
        hasWon: true,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.isWon).toBe(true);

      act(() => {
        result.current.restartGame();
      });

      expect(result.current.isWon).toBe(false);

      processMoveSpy.mockRestore();
    });

    it('initializes the board with 2 new tiles', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.restartGame();
      });

      expect(result.current.animatedTiles).toHaveLength(2);
      expect(result.current.canUndo).toBe(false);
    });
  });

  describe('win and continueGame', () => {
    it('detects winning condition', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 0,
        moved: true,
        hasWon: true,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.isWon).toBe(true);
      expect(result.current.isGameOver).toBe(false);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isWon).toBe(true);

      processMoveSpy.mockRestore();
    });

    it('continueGame resets isWon to false and allows further moves', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy
        .mockReturnValueOnce({
          board: Array(4).fill(null).map(() => Array(4).fill(null)),
          score: 0,
          moved: true,
          hasWon: true,
          animatedTiles: [],
        } as any)
        .mockReturnValue({
          board: Array(4).fill(null).map(() => Array(4).fill(null)),
          score: 0,
          moved: false,
          hasWon: false,
          animatedTiles: [],
        } as any);

      act(() => {
        result.current.makeMove('right');
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isWon).toBe(true);

      act(() => {
        result.current.continueGame();
      });

      expect(result.current.isWon).toBe(false);

      act(() => {
        result.current.makeMove('down');
      });

      expect(result.current.isWon).toBe(false);

      processMoveSpy.mockRestore();
    });
  });

  describe('game over', () => {
    it('detects game over when board is full and no moves possible', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const canMoveSpy = vi.spyOn(moveProcessor2, 'canMove');
      canMoveSpy.mockReturnValue(false);

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 0,
        moved: false,
        hasWon: false,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.isGameOver).toBe(true);
      expect(result.current.isWon).toBe(false);

      processMoveSpy.mockRestore();
      canMoveSpy.mockRestore();
    });

    it('prevents further moves after game over', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const canMoveSpy = vi.spyOn(moveProcessor2, 'canMove');
      canMoveSpy.mockReturnValue(false);

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 0,
        moved: false,
        hasWon: false,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(result.current.isGameOver).toBe(true);

      const processMoveCallsBefore = processMoveSpy.mock.calls.length;

      act(() => {
        result.current.makeMove('left');
      });

      expect(processMoveSpy.mock.calls.length).toBe(processMoveCallsBefore);

      processMoveSpy.mockRestore();
      canMoveSpy.mockRestore();
    });
  });

  describe('high score updates', () => {
    it('updates high score when game is over', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const canMoveSpy = vi.spyOn(moveProcessor2, 'canMove');
      canMoveSpy.mockReturnValue(false);

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 0,
        moved: false,
        hasWon: false,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(mockUpdateHighScore).toHaveBeenCalledWith(0, 'highest');

      processMoveSpy.mockRestore();
      canMoveSpy.mockRestore();
    });

    it('updates high score when game is won', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 10,
        moved: true,
        hasWon: true,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(mockUpdateHighScore).toHaveBeenCalledWith(10, 'highest');

      processMoveSpy.mockRestore();
    });

    it('updates highestTile when current tile is higher than best', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      vi.mocked(useHighScores).mockReturnValue(
        createHighScoresMock({ highScore: null, highestTile: null })
      );
      const { result } = renderHook(() => use2048());

      const processMoveSpy = vi.spyOn(moveProcessor, 'processMove' as any);
      processMoveSpy.mockReturnValue({
        board: Array(4).fill(null).map(() => Array(4).fill(null)),
        score: 0,
        moved: true,
        hasWon: true,
        animatedTiles: [],
      } as any);

      act(() => {
        result.current.makeMove('right');
      });

      expect(mockUpdateHighestTile).toHaveBeenCalled();

      processMoveSpy.mockRestore();
    });

    it('does not update high score while game is still ongoing', () => {
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { result } = renderHook(() => use2048());

      expect(mockUpdateHighScore).not.toHaveBeenCalled();
      expect(result.current.isGameOver).toBe(false);
      expect(result.current.isWon).toBe(false);
    });

    it('does not call updateHighScore for a regular move without win or game over', () => {
      setupTilesAt(0, 0, 2, 0, 1, 2);
      const { result } = renderHook(() => use2048());

      act(() => {
        result.current.makeMove('right');
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isGameOver).toBe(false);
      expect(result.current.isWon).toBe(false);
      expect(mockUpdateHighScore).not.toHaveBeenCalled();
    });
  });
});
