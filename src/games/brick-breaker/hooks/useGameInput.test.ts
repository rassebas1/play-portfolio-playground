import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameInput } from './useGameInput';
import { GameStatus } from '../types';
import { PADDLE_SPEED } from '../constants';
import type { MutableRefObject } from 'react';

describe('useGameInput', () => {
  const mockDispatch = vi.fn();
  let gameBoardElement: HTMLDivElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let gameBoardRef: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let stateRef: any;

  beforeEach(() => {
    mockDispatch.mockClear();

    gameBoardElement = document.createElement('div');
    gameBoardElement.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    // jsdom doesn't implement setPointerCapture, mock it
    gameBoardElement.setPointerCapture = vi.fn();

    gameBoardRef = { current: gameBoardElement };
    stateRef = { current: null };
  });

  afterEach(() => {
    mockDispatch.mockClear();
  });

  describe('keyboard input', () => {
    it('moves paddle left on ArrowLeft during PLAYING', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: -PADDLE_SPEED } });
    });

    it('moves paddle right on ArrowRight during PLAYING', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: PADDLE_SPEED } });
    });

    it('stops paddle on ArrowLeft keyup', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: 0 } });
    });

    it('stops paddle on ArrowRight keyup', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: 0 } });
    });

    it('starts game on Space when IDLE', () => {
      stateRef.current = { gameStatus: GameStatus.IDLE, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'START_GAME' });
    });

    it('pauses game on Space when PLAYING', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'PAUSE_GAME' });
    });

    it('resumes game on Space when PAUSED', () => {
      stateRef.current = { gameStatus: GameStatus.PAUSED, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESUME_GAME' });
    });

    it('resets game on R key', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET_GAME' });
    });

    it('resets game on uppercase R key', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'R' }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET_GAME' });
    });

    it('does not move paddle on ArrowLeft when not PLAYING', () => {
      stateRef.current = { gameStatus: GameStatus.IDLE, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('cleans up keyboard event listeners on unmount', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      const { unmount } = renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));
      unmount();

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      // After unmount, the listener should be removed
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('pointer input (mobile)', () => {
    const createPointerEvent = (type: string, opts: Partial<PointerEventInit> = {}): PointerEvent => {
      return new PointerEvent(type, {
        clientX: 0,
        clientY: 0,
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        ...opts,
      });
    };

    it('attaches pointer events only when isMobile is true', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      const addEventListenerSpy = vi.spyOn(gameBoardElement, 'addEventListener');

      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: false, gameBoardRef }));

      expect(addEventListenerSpy).not.toHaveBeenCalled();
      addEventListenerSpy.mockRestore();
    });

    it('attaches pointer events when isMobile is true', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      const addEventListenerSpy = vi.spyOn(gameBoardElement, 'addEventListener');

      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      expect(addEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function), { passive: false });
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointermove', expect.any(Function), { passive: false });
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointerup', expect.any(Function), { passive: false });
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function), { passive: false });
      addEventListenerSpy.mockRestore();
    });

    it('calls setPointerCapture on pointerdown', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      gameBoardElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 400, clientY: 300 }));

      expect(gameBoardElement.setPointerCapture).toHaveBeenCalledWith(1);
    });

    it('stops paddle (dx=0) when pointer is within dead zone', () => {
      // Paddle center = 300 + 50 = 350. Dead zone half = (100 * 0.5) / 2 = 25
      // touchX = 360 → distance = 360 - 350 = 10 → |10| <= 25 → dx = 0
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      gameBoardElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 400, clientY: 300 }));
      gameBoardElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 360, clientY: 300 }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: 0 } });
    });

    it('moves paddle left when pointer is left of dead zone', () => {
      // Paddle center = 300 + 50 = 350. Dead zone half = 25
      // touchX = 300 → distance = 300 - 350 = -50 → |-50| > 25 → dx = -PADDLE_SPEED
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      gameBoardElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 400, clientY: 300 }));
      gameBoardElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 300, clientY: 300 }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: -PADDLE_SPEED } });
    });

    it('moves paddle right when pointer is right of dead zone', () => {
      // Paddle center = 300 + 50 = 350. Dead zone half = 25
      // touchX = 400 → distance = 400 - 350 = 50 → |50| > 25 → dx = +PADDLE_SPEED
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      gameBoardElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 400, clientY: 300 }));
      gameBoardElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 400, clientY: 300 }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: PADDLE_SPEED } });
    });

    it('does not respond to pointermove when not PLAYING', () => {
      stateRef.current = { gameStatus: GameStatus.IDLE, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      gameBoardElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 400, clientY: 300 }));
      gameBoardElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 400, clientY: 300 }));

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('stops paddle on pointerup', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      gameBoardElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 400, clientY: 300 }));
      gameBoardElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 400, clientY: 300 }));
      mockDispatch.mockClear();

      gameBoardElement.dispatchEvent(createPointerEvent('pointerup', { clientX: 400, clientY: 300 }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: 0 } });
    });

    it('stops paddle on pointercancel', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      gameBoardElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 400, clientY: 300 }));
      gameBoardElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 400, clientY: 300 }));
      mockDispatch.mockClear();

      gameBoardElement.dispatchEvent(createPointerEvent('pointercancel', { clientX: 400, clientY: 300 }));

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: 0 } });
    });

    it('does nothing when gameBoardRef is null', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      const nullRef = { current: null } as React.RefObject<HTMLDivElement | null>;

      expect(() => {
        renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef: nullRef }));
      }).not.toThrow();
    });

    it('cleans up pointer event listeners on unmount', () => {
      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      const removeEventListenerSpy = vi.spyOn(gameBoardElement, 'removeEventListener');
      const { unmount } = renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });

    it('computes touchX relative to game board position', () => {
      // GameBoard is offset 50px from viewport left
      // touch clientX = 400 → relative to board = 400 - 50 = 350 = paddle center → dead zone → dx = 0
      gameBoardElement.getBoundingClientRect = vi.fn(() => ({
        left: 50, top: 0, right: 850, bottom: 600, width: 800, height: 600, x: 50, y: 0, toJSON: () => {},
      }));

      stateRef.current = { gameStatus: GameStatus.PLAYING, paddle: { width: 100, x: 300 }, canvas: { width: 800 } };
      renderHook(() => useGameInput({ dispatch: mockDispatch, stateRef, isMobile: true, gameBoardRef }));

      gameBoardElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 400, clientY: 300 }));
      gameBoardElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 400, clientY: 300 }));

      // touchX = 400 - 50 = 350, paddleCenter = 350 → dead zone → dx = 0
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PADDLE_VELOCITY', payload: { dx: 0 } });
    });
  });
});
