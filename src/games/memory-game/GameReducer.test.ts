/**
 * src/games/memory-game/GameReducer.test.ts
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gameReducer, initialState } from './GameReducer';
import type { GameState, Difficulty, Card } from './types';
import { Difficulty as DifficultyEnum } from './types';

describe('Memory Game Reducer', () => {
  const createCard = (id: string, value: string, isFlipped = false, isMatched = false): Card => ({
    id,
    value,
    isFlipped,
    isMatched,
  });

  const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
    ...initialState,
    cards: [
      createCard('card-0', '🍎', false, false),
      createCard('card-1', '🍎', false, false),
      createCard('card-2', '🍌', false, false),
      createCard('card-3', '🍌', false, false),
    ],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    gameStatus: 'playing',
    difficulty: DifficultyEnum.Easy,
    timer: 0,
    ...overrides,
  });

  describe('initialState', () => {
    it('should have empty cards array', () => {
      expect(initialState.cards).toHaveLength(0);
    });

    it('should have empty flippedCards array', () => {
      expect(initialState.flippedCards).toHaveLength(0);
    });

    it('should have zero matchedPairs', () => {
      expect(initialState.matchedPairs).toBe(0);
    });

    it('should have zero moves', () => {
      expect(initialState.moves).toBe(0);
    });

    it('should have idle gameStatus', () => {
      expect(initialState.gameStatus).toBe('idle');
    });

    it('should have Easy difficulty', () => {
      expect(initialState.difficulty).toBe(DifficultyEnum.Easy);
    });

    it('should have zero timer', () => {
      expect(initialState.timer).toBe(0);
    });
  });

  describe('START_GAME action', () => {
    it('should set game status to playing', () => {
      const action = { type: 'START_GAME' as const, payload: { difficulty: DifficultyEnum.Easy } };
      const newState = gameReducer(initialState, action);
      expect(newState.gameStatus).toBe('playing');
    });

    it('should create cards array', () => {
      const action = { type: 'START_GAME' as const, payload: { difficulty: DifficultyEnum.Easy } };
      const newState = gameReducer(initialState, action);
      expect(newState.cards.length).toBeGreaterThan(0);
    });

    it('should set the difficulty', () => {
      const action = { type: 'START_GAME' as const, payload: { difficulty: DifficultyEnum.Hard } };
      const newState = gameReducer(initialState, action);
      expect(newState.difficulty).toBe(DifficultyEnum.Hard);
    });

    it('should reset moves to 0', () => {
      const state = createTestState({ moves: 10 });
      const action = { type: 'START_GAME' as const, payload: { difficulty: DifficultyEnum.Easy } };
      const newState = gameReducer(state, action);
      expect(newState.moves).toBe(0);
    });

    it('should reset matchedPairs to 0', () => {
      const state = createTestState({ matchedPairs: 3 });
      const action = { type: 'START_GAME' as const, payload: { difficulty: DifficultyEnum.Easy } };
      const newState = gameReducer(state, action);
      expect(newState.matchedPairs).toBe(0);
    });

    it('should reset timer to 0', () => {
      const state = createTestState({ timer: 60 });
      const action = { type: 'START_GAME' as const, payload: { difficulty: DifficultyEnum.Easy } };
      const newState = gameReducer(state, action);
      expect(newState.timer).toBe(0);
    });
  });

  describe('FLIP_CARD action', () => {
    it('should flip the card at the given index', () => {
      const state = createTestState();
      const action = { type: 'FLIP_CARD' as const, payload: { index: 0 } };
      const newState = gameReducer(state, action);
      expect(newState.cards[0].isFlipped).toBe(true);
    });

    it('should add index to flippedCards array', () => {
      const state = createTestState();
      const action = { type: 'FLIP_CARD' as const, payload: { index: 0 } };
      const newState = gameReducer(state, action);
      expect(newState.flippedCards).toContain(0);
    });

    it('should increment moves', () => {
      const state = createTestState({ moves: 0 });
      const action = { type: 'FLIP_CARD' as const, payload: { index: 0 } };
      const newState = gameReducer(state, action);
      expect(newState.moves).toBe(1);
    });

    it('should not flip more than 2 cards', () => {
      const state = createTestState({ flippedCards: [0, 1] });
      const action = { type: 'FLIP_CARD' as const, payload: { index: 2 } };
      const newState = gameReducer(state, action);
      expect(newState.flippedCards).toHaveLength(2);
      expect(newState.flippedCards).toEqual([0, 1]);
    });

    it('should not increment moves when 2 cards already flipped', () => {
      const state = createTestState({ flippedCards: [0, 1], moves: 1 });
      const action = { type: 'FLIP_CARD' as const, payload: { index: 2 } };
      const newState = gameReducer(state, action);
      expect(newState.moves).toBe(1);
    });

    it('should flip second card and add to flippedCards', () => {
      const state = createTestState({ flippedCards: [0] });
      const action = { type: 'FLIP_CARD' as const, payload: { index: 1 } };
      const newState = gameReducer(state, action);
      expect(newState.flippedCards).toContain(1);
      expect(newState.flippedCards).toHaveLength(2);
    });
  });

  describe('CHECK_MATCH action', () => {
    it('should mark matching cards as matched', () => {
      const state = createTestState({
        cards: [
          createCard('card-0', '🍎', true, false),
          createCard('card-1', '🍎', true, false),
        ],
        flippedCards: [0, 1],
      });
      const action = { type: 'CHECK_MATCH' as const };
      const newState = gameReducer(state, action);
      expect(newState.cards[0].isMatched).toBe(true);
      expect(newState.cards[1].isMatched).toBe(true);
    });

    it('should increment matchedPairs for matching cards', () => {
      const state = createTestState({
        cards: [
          createCard('card-0', '🍎', true, false),
          createCard('card-1', '🍎', true, false),
        ],
        flippedCards: [0, 1],
        matchedPairs: 0,
      });
      const action = { type: 'CHECK_MATCH' as const };
      const newState = gameReducer(state, action);
      expect(newState.matchedPairs).toBe(1);
    });

    it('should clear flippedCards after match', () => {
      const state = createTestState({
        cards: [
          createCard('card-0', '🍎', true, false),
          createCard('card-1', '🍎', true, false),
        ],
        flippedCards: [0, 1],
      });
      const action = { type: 'CHECK_MATCH' as const };
      const newState = gameReducer(state, action);
      expect(newState.flippedCards).toHaveLength(0);
    });

    it('should return state unchanged when no cards are flipped', () => {
      const state = createTestState({ flippedCards: [] });
      const action = { type: 'CHECK_MATCH' as const };
      const newState = gameReducer(state, action);
      expect(newState).toBe(state);
    });

    it('should return state unchanged when only one card is flipped', () => {
      const state = createTestState({ flippedCards: [0] });
      const action = { type: 'CHECK_MATCH' as const };
      const newState = gameReducer(state, action);
      expect(newState).toBe(state);
    });
  });

  describe('RESET_FLIPPED action', () => {
    it('should flip back unmatched flipped cards', () => {
      const state = createTestState({
        cards: [
          createCard('card-0', '🍎', true, false),
          createCard('card-1', '🍌', true, false),
        ],
        flippedCards: [0, 1],
      });
      const action = { type: 'RESET_FLIPPED' as const };
      const newState = gameReducer(state, action);
      expect(newState.cards[0].isFlipped).toBe(false);
      expect(newState.cards[1].isFlipped).toBe(false);
    });

    it('should not flip back matched cards', () => {
      const state = createTestState({
        cards: [
          createCard('card-0', '🍎', true, true),
          createCard('card-1', '🍌', true, false),
        ],
        flippedCards: [0, 1],
      });
      const action = { type: 'RESET_FLIPPED' as const };
      const newState = gameReducer(state, action);
      expect(newState.cards[0].isFlipped).toBe(true); // Matched, should stay flipped
      expect(newState.cards[1].isFlipped).toBe(false); // Not matched, should flip back
    });

    it('should clear flippedCards array', () => {
      const state = createTestState({ flippedCards: [0, 1] });
      const action = { type: 'RESET_FLIPPED' as const };
      const newState = gameReducer(state, action);
      expect(newState.flippedCards).toHaveLength(0);
    });
  });

  describe('GAME_WON action', () => {
    it('should set gameStatus to won', () => {
      const state = createTestState({ gameStatus: 'playing' });
      const action = { type: 'GAME_WON' as const };
      const newState = gameReducer(state, action);
      expect(newState.gameStatus).toBe('won');
    });
  });

  describe('RESET_GAME action', () => {
    it('should reset to initial state', () => {
      const state = createTestState({
        moves: 10,
        matchedPairs: 5,
        timer: 120,
        flippedCards: [0, 1],
      });
      const action = { type: 'RESET_GAME' as const };
      const newState = gameReducer(state, action);
      expect(newState.moves).toBe(0);
      expect(newState.matchedPairs).toBe(0);
      expect(newState.timer).toBe(0);
      expect(newState.flippedCards).toHaveLength(0);
    });
  });

  describe('TICK action', () => {
    it('should increment timer', () => {
      const state = createTestState({ timer: 0 });
      const action = { type: 'TICK' as const };
      const newState = gameReducer(state, action);
      expect(newState.timer).toBe(1);
    });

    it('should increment timer by 1 each tick', () => {
      const state = createTestState({ timer: 59 });
      const action = { type: 'TICK' as const };
      const newState = gameReducer(state, action);
      expect(newState.timer).toBe(60);
    });
  });

  describe('unknown action', () => {
    it('should return state unchanged for unknown action', () => {
      const state = createTestState();
      const action = { type: 'UNKNOWN_ACTION' as any };
      const newState = gameReducer(state, action);
      expect(newState).toBe(state);
    });
  });
});