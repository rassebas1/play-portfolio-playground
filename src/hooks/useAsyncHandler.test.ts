import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsyncHandler, useRetryableAsync, useSafeOperation } from './useAsyncHandler';

vi.mock('@/lib/error-handler', () => ({
  showError: vi.fn(),
  logError: vi.fn(),
  isNetworkError: vi.fn().mockImplementation((error: unknown) => {
    if (error instanceof Error) {
      return error.message.includes('network') || error.message.includes('fetch');
    }
    return false;
  }),
  isTimeoutError: vi.fn().mockImplementation((error: unknown) => {
    if (error instanceof Error) {
      return error.message.includes('timeout');
    }
    return false;
  }),
}));

describe('useAsyncHandler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('initializes with isLoading false, error null, data null', () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toBeNull();
    });

    it('reports isIdle correctly', () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('execute', () => {
    it('sets loading state to true during execution', async () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const asyncFn = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve('success'), 100))
      );

      let loadingDuringExecution = false;
      
      act(() => {
        result.current.execute(asyncFn).then(() => {
          loadingDuringExecution = result.current.isLoading;
        });
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(loadingDuringExecution).toBe(true);
    });

    it('sets data on successful execution', async () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const asyncFn = vi.fn().mockResolvedValue('success data');
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(result.current.data).toBe('success data');
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('returns the result from execute', async () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const asyncFn = vi.fn().mockResolvedValue('result');
      
      let executeResult: string | null = null;
      await act(async () => {
        executeResult = await result.current.execute(asyncFn);
      });

      expect(executeResult).toBe('result');
    });

    it('sets error on failed execution', async () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const error = new Error('Async error');
      const asyncFn = vi.fn().mockRejectedValue(error);
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('returns null on error', async () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const asyncFn = vi.fn().mockRejectedValue(new Error('Error'));
      
      let executeResult: string | null = 'not called';
      await act(async () => {
        executeResult = await result.current.execute(asyncFn);
      });

      expect(executeResult).toBeNull();
    });

    it('uses custom context when provided', async () => {
      const { result } = renderHook(() => useAsyncHandler('initial-context'));
      
      const asyncFn = vi.fn().mockResolvedValue('data');
      
      await act(async () => {
        await result.current.execute(asyncFn, 'custom-context');
      });

      expect(asyncFn).toHaveBeenCalled();
    });

    it('handles non-Error thrown values', async () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const asyncFn = vi.fn().mockRejectedValue('string error');
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('string error');
    });
  });

  describe('callbacks', () => {
    it('calls onSuccess callback on success', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      
      const { result } = renderHook(() => 
        useAsyncHandler('test-context', { onSuccess, onError })
      );
      
      const asyncFn = vi.fn().mockResolvedValue('data');
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(onSuccess).toHaveBeenCalledWith('data');
      expect(onError).not.toHaveBeenCalled();
    });

    it('calls onError callback on failure', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const error = new Error('Test error');
      
      const { result } = renderHook(() => 
        useAsyncHandler('test-context', { onSuccess, onError })
      );
      
      const asyncFn = vi.fn().mockRejectedValue(error);
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(onError).toHaveBeenCalledWith(error);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('options', () => {
    it('respects showErrorOnFailure: false', async () => {
      const { result } = renderHook(() => 
        useAsyncHandler('test-context', { showErrorOnFailure: false })
      );
      
      const asyncFn = vi.fn().mockRejectedValue(new Error('Error'));
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(result.current.error).not.toBeNull();
    });
  });

  describe('reset', () => {
    it('resets state to initial values', async () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const asyncFn = vi.fn().mockResolvedValue('data');
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });
      
      expect(result.current.data).toBe('data');
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('isIdle state transitions', () => {
    it('isIdle is true initially', () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      expect(result.current.isIdle).toBe(true);
    });

    it('isIdle is false when loading', () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const asyncFn = vi.fn().mockImplementation(() => 
        new Promise(() => {})
      );
      
      act(() => {
        result.current.execute(asyncFn);
      });

      expect(result.current.isIdle).toBe(false);
    });

    it('isIdle is false after success with data', async () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const asyncFn = vi.fn().mockResolvedValue('data');
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(result.current.isIdle).toBe(false);
    });

    it('isIdle is false after error', async () => {
      const { result } = renderHook(() => useAsyncHandler('test-context'));
      
      const asyncFn = vi.fn().mockRejectedValue(new Error('error'));
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(result.current.isIdle).toBe(false);
    });
  });
});

describe('useRetryableAsync', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('initializes with default state', () => {
      const { result } = renderHook(() => useRetryableAsync('test-context'));
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toBeNull();
    });
  });

  describe('retry logic', () => {
    it('retries on network errors', async () => {
      vi.useRealTimers();
      const { result } = renderHook(() => useRetryableAsync('test-context', 3));
      
      const attempt = { count: 0 };
      const asyncFn = vi.fn().mockImplementation(() => {
        attempt.count++;
        if (attempt.count < 3) {
          return Promise.reject(new Error('network error'));
        }
        return Promise.resolve('success');
      });
      
      let executeResult: string | null = null;
      await act(async () => {
        executeResult = await result.current.execute(asyncFn);
      });

      expect(executeResult).toBe('success');
      expect(asyncFn).toHaveBeenCalledTimes(3);
    });

    it('stops retrying on non-network errors after first attempt', async () => {
      vi.useRealTimers();
      const { result } = renderHook(() => useRetryableAsync('test-context', 3));
      
      const asyncFn = vi.fn().mockRejectedValue(new Error('validation error'));
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(asyncFn).toHaveBeenCalledTimes(1);
      expect(result.current.error).toEqual(new Error('validation error'));
    });
  });

  describe('reset', () => {
    it('resets state via reset function', async () => {
      vi.useRealTimers();
      const { result } = renderHook(() => useRetryableAsync('test-context'));
      
      const asyncFn = vi.fn().mockResolvedValue('data');
      
      await act(async () => {
        await result.current.execute(asyncFn);
      });
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });
});

describe('useSafeOperation', () => {
  it('returns result of operation when successful', () => {
    const operation = vi.fn().mockReturnValue(42);
    const result = useSafeOperation(operation, 0, 'test');
    
    expect(result).toBe(42);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('returns fallback when operation throws', () => {
    const operation = vi.fn().mockImplementation(() => {
      throw new Error('operation failed');
    });
    const result = useSafeOperation(operation, -1, 'test');
    
    expect(result).toBe(-1);
  });

  it('returns fallback for non-Error exceptions', () => {
    const operation = vi.fn().mockImplementation(() => {
      throw 'string error';
    });
    const result = useSafeOperation(operation, 'fallback', 'test');
    
    expect(result).toBe('fallback');
  });
});