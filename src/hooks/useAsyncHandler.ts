import { useState, useCallback } from 'react';
import { showError, logError, isNetworkError, isTimeoutError, type ErrorSeverity } from '@/lib/error-handler';

/**
 * Hook for handling async operations with error handling
 */
export interface AsyncState<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | null;
}

export interface UseAsyncOptions {
  /** Show error toast on failure (default: true) */
  showErrorOnFailure?: boolean;
  /** Custom error severity for toast */
  errorSeverity?: ErrorSeverity;
  /** Callback on success */
  onSuccess?: (data: T) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Creates a wrapper around async functions with built-in error handling
 */
export const useAsyncHandler = <T>(
  context: string,
  options: UseAsyncOptions = {}
) => {
  const [state, setState] = useState<AsyncState<T>>({
    isLoading: false,
    error: null,
    data: null,
  });

  const execute = useCallback(async (
    asyncFn: () => Promise<T>,
    customContext?: string
  ): Promise<T | null> => {
    const errorContext = customContext || context;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await asyncFn();
      setState({ isLoading: false, error: null, data: result });
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      logError(errorContext, err);
      
      // Don't show toast for expected network errors that might spam
      if (options.showErrorOnFailure !== false && !isNetworkError(error) && !isTimeoutError(error)) {
        showError(error, options.errorSeverity || 'error');
      }
      
      if (options.onError) {
        options.onError(err);
      }
      
      setState({ isLoading: false, error: err, data: null });
      return null;
    }
  }, [context, options]);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isIdle: !state.isLoading && !state.error && !state.data,
  };
};

/**
 * Hook for handling operations that might fail (like localStorage)
 */
export const useSafeOperation = <T>(
  operation: () => T,
  fallback: T,
  context: string
): T => {
  try {
    return operation();
  } catch (error) {
    logError(context, error, { operation: operation.name });
    return fallback;
  }
};

/**
 * Hook for handling async operations with retry capability
 */
export const useRetryableAsync = <T>(
  context: string,
  maxRetries: number = 3
) => {
  const [state, setState] = useState<AsyncState<T>>({
    isLoading: false,
    error: null,
    data: null,
  });

  const executeWithRetry = useCallback(async (
    asyncFn: () => Promise<T>,
    retries: number = maxRetries
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await asyncFn();
        setState({ isLoading: false, error: null, data: result });
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on non-network errors
        if (!isNetworkError(error) && !isTimeoutError(error)) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    logError(context, lastError, { retries });
    showError(lastError, 'error');
    setState({ isLoading: false, error: lastError, data: null });
    return null;
  }, [context, maxRetries]);

  return {
    ...state,
    execute: executeWithRetry,
    reset: () => setState({ isLoading: false, error: null, data: null }),
  };
};