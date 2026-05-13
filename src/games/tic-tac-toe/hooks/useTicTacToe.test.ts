import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTicTacToe } from './useTicTacToe';

const mockUpdateHighScore = vi.fn();

vi.mock('@/hooks/useHighScores', () => ({
  useHighScores: vi.fn(() => ({ highScore: null, updateHighScore: mockUpdateHighScore })),
}));

const mockGetAIMove = vi.fn();
vi.mock('../ai/ticTacToeAI', () => ({
  getAIMove: (...args: Parameters<typeof import('../ai/ticTacToeAI').getAIMove>) =>
    mockGetAIMove(...args),
}));

describe('useTicTacToe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('has an empty 3x3 board', () => {
      const { result } = renderHook(() => useTicTacToe());
      const { board } = result.current.gameState;
      expect(board).toHaveLength(3);
      for (const row of board) {
        expect(row).toHaveLength(3);
        for (const cell of row) {
          expect(cell).toBeNull();
        }
      }
    });

    it('starts with X as current player', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.gameState.currentPlayer).toBe('X');
    });

    it('starts with ongoing game result', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.gameState.gameResult).toBe('ongoing');
    });

    it('starts with no winner, no winning line, zero moves, game not started', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.gameState.winner).toBeNull();
      expect(result.current.gameState.winningLine).toBeNull();
      expect(result.current.gameState.moveCount).toBe(0);
      expect(result.current.gameState.gameStarted).toBe(false);
    });

    it('starts with PvP mode and medium difficulty', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.gameMode).toBe('pvp');
      expect(result.current.difficulty).toBe('medium');
    });

    it('starts not thinking', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.isAIThinking).toBe(false);
    });

    it('returns null high score initially', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.highScore).toBeNull();
    });
  });

  describe('making moves', () => {
    it('places the player mark and switches turn', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });

      expect(result.current.gameState.board[0][0]).toBe('X');
      expect(result.current.gameState.currentPlayer).toBe('O');
      expect(result.current.gameState.moveCount).toBe(1);
      expect(result.current.gameState.gameStarted).toBe(true);
    });

    it('alternates between X and O', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      expect(result.current.gameState.currentPlayer).toBe('O');

      act(() => { result.current.makeMove(0, 1); });
      expect(result.current.gameState.currentPlayer).toBe('X');

      act(() => { result.current.makeMove(0, 2); });
      expect(result.current.gameState.currentPlayer).toBe('O');
    });

    it('increments move count on each move', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      expect(result.current.gameState.moveCount).toBe(1);

      act(() => { result.current.makeMove(1, 1); });
      expect(result.current.gameState.moveCount).toBe(2);
    });

    it('refuses to play on an already taken cell', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      const snapshot = { ...result.current.gameState };

      act(() => { result.current.makeMove(0, 0); });

      expect(result.current.gameState.board[0][0]).toBe('X');
      expect(result.current.gameState.currentPlayer).toBe(snapshot.currentPlayer);
      expect(result.current.gameState.moveCount).toBe(snapshot.moveCount);
    });

    it('refuses to play after the game is won', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(0, 2); });

      expect(result.current.gameState.gameResult).toBe('win');

      act(() => { result.current.makeMove(2, 2); });
      expect(result.current.gameState.board[2][2]).toBeNull();
      expect(result.current.gameState.moveCount).toBe(5);
    });

    it('refuses to play after a draw', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(0, 2); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(1, 2); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(2, 0); });
      act(() => { result.current.makeMove(2, 2); });
      act(() => { result.current.makeMove(2, 1); });

      expect(result.current.gameState.gameResult).toBe('draw');

      act(() => { result.current.makeMove(0, 0); });
      expect(result.current.gameState.gameResult).toBe('draw');
    });


  });

  describe('win detection', () => {
    it('detects a row win for X', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(0, 2); });

      expect(result.current.gameState.gameResult).toBe('win');
      expect(result.current.gameState.winner).toBe('X');
      expect(result.current.gameState.winningLine).toEqual({
        positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
        player: 'X',
      });
    });

    it('detects a row win for O', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(2, 2); });
      act(() => { result.current.makeMove(0, 2); });

      expect(result.current.gameState.gameResult).toBe('win');
      expect(result.current.gameState.winner).toBe('O');
    });

    it('detects a column win', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(2, 0); });

      expect(result.current.gameState.gameResult).toBe('win');
      expect(result.current.gameState.winner).toBe('X');
      expect(result.current.gameState.winningLine!.positions).toEqual([
        { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 },
      ]);
    });

    it('detects a diagonal win (top-left to bottom-right)', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(0, 2); });
      act(() => { result.current.makeMove(2, 2); });

      expect(result.current.gameState.gameResult).toBe('win');
      expect(result.current.gameState.winner).toBe('X');
      expect(result.current.gameState.winningLine!.positions).toEqual([
        { row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 },
      ]);
    });

    it('detects a diagonal win (top-right to bottom-left)', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 2); });
      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(2, 0); });

      expect(result.current.gameState.gameResult).toBe('win');
      expect(result.current.gameState.winner).toBe('X');
      expect(result.current.gameState.winningLine!.positions).toEqual([
        { row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 },
      ]);
    });

    it('isCellInWinningLine returns true for winning cells and false for others', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(0, 2); });

      expect(result.current.isCellInWinningLine(0, 0)).toBe(true);
      expect(result.current.isCellInWinningLine(0, 1)).toBe(true);
      expect(result.current.isCellInWinningLine(0, 2)).toBe(true);
      expect(result.current.isCellInWinningLine(1, 0)).toBe(false);
      expect(result.current.isCellInWinningLine(2, 2)).toBe(false);
    });

    it('isCellInWinningLine returns false when game is ongoing', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });

      expect(result.current.isCellInWinningLine(0, 0)).toBe(false);
    });
  });

  describe('draw detection', () => {
    it('detects a draw when board is full with no winner', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(0, 2); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(1, 2); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(2, 0); });
      act(() => { result.current.makeMove(2, 2); });
      act(() => { result.current.makeMove(2, 1); });

      expect(result.current.gameState.gameResult).toBe('draw');
      expect(result.current.gameState.winner).toBeNull();
      expect(result.current.gameState.winningLine).toBeNull();
    });
  });

  describe('resetGame', () => {
    it('resets board to empty after a few moves', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 1); });

      act(() => { result.current.resetGame(); });

      const gs = result.current.gameState;
      for (const row of gs.board) {
        for (const cell of row) {
          expect(cell).toBeNull();
        }
      }
      expect(gs.currentPlayer).toBe('X');
      expect(gs.gameResult).toBe('ongoing');
      expect(gs.winner).toBeNull();
      expect(gs.winningLine).toBeNull();
      expect(gs.moveCount).toBe(0);
      expect(gs.gameStarted).toBe(false);
    });

    it('resets after a win', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(0, 2); });

      expect(result.current.gameState.gameResult).toBe('win');

      act(() => { result.current.resetGame(); });

      expect(result.current.gameState.gameResult).toBe('ongoing');
    });

    it('resets after a draw', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(0, 2); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(1, 2); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(2, 0); });
      act(() => { result.current.makeMove(2, 2); });
      act(() => { result.current.makeMove(2, 1); });

      expect(result.current.gameState.gameResult).toBe('draw');

      act(() => { result.current.resetGame(); });

      expect(result.current.gameState.gameResult).toBe('ongoing');
    });

    it('clears AI thinking state', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.setGameMode('pve'); });
      act(() => { result.current.makeMove(0, 0); });
      expect(result.current.isAIThinking).toBe(true);

      act(() => { result.current.resetGame(); });

      expect(result.current.isAIThinking).toBe(false);
    });
  });

  describe('gameStatusMessage', () => {
    it('shows idle prompt before first move', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.gameStatusMessage).toBe('Click any cell to start playing!');
    });

    it('shows current player during PvP game', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      expect(result.current.gameStatusMessage).toBe('Current player: O');
    });

    it('shows win message for X in PvP', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(0, 2); });

      expect(result.current.gameStatusMessage).toBe('Player X wins!');
    });

    it('shows win message for O in PvP', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(2, 2); });
      act(() => { result.current.makeMove(0, 2); });

      expect(result.current.gameStatusMessage).toBe('Player O wins!');
    });

    it('shows draw message', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(0, 2); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(1, 2); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(2, 0); });
      act(() => { result.current.makeMove(2, 2); });
      act(() => { result.current.makeMove(2, 1); });

      expect(result.current.gameStatusMessage).toBe("It's a draw!");
    });

    it('shows "Your turn" in PvE when it is X', () => {
      mockGetAIMove.mockReturnValue({ position: { row: 1, col: 1 }, algorithm: 'medium' });
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.setGameMode('pve'); });
      act(() => { result.current.makeMove(0, 0); });

      act(() => { vi.advanceTimersByTime(600); });

      expect(result.current.gameStatusMessage).toBe('Your turn!');
    });

    it('shows "AI is thinking" during AI turn in PvE', () => {
      mockGetAIMove.mockReturnValue({ position: { row: 1, col: 1 }, algorithm: 'medium' });
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.setGameMode('pve'); });
      act(() => { result.current.makeMove(0, 0); });

      expect(result.current.isAIThinking).toBe(true);
      expect(result.current.gameStatusMessage).toBe('AI is thinking...');
    });
  });

  describe('getCellValue', () => {
    it('returns null for empty cells', () => {
      const { result } = renderHook(() => useTicTacToe());

      expect(result.current.getCellValue(0, 0)).toBeNull();
      expect(result.current.getCellValue(1, 1)).toBeNull();
      expect(result.current.getCellValue(2, 2)).toBeNull();
    });

    it('returns X or O after a move', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 1); });

      expect(result.current.getCellValue(0, 0)).toBe('X');
      expect(result.current.getCellValue(1, 1)).toBe('O');
      expect(result.current.getCellValue(0, 1)).toBeNull();
    });
  });

  describe('AI opponent', () => {
    it('calls getAIMove after human plays in PvE mode', () => {
      mockGetAIMove.mockReturnValue({ position: { row: 1, col: 1 }, algorithm: 'medium' });
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.setGameMode('pve'); });
      act(() => { result.current.makeMove(0, 0); });

      act(() => { vi.advanceTimersByTime(600); });

      expect(mockGetAIMove).toHaveBeenCalledWith(
        expect.any(Array),
        'medium',
        'O',
      );
    });

    it('updates the board with the AI move', () => {
      mockGetAIMove.mockReturnValue({ position: { row: 1, col: 1 }, algorithm: 'medium' });
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.setGameMode('pve'); });
      act(() => { result.current.makeMove(0, 0); });

      act(() => { vi.advanceTimersByTime(600); });

      expect(result.current.gameState.board[1][1]).toBe('O');
      expect(result.current.gameState.currentPlayer).toBe('X');
      expect(result.current.gameState.moveCount).toBe(2);
    });

    it('blocks human moves while AI is thinking', () => {
      mockGetAIMove.mockReturnValue({ position: { row: 2, col: 2 }, algorithm: 'medium' });
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.setGameMode('pve'); });
      act(() => { result.current.makeMove(0, 0); });

      expect(result.current.isAIThinking).toBe(true);

      act(() => { result.current.makeMove(0, 1); });

      act(() => { vi.advanceTimersByTime(600); });

      expect(result.current.gameState.board[0][1]).toBeNull();
    });

    it('does not trigger AI in PvP mode', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { vi.advanceTimersByTime(600); });

      expect(mockGetAIMove).not.toHaveBeenCalled();
    });

    it('does not trigger AI when game is already won', () => {
      mockGetAIMove.mockReturnValue({ position: { row: 2, col: 2 }, algorithm: 'medium' });
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.setGameMode('pve'); });
      act(() => { result.current.makeMove(0, 0); });
      act(() => { vi.advanceTimersByTime(600); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { vi.advanceTimersByTime(600); });

      const callsBeforeWin = mockGetAIMove.mock.calls.length;

      act(() => { result.current.makeMove(0, 2); });

      act(() => { vi.advanceTimersByTime(600); });

      expect(result.current.gameState.gameResult).toBe('win');
      expect(mockGetAIMove.mock.calls.length).toBe(callsBeforeWin);
    });

    it('does not trigger AI on initial render (game not started)', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.setGameMode('pve'); });
      act(() => { vi.advanceTimersByTime(600); });

      expect(mockGetAIMove).not.toHaveBeenCalled();
    });

    it('sets isAIThinking false after AI completes move', () => {
      mockGetAIMove.mockReturnValue({ position: { row: 1, col: 1 }, algorithm: 'medium' });
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.setGameMode('pve'); });
      act(() => { result.current.makeMove(0, 0); });
      expect(result.current.isAIThinking).toBe(true);

      act(() => { vi.advanceTimersByTime(600); });

      expect(result.current.isAIThinking).toBe(false);
    });
  });

  describe('high score', () => {
    it('calls updateHighScore when player wins', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(0, 2); });

      expect(result.current.gameState.gameResult).toBe('win');
      expect(mockUpdateHighScore).toHaveBeenCalledWith(5, 'lowest');
    });

    it('does not call updateHighScore on draw', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });
      act(() => { result.current.makeMove(0, 1); });
      act(() => { result.current.makeMove(0, 2); });
      act(() => { result.current.makeMove(1, 0); });
      act(() => { result.current.makeMove(1, 2); });
      act(() => { result.current.makeMove(1, 1); });
      act(() => { result.current.makeMove(2, 0); });
      act(() => { result.current.makeMove(2, 2); });
      act(() => { result.current.makeMove(2, 1); });

      expect(mockUpdateHighScore).not.toHaveBeenCalled();
    });

    it('does not call updateHighScore on ongoing game', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => { result.current.makeMove(0, 0); });

      expect(mockUpdateHighScore).not.toHaveBeenCalled();
    });
  });

  describe('setters', () => {
    it('changes game mode', () => {
      const { result } = renderHook(() => useTicTacToe());

      expect(result.current.gameMode).toBe('pvp');

      act(() => { result.current.setGameMode('pve'); });
      expect(result.current.gameMode).toBe('pve');

      act(() => { result.current.setGameMode('pvp'); });
      expect(result.current.gameMode).toBe('pvp');
    });

    it('changes difficulty', () => {
      const { result } = renderHook(() => useTicTacToe());

      expect(result.current.difficulty).toBe('medium');

      act(() => { result.current.setDifficulty('hard'); });
      expect(result.current.difficulty).toBe('hard');

      act(() => { result.current.setDifficulty('expert'); });
      expect(result.current.difficulty).toBe('expert');
    });
  });
});
