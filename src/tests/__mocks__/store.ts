/**
 * Zustand Store Mock for Testing
 * Provides a mock store factory for testing components that use Zustand
 */

import { vi, Mock } from 'vitest';

/**
 * Creates a mock Zustand store
 * 
 * @param initialState - Initial state for the mock store
 * @returns Object with mock store and utilities
 * 
 * @example
 * const { store, getState, setState, reset } = createMockStore({
 *   score: 100,
 *   highScore: 500,
 * });
 */
export function createMockStore<T extends Record<string, unknown>>(initialState: T) {
  let state = { ...initialState };

  const getState = vi.fn(() => state);
  const setState = vi.fn((partial: Partial<T> | ((prev: T) => Partial<T>)) => {
    if (typeof partial === 'function') {
      const updates = partial(state);
      state = { ...state, ...updates };
    } else {
      state = { ...state, ...partial };
    }
  });
  const subscribe = vi.fn(() => () => {});
  const destroy = vi.fn(() => {
    state = { ...initialState };
  });

  const store = {
    getState,
    setState,
    subscribe,
    destroy,
  };

  return {
    store,
    getState,
    setState,
    subscribe,
    destroy,
    reset: () => {
      state = { ...initialState };
      setState.mockClear();
      getState.mockClear();
    },
    /** Utility to update state directly for testing */
    updateState: (updates: Partial<T>) => {
      state = { ...state, ...updates };
    },
  };
}

/**
 * Creates a mock for a Zustand store hook
 * 
 * @param initialState - Initial state
 * @returns Mock hook that returns [state, actions]
 * 
 * @example
 * const useMockStore = createMockStoreHook({ score: 100 });
 * const [state, actions] = useMockStore();
 */
export function createMockStoreHook<T extends Record<string, unknown>>(initialState: T) {
  const { getState, setState, reset, updateState } = createMockStore(initialState);

  // Mock selector behavior
  const useStore = <S>(selector?: (state: T) => S) => {
    if (selector) {
      return selector(state);
    }
    return state;
  };

  // Attach store methods for direct access
  (useStore as Mock).getState = getState;
  (useStore as Mock).setState = setState;
  (useStore as Mock).reset = reset;

  return useStore;
}

/**
 * Example: Mock for GameScoreStore
 * Use this pattern to create specific store mocks
 */
export const createGameScoreStoreMock = () => 
  createMockStore({
    score: 0,
    highScore: 0,
    isPlaying: false,
    isPaused: false,
    gameOver: false,
    victory: false,
  });

/**
 * Example: Mock for a generic Zustand store
 * 
 * @example
 * // In your test file
 * vi.mock('@/store/myStore', () => ({
 *   useMyStore: createGenericMockStore({
 *     items: [],
 *     loading: false,
 *   }),
 * }));
 */
export function createGenericMockStore<T extends Record<string, unknown>>(initialState: T) {
  return () => {
    const { getState, setState, reset, updateState } = createMockStore(initialState);
    
    // Return hook-like interface
    return [
      getState(),
      {
        ...setState,
        reset,
        updateState,
      },
    ] as const;
  };
}