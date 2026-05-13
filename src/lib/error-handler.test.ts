/**
 * Tests for the error handling utilities.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'sonner';
import { isNetworkError, isTimeoutError, getUserMessage, showError, showSuccess, showInfo, logError, withErrorHandling } from './error-handler';

vi.mock('sonner', () => {
  const t = vi.fn() as any;
  t.error = vi.fn();
  t.warning = vi.fn();
  t.success = vi.fn();
  return { toast: t };
});

describe('isNetworkError', () => {
  describe('detects network errors', () => {
    it('detects "Failed to fetch" TypeError', () => {
      const error = new TypeError('Failed to fetch');

      expect(isNetworkError(error)).toBe(true);
    });

    it('detects "NetworkError when fetching" TypeError', () => {
      const error = new TypeError('NetworkError when fetching https://api.example.com');

      expect(isNetworkError(error)).toBe(true);
    });

    it('detects "Network request failed" TypeError', () => {
      const error = new TypeError('Network request failed');

      expect(isNetworkError(error)).toBe(true);
    });

    it('detects "failed to fetch" errors (lowercase)', () => {
      const error = new TypeError('failed to fetch');

      expect(isNetworkError(error)).toBe(true);
    });

    it('detects errors with "network" keyword', () => {
      const error = new Error('Network timeout occurred');

      expect(isNetworkError(error)).toBe(true);
    });

    it('detects errors with "fetch" in the message', () => {
      const error = new Error('Failed to fetch resource');

      expect(isNetworkError(error)).toBe(true);
    });

    it('detects errors with "internet" in the message', () => {
      const error = new Error('No internet connection available');

      expect(isNetworkError(error)).toBe(true);
    });
  });

  describe('case insensitive matching', () => {
    it('matches uppercase network keywords', () => {
      const error = new Error('NETWORK ERROR');

      expect(isNetworkError(error)).toBe(true);
    });

    it('matches mixed case network keywords', () => {
      const error = new Error('Failed to FeTcH');

      expect(isNetworkError(error)).toBe(true);
    });
  });

  describe('returns false for non-network errors', () => {
    it('returns false for a regular Error', () => {
      const error = new Error('Something went wrong');

      expect(isNetworkError(error)).toBe(false);
    });

    it('returns false for a SyntaxError', () => {
      const error = new SyntaxError('Unexpected token');

      expect(isNetworkError(error)).toBe(false);
    });

    it('returns false for a RangeError', () => {
      const error = new RangeError('Maximum call stack size exceeded');

      expect(isNetworkError(error)).toBe(false);
    });
  });

  describe('handles non-Error values', () => {
    it('returns false for a string', () => {
      expect(isNetworkError('Failed to fetch')).toBe(false);
    });

    it('returns false for a number', () => {
      expect(isNetworkError(42)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isNetworkError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isNetworkError(undefined)).toBe(false);
    });

    it('returns false for an empty object', () => {
      expect(isNetworkError({})).toBe(false);
    });
  });
});

describe('isTimeoutError', () => {
  describe('detects timeout errors', () => {
    it('detects "timeout" in error message', () => {
      const error = new Error('Request timeout');

      expect(isTimeoutError(error)).toBe(true);
    });

    it('detects "timeout" in error message (timeout substring match)', () => {
      const error = new Error('Operation timed out due to timeout');

      expect(isTimeoutError(error)).toBe(true);
    });

    it('detects AbortError when message contains "timeout" substring', () => {
      const error = new Error('Abort timeout reached');

      expect(isTimeoutError(error)).toBe(true);
    });

    it('detects custom TimeoutError subclass', () => {
      // Simulates a custom TimeoutError with "timeout" in the message
      const error = new Error('TimeoutError: Operation timed out');

      expect(isTimeoutError(error)).toBe(true);
    });
  });

  describe('case insensitive matching', () => {
    it('matches uppercase TIMEOUT', () => {
      const error = new Error('TIMEOUT');

      expect(isTimeoutError(error)).toBe(true);
    });

    it('matches mixed case timeout', () => {
      const error = new Error('TiMeOuT exceeded');

      expect(isTimeoutError(error)).toBe(true);
    });
  });

  describe('returns false for non-timeout errors', () => {
    it('returns false for a regular Error', () => {
      const error = new Error('Something went wrong');

      expect(isTimeoutError(error)).toBe(false);
    });

    it('returns false for a TypeError without timeout', () => {
      const error = new TypeError('Invalid argument');

      expect(isTimeoutError(error)).toBe(false);
    });

    it('returns false for a NetworkError without timeout', () => {
      const error = new TypeError('Network request failed');

      expect(isTimeoutError(error)).toBe(false);
    });
  });

  describe('handles non-Error values', () => {
    it('returns false for a string containing "timeout"', () => {
      expect(isTimeoutError('timeout')).toBe(false);
    });

    it('returns false for a number', () => {
      expect(isTimeoutError(408)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isTimeoutError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isTimeoutError(undefined)).toBe(false);
    });
  });
});

describe('getUserMessage', () => {
  describe('network-related errors', () => {
    it('returns connection issue for errors containing "network"', () => {
      const error = new Error('Network error');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Connection Issue',
        description: 'Please check your internet connection and try again.',
      });
    });

    it('returns connection issue for errors containing "fetch"', () => {
      const error = new TypeError('Failed to fetch');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Connection Issue',
        description: 'Please check your internet connection and try again.',
      });
    });

    it('returns connection issue for errors containing "internet"', () => {
      const error = new Error('No internet connection');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Connection Issue',
        description: 'Please check your internet connection and try again.',
      });
    });
  });

  describe('timeout errors', () => {
    it('returns request timeout for errors containing "timeout"', () => {
      const error = new Error('Request timeout');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Request Timeout',
        description: 'The server took too long to respond. Please try again.',
      });
    });

    it('returns request timeout for errors containing "timed out"', () => {
      const error = new Error('The server timed out');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Request Timeout',
        description: 'The server took too long to respond. Please try again.',
      });
    });
  });

  describe('API / server errors', () => {
    it('returns server error for 500 errors', () => {
      const error = new Error('HTTP 500 Internal Server Error');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
      });
    });

    it('returns server error for "server error" message', () => {
      const error = new Error('server error occurred');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
      });
    });

    it('returns invalid request for 400 errors', () => {
      const error = new Error('HTTP 400 Bad Request');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Invalid Request',
        description: 'The request could not be processed. Please try again.',
      });
    });

    it('returns invalid request for "bad request" message', () => {
      const error = new Error('bad request');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Invalid Request',
        description: 'The request could not be processed. Please try again.',
      });
    });

    it('returns session expired for 401 errors', () => {
      const error = new Error('HTTP 401 Unauthorized');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Session Expired',
        description: 'Please refresh the page and try again.',
      });
    });

    it('returns session expired for "unauthorized" message', () => {
      const error = new Error('unauthorized access');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Session Expired',
        description: 'Please refresh the page and try again.',
      });
    });

    it('returns access denied for 403 errors', () => {
      const error = new Error('HTTP 403 Forbidden');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
      });
    });

    it('returns access denied for "forbidden" message', () => {
      const error = new Error('forbidden resource');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
      });
    });
  });

  describe('storage errors', () => {
    it('returns storage unavailable for LocalStorage errors', () => {
      const error = new Error('QuotaExceededError: LocalStorage');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Storage Unavailable',
        description: 'Your browser storage is full or unavailable. Some features may not work.',
      });
    });

    it('returns storage unavailable for generic "storage" errors', () => {
      const error = new Error('Storage engine not available');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Storage Unavailable',
        description: 'Your browser storage is full or unavailable. Some features may not work.',
      });
    });
  });

  describe('regular Error objects', () => {
    it('returns default message for a generic Error without matched keywords', () => {
      const error = new Error('Something went wrong');

      const result = getUserMessage(error);

      expect(result).toEqual({
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
      });
    });

    it('handles errors with custom messages', () => {
      const error = new Error('Custom validation failed');

      const result = getUserMessage(error);

      expect(result.title).toBe('Something Went Wrong');
      expect(result.description).toBe('An unexpected error occurred. Please try again.');
    });

    it('handles Error subclasses', () => {
      const error = new SyntaxError('Invalid JSON');

      const result = getUserMessage(error);

      expect(result.title).toBe('Something Went Wrong');
      expect(result.description).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('non-Error values fallback', () => {
    it('returns default message for a string', () => {
      const result = getUserMessage('Something broke');

      expect(result).toEqual({
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
      });
    });

    it('returns default message for a number', () => {
      const result = getUserMessage(42);

      expect(result).toEqual({
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
      });
    });

    it('returns default message for null', () => {
      const result = getUserMessage(null);

      expect(result).toEqual({
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
      });
    });

    it('returns default message for undefined', () => {
      const result = getUserMessage(undefined);

      expect(result).toEqual({
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
      });
    });

    it('returns default message for an empty string', () => {
      const result = getUserMessage('');

      expect(result).toEqual({
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
      });
    });

    it('returns default message for an array', () => {
      const result = getUserMessage(['error', 'details']);

      expect(result).toEqual({
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
      });
    });

    it('returns default message for an object', () => {
      const result = getUserMessage({ code: 500, message: 'Internal error' });

      expect(result).toEqual({
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
      });
    });

    it('returns default message for a boolean', () => {
      const result = getUserMessage(true);

      expect(result).toEqual({
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
      });
    });
  });

  describe('returns consistent object shape', () => {
    it('always returns an object with title and description', () => {
      const testCases: unknown[] = [
        new Error('any error'),
        'string error',
        42,
        null,
        undefined,
        true,
        [],
        {},
      ];

      testCases.forEach((error) => {
        const result = getUserMessage(error);

        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('description');
        expect(typeof result.title).toBe('string');
        expect(typeof result.description).toBe('string');
        expect(result.title.length).toBeGreaterThan(0);
        expect(result.description.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('showError', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('calls toast.error for critical severity', () => {
    showError(new Error('test'), 'critical');
    expect(toast.error).toHaveBeenCalled();
  });

  it('calls toast.warning for warning severity', () => {
    showError(new Error('test'), 'warning');
    expect(toast.warning).toHaveBeenCalled();
  });

  it('calls toast function for default severity', () => {
    showError(new Error('test'));
    expect(toast).toHaveBeenCalled();
  });
});

describe('showSuccess', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('calls toast.success with title', () => {
    showSuccess('Done!', 'All good');
    expect(toast.success).toHaveBeenCalledWith('Done!', expect.objectContaining({ description: 'All good' }));
  });
});

describe('showInfo', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('calls toast with title', () => {
    showInfo('Info');
    expect(toast).toHaveBeenCalledWith('Info', expect.any(Object));
  });
});

describe('logError', () => {
  it('calls console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logError('test', new Error('boom'), { key: 'val' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('withErrorHandling', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns result on success', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await withErrorHandling(fn, 'test');
    expect(result).toBe('ok');
  });

  it('shows success message when provided', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    await withErrorHandling(fn, 'test', { successMessage: 'Success!' });
    expect(toast.success).toHaveBeenCalledWith('Success!', expect.any(Object));
  });

  it('returns null and shows toast on error', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Network error'));
    const result = await withErrorHandling(fn, 'test');
    expect(result).toBeNull();
    expect(toast).toHaveBeenCalled();
  });

  it('does not show error toast when showErrorToast is false', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('test'));
    const result = await withErrorHandling(fn, 'test', { showErrorToast: false });
    expect(result).toBeNull();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
