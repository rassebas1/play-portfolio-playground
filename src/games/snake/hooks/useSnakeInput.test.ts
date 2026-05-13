import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSnakeInput } from './useSnakeInput';

describe('useSnakeInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('attaches keydown listener on mount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');

    renderHook(() => useSnakeInput({ dispatch: vi.fn(), gameStarted: true, gameOver: false }));

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    addSpy.mockRestore();
  });

  it.each([
    ['ArrowUp', 'UP'],
    ['ArrowDown', 'DOWN'],
    ['ArrowLeft', 'LEFT'],
    ['ArrowRight', 'RIGHT'],
  ] as const)('dispatches CHANGE_DIRECTION with %s', (key, expected) => {
    const dispatch = vi.fn();

    renderHook(() => useSnakeInput({ dispatch, gameStarted: true, gameOver: false }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

    expect(dispatch).toHaveBeenCalledWith({ type: 'CHANGE_DIRECTION', payload: expected });
  });

  it('ignores non-arrow keys', () => {
    const dispatch = vi.fn();

    renderHook(() => useSnakeInput({ dispatch, gameStarted: true, gameOver: false }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'KeyW', bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('ignores arrow keys when game not started', () => {
    const dispatch = vi.fn();

    renderHook(() => useSnakeInput({ dispatch, gameStarted: false, gameOver: false }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('ignores arrow keys when game is over', () => {
    const dispatch = vi.fn();

    renderHook(() => useSnakeInput({ dispatch, gameStarted: true, gameOver: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('calls preventDefault on arrow key events', () => {
    const dispatch = vi.fn();

    renderHook(() => useSnakeInput({ dispatch, gameStarted: true, gameOver: false }));

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true, bubbles: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('does NOT call preventDefault on non-arrow keys', () => {
    const dispatch = vi.fn();

    renderHook(() => useSnakeInput({ dispatch, gameStarted: true, gameOver: false }));

    const event = new KeyboardEvent('keydown', { key: 'Space', cancelable: true, bubbles: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    document.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('removes listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useSnakeInput({ dispatch: vi.fn(), gameStarted: true, gameOver: false })
    );
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });
});
