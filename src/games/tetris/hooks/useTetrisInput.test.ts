import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTetrisInput } from './useTetrisInput';

describe('useTetrisInput', () => {
  const createMockHandlers = () => ({
    onMoveLeft: vi.fn(),
    onMoveRight: vi.fn(),
    onMoveDown: vi.fn(),
    onRotateClockwise: vi.fn(),
    onRotateCounterclockwise: vi.fn(),
    onHardDrop: vi.fn(),
    onHold: vi.fn(),
    onPause: vi.fn(),
  });

  const dispatchKeyDown = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  };

  const dispatchKeyUp = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('game key dispatch', () => {
    it('calls onMoveLeft on ArrowLeft', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));
      dispatchKeyDown('ArrowLeft');
      expect(handlers.onMoveLeft).toHaveBeenCalledTimes(1);
    });

    it('calls onMoveRight on ArrowRight', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));
      dispatchKeyDown('ArrowRight');
      expect(handlers.onMoveRight).toHaveBeenCalledTimes(1);
    });

    it('calls onRotateClockwise on ArrowUp', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));
      dispatchKeyDown('ArrowUp');
      expect(handlers.onRotateClockwise).toHaveBeenCalledTimes(1);
    });

    it('calls onRotateClockwise on x and X', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));
      dispatchKeyDown('x');
      expect(handlers.onRotateClockwise).toHaveBeenCalledTimes(1);
      dispatchKeyDown('X');
      expect(handlers.onRotateClockwise).toHaveBeenCalledTimes(2);
    });

    it('calls onRotateCounterclockwise on z and Z', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));
      dispatchKeyDown('z');
      expect(handlers.onRotateCounterclockwise).toHaveBeenCalledTimes(1);
      dispatchKeyDown('Z');
      expect(handlers.onRotateCounterclockwise).toHaveBeenCalledTimes(2);
    });

    it('calls onHardDrop on Space', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));
      dispatchKeyDown(' ');
      expect(handlers.onHardDrop).toHaveBeenCalledTimes(1);
    });

    it('calls onHold on c and C', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));
      dispatchKeyDown('c');
      expect(handlers.onHold).toHaveBeenCalledTimes(1);
      dispatchKeyDown('C');
      expect(handlers.onHold).toHaveBeenCalledTimes(2);
    });
  });

  describe('soft drop', () => {
    it('calls onMoveDown on ArrowDown and starts a repeating interval', () => {
      vi.useFakeTimers();
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));

      dispatchKeyDown('ArrowDown');
      expect(handlers.onMoveDown).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      expect(handlers.onMoveDown).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(100);
      expect(handlers.onMoveDown).toHaveBeenCalledTimes(4);
    });

    it('does not call onMoveDown again on repeated keydown while soft dropping', () => {
      vi.useFakeTimers();
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));

      dispatchKeyDown('ArrowDown');
      expect(handlers.onMoveDown).toHaveBeenCalledTimes(1);

      dispatchKeyDown('ArrowDown');
      expect(handlers.onMoveDown).toHaveBeenCalledTimes(1);
    });

    it('stops the soft drop interval on ArrowUp keyup', () => {
      vi.useFakeTimers();
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));

      dispatchKeyDown('ArrowDown');
      vi.advanceTimersByTime(50);
      const callsAfterFirstInterval = handlers.onMoveDown.mock.calls.length;

      dispatchKeyUp('ArrowDown');
      vi.advanceTimersByTime(200);

      expect(handlers.onMoveDown).toHaveBeenCalledTimes(callsAfterFirstInterval);
    });

    it('clears soft drop interval on unmount', () => {
      vi.useFakeTimers();
      const handlers = createMockHandlers();
      const { unmount } = renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));

      dispatchKeyDown('ArrowDown');
      unmount();

      const callsAtUnmount = handlers.onMoveDown.mock.calls.length;
      vi.advanceTimersByTime(200);
      expect(handlers.onMoveDown).toHaveBeenCalledTimes(callsAtUnmount);
    });
  });

  describe('pause keys always work', () => {
    it('calls onPause on Escape regardless of isPlaying', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: false }));
      dispatchKeyDown('Escape');
      expect(handlers.onPause).toHaveBeenCalledTimes(1);
    });

    it('calls onPause on p and P regardless of isPlaying', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: false }));
      dispatchKeyDown('p');
      expect(handlers.onPause).toHaveBeenCalledTimes(1);
      dispatchKeyDown('P');
      expect(handlers.onPause).toHaveBeenCalledTimes(2);
    });

    it('calls onPause on Escape when isPlaying is true', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));
      dispatchKeyDown('Escape');
      expect(handlers.onPause).toHaveBeenCalledTimes(1);
    });
  });

  describe('isPlaying guard', () => {
    it('does nothing for game keys when isPlaying is false (except pause)', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: false }));

      dispatchKeyDown('ArrowLeft');
      dispatchKeyDown('ArrowRight');
      dispatchKeyDown('ArrowDown');
      dispatchKeyDown('ArrowUp');
      dispatchKeyDown(' ');
      dispatchKeyDown('x');
      dispatchKeyDown('z');
      dispatchKeyDown('c');

      expect(handlers.onMoveLeft).not.toHaveBeenCalled();
      expect(handlers.onMoveRight).not.toHaveBeenCalled();
      expect(handlers.onMoveDown).not.toHaveBeenCalled();
      expect(handlers.onRotateClockwise).not.toHaveBeenCalled();
      expect(handlers.onRotateCounterclockwise).not.toHaveBeenCalled();
      expect(handlers.onHardDrop).not.toHaveBeenCalled();
      expect(handlers.onHold).not.toHaveBeenCalled();
    });
  });

  describe('non-game keys', () => {
    it('ignores keys not in the game keyset', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));

      dispatchKeyDown('Enter');
      dispatchKeyDown('Tab');
      dispatchKeyDown('a');
      dispatchKeyDown('b');
      dispatchKeyDown('1');
      dispatchKeyDown('F5');
      dispatchKeyDown('F12');

      expect(handlers.onMoveLeft).not.toHaveBeenCalled();
      expect(handlers.onMoveRight).not.toHaveBeenCalled();
      expect(handlers.onMoveDown).not.toHaveBeenCalled();
      expect(handlers.onRotateClockwise).not.toHaveBeenCalled();
      expect(handlers.onRotateCounterclockwise).not.toHaveBeenCalled();
      expect(handlers.onHardDrop).not.toHaveBeenCalled();
      expect(handlers.onHold).not.toHaveBeenCalled();
      expect(handlers.onPause).not.toHaveBeenCalled();
    });
  });

  describe('preventDefault', () => {
    it('calls preventDefault on game keys when playing', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true, bubbles: true });
      const spy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });

    it('calls preventDefault on pause keys even when not playing', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: false }));

      const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true });
      const spy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });

    it('does not call preventDefault on non-game keys', () => {
      const handlers = createMockHandlers();
      renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));

      const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true });
      const spy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('lifecycle', () => {
    it('removes keydown and keyup listeners on unmount', () => {
      const removeKeydown = vi.spyOn(window, 'removeEventListener');
      const handlers = createMockHandlers();

      const { unmount } = renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));
      unmount();

      expect(removeKeydown).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(removeKeydown).toHaveBeenCalledWith('keyup', expect.any(Function));

      removeKeydown.mockRestore();
    });

    it('no longer responds to keys after unmount', () => {
      const handlers = createMockHandlers();
      const { unmount } = renderHook(() => useTetrisInput({ ...handlers, isPlaying: true }));

      unmount();
      dispatchKeyDown('ArrowLeft');
      dispatchKeyDown('ArrowRight');
      dispatchKeyDown('ArrowDown');
      dispatchKeyDown('ArrowUp');

      expect(handlers.onMoveLeft).not.toHaveBeenCalled();
      expect(handlers.onMoveRight).not.toHaveBeenCalled();
      expect(handlers.onMoveDown).not.toHaveBeenCalled();
      expect(handlers.onRotateClockwise).not.toHaveBeenCalled();
    });
  });
});
