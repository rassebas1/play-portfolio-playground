import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { flushSync } from 'react';
import { useSwipeGesture } from './useSwipeGesture';

afterEach(() => {
  vi.restoreAllMocks();
});

function createTouchEvent(clientX: number, clientY: number) {
  const touch = { clientX, clientY };
  return {
    touches: [touch],
    changedTouches: [touch],
  } as unknown as React.TouchEvent;
}

describe('useSwipeGesture', () => {
  describe('interface', () => {
    it('returns onTouchStart and onTouchEnd handlers', () => {
      const { result } = renderHook(() => useSwipeGesture({ onSwipe: vi.fn() }));

      expect(result.current).toHaveProperty('onTouchStart');
      expect(result.current).toHaveProperty('onTouchEnd');
      expect(typeof result.current.onTouchStart).toBe('function');
      expect(typeof result.current.onTouchEnd).toBe('function');
    });
  });

  describe('swipe detection', () => {
    it('detects right swipe', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 25 })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 0));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(100, 0));
      });

      expect(onSwipe).toHaveBeenCalledWith('right');
    });

    it('detects left swipe', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 25 })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 0));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(0, 0));
      });

      expect(onSwipe).toHaveBeenCalledWith('left');
    });

    it('detects down swipe', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 25 })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 0));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(0, 100));
      });

      expect(onSwipe).toHaveBeenCalledWith('down');
    });

    it('detects up swipe', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 25 })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 100));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(0, 0));
      });

      expect(onSwipe).toHaveBeenCalledWith('up');
    });
  });

  describe('threshold', () => {
    it('does not call onSwipe when horizontal distance is below threshold', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 50 })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 0));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(20, 0));
      });

      expect(onSwipe).toHaveBeenCalledWith(null);
    });

    it('does not call onSwipe when vertical distance is below threshold', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 50 })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 0));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(0, 20));
      });

      expect(onSwipe).toHaveBeenCalledWith(null);
    });

    it('uses default minSwipeDistance of 25', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe })
      );

      // 24px should NOT trigger (below default 25)
      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 0));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(24, 0));
      });

      expect(onSwipe).toHaveBeenCalledWith(null);

      onSwipe.mockClear();

      // 26px SHOULD trigger (above default 25)
      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 0));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(26, 0));
      });

      expect(onSwipe).toHaveBeenCalledWith('right');
    });

    it('prefers dominant axis when both deltas exceed threshold', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 10 })
      );

      // deltaX = 50, deltaY = 10 -> should be horizontal (right)
      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 0));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(50, 10));
      });

      expect(onSwipe).toHaveBeenCalledWith('right');
    });
  });

  describe('edge cases', () => {
    it('does not call onSwipe when touchend fires without prior touchstart', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 25 })
      );

      act(() => {
        result.current.onTouchEnd(createTouchEvent(100, 100));
      });

      expect(onSwipe).not.toHaveBeenCalled();
    });

    it('calls onSwipe with null for equal horizontal and vertical movement', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 10 })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 0));
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent(20, 20));
      });

      // Equal deltas -> goes to vertical branch -> deltaY > 0 -> 'down'
      expect(onSwipe).toHaveBeenCalledWith('down');
    });
  });

  describe('state reset', () => {
    it('allows detecting a new swipe after previous one completes', () => {
      const onSwipe = vi.fn();
      const { result } = renderHook(() =>
        useSwipeGesture({ onSwipe, minSwipeDistance: 25 })
      );

      // First swipe: right
      act(() => {
        result.current.onTouchStart(createTouchEvent(0, 0));
      });
      act(() => {
        result.current.onTouchEnd(createTouchEvent(100, 0));
      });

      expect(onSwipe).toHaveBeenNthCalledWith(1, 'right');
      onSwipe.mockClear();

      // Second swipe: left
      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 0));
      });
      act(() => {
        result.current.onTouchEnd(createTouchEvent(0, 0));
      });

      expect(onSwipe).toHaveBeenNthCalledWith(1, 'left');
    });
  });
});
