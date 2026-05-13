import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMemoryGameLogic } from './useMemoryGameLogic';
import type { GameState } from '../types';
import { Difficulty } from '../types';

const createBaseState = (overrides: Partial<GameState> = {}): GameState => ({
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  gameStatus: 'idle',
  difficulty: Difficulty.Easy,
  timer: 0,
  ...overrides,
});

describe('useMemoryGameLogic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Timer effect', () => {
    it('dispatches TICK every second when gameStatus is "playing"', () => {
      const dispatch = vi.fn();
      const state = createBaseState({ gameStatus: 'playing' });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).not.toHaveBeenCalledWith({ type: 'TICK' });

      vi.advanceTimersByTime(3000);

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenCalledWith({ type: 'TICK' });
    });

    it('does not start timer when gameStatus is "idle"', () => {
      const dispatch = vi.fn();
      const state = createBaseState({ gameStatus: 'idle' });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      vi.advanceTimersByTime(3000);

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('does not start timer when gameStatus is "won"', () => {
      const dispatch = vi.fn();
      const state = createBaseState({ gameStatus: 'won' });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      vi.advanceTimersByTime(3000);

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('starts timer when gameStatus transitions from "idle" to "playing"', () => {
      const dispatch = vi.fn();
      const idleState = createBaseState({ gameStatus: 'idle' });

      const { rerender } = renderHook(
        ({ state }) => useMemoryGameLogic({ state, dispatch }),
        { initialProps: { state: idleState } },
      );

      vi.advanceTimersByTime(2000);
      expect(dispatch).not.toHaveBeenCalled();

      rerender({ state: { ...idleState, gameStatus: 'playing' } });

      vi.advanceTimersByTime(2000);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({ type: 'TICK' });
    });

    it('stops timer when gameStatus transitions from "playing" to "won"', () => {
      const dispatch = vi.fn();
      const playingState = createBaseState({ gameStatus: 'playing' });

      const { rerender } = renderHook(
        ({ state }) => useMemoryGameLogic({ state, dispatch }),
        { initialProps: { state: playingState } },
      );

      vi.advanceTimersByTime(2000);
      expect(dispatch).toHaveBeenCalledTimes(2);

      rerender({ state: { ...playingState, gameStatus: 'won' } });

      vi.advanceTimersByTime(3000);

      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it('clears timer interval on unmount', () => {
      const dispatch = vi.fn();
      const state = createBaseState({ gameStatus: 'playing' });

      const { unmount } = renderHook(() =>
        useMemoryGameLogic({ state, dispatch }),
      );

      vi.advanceTimersByTime(2000);
      expect(dispatch).toHaveBeenCalledTimes(2);

      unmount();

      vi.advanceTimersByTime(2000);

      expect(dispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Match checking effect', () => {
    it('dispatches CHECK_MATCH when two flipped cards have the same value', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: true, isMatched: false },
          { id: 'card-1', value: '🍎', isFlipped: true, isMatched: false },
        ],
        flippedCards: [0, 1],
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: 'CHECK_MATCH' });
    });

    it('does nothing when flippedCards is empty', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: false, isMatched: false },
          { id: 'card-1', value: '🍌', isFlipped: false, isMatched: false },
        ],
        flippedCards: [],
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('does nothing when only one card is flipped', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: true, isMatched: false },
          { id: 'card-1', value: '🍌', isFlipped: false, isMatched: false },
        ],
        flippedCards: [0],
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('dispatches RESET_FLIPPED after 1 second when cards do not match', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: true, isMatched: false },
          { id: 'card-1', value: '🍌', isFlipped: true, isMatched: false },
        ],
        flippedCards: [0, 1],
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).not.toHaveBeenCalled();

      // RESET_FLIPPED fires at 1000ms, TICK also fires at 1000ms on the interval
      // Check that RESET_FLIPPED was among the dispatches
      vi.advanceTimersByTime(1000);
      expect(dispatch).toHaveBeenCalledWith({ type: 'RESET_FLIPPED' });
    });

    it('does not dispatch CHECK_MATCH when cards have different values', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: true, isMatched: false },
          { id: 'card-1', value: '🍌', isFlipped: true, isMatched: false },
        ],
        flippedCards: [0, 1],
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).not.toHaveBeenCalledWith({ type: 'CHECK_MATCH' });
    });

    it('re-evaluates when flippedCards changes to a new pair', () => {
      const dispatch = vi.fn();
      const initialState = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: false, isMatched: false },
          { id: 'card-1', value: '🍎', isFlipped: false, isMatched: false },
          { id: 'card-2', value: '🍌', isFlipped: false, isMatched: false },
          { id: 'card-3', value: '🍌', isFlipped: false, isMatched: false },
        ],
        flippedCards: [],
      });

      const { rerender } = renderHook(
        ({ state }) => useMemoryGameLogic({ state, dispatch }),
        { initialProps: { state: initialState } },
      );

      expect(dispatch).not.toHaveBeenCalled();

      const withFlipped = {
        ...initialState,
        flippedCards: [0, 2],
        cards: initialState.cards.map((c, i) =>
          i === 0 || i === 2 ? { ...c, isFlipped: true } : c,
        ),
      };

      rerender({ state: withFlipped });

      expect(dispatch).not.toHaveBeenCalledWith({ type: 'CHECK_MATCH' });

      vi.advanceTimersByTime(1000);

      expect(dispatch).toHaveBeenCalledWith({ type: 'RESET_FLIPPED' });
    });
  });

  describe('Win condition effect', () => {
    it('dispatches GAME_WON when matchedPairs equals half the cards', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: false, isMatched: true },
          { id: 'card-1', value: '🍎', isFlipped: false, isMatched: true },
          { id: 'card-2', value: '🍌', isFlipped: false, isMatched: true },
          { id: 'card-3', value: '🍌', isFlipped: false, isMatched: true },
        ],
        matchedPairs: 2,
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: 'GAME_WON' });
    });

    it('does not dispatch GAME_WON when matchedPairs is less than half the cards', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: false, isMatched: true },
          { id: 'card-1', value: '🍎', isFlipped: false, isMatched: true },
          { id: 'card-2', value: '🍌', isFlipped: false, isMatched: false },
          { id: 'card-3', value: '🍌', isFlipped: false, isMatched: false },
        ],
        matchedPairs: 1,
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch GAME_WON when gameStatus is not "playing"', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'idle',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: false, isMatched: true },
          { id: 'card-1', value: '🍎', isFlipped: false, isMatched: true },
        ],
        matchedPairs: 1,
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch GAME_WON when there are no cards', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'playing',
        cards: [],
        matchedPairs: 0,
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('dispatches GAME_WON when matchedPairs reaches parity after a state change', () => {
      const dispatch = vi.fn();
      const beforeState = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: false, isMatched: false },
          { id: 'card-1', value: '🍎', isFlipped: false, isMatched: false },
        ],
        matchedPairs: 0,
      });

      const { rerender } = renderHook(
        ({ state }) => useMemoryGameLogic({ state, dispatch }),
        { initialProps: { state: beforeState } },
      );

      expect(dispatch).not.toHaveBeenCalled();

      const afterState = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: false, isMatched: true },
          { id: 'card-1', value: '🍎', isFlipped: false, isMatched: true },
        ],
        matchedPairs: 1,
      });

      rerender({ state: afterState });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({ type: 'GAME_WON' });
    });
  });

  describe('Interaction between effects', () => {
    it('timer and match check coexist without interference', () => {
      const dispatch = vi.fn();
      const state = createBaseState({
        gameStatus: 'playing',
        cards: [
          { id: 'card-0', value: '🍎', isFlipped: true, isMatched: false },
          { id: 'card-1', value: '🍎', isFlipped: true, isMatched: false },
        ],
        flippedCards: [0, 1],
      });

      renderHook(() => useMemoryGameLogic({ state, dispatch }));

      expect(dispatch).toHaveBeenCalledWith({ type: 'CHECK_MATCH' });

      vi.advanceTimersByTime(1000);
      expect(dispatch).toHaveBeenCalledWith({ type: 'TICK' });
    });
  });
});
