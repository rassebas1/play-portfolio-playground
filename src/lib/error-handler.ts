import { toast } from 'sonner';

/**
 * Error handling utilities for the application
 * Provides user-friendly error messages and logging
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Maps technical errors to user-friendly messages
 */
export const getUserMessage = (error: unknown): { title: string; description: string } => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('internet')) {
      return {
        title: 'Connection Issue',
        description: 'Please check your internet connection and try again.',
      };
    }
    
    // Timeout errors
    if (message.includes('timeout') || message.includes('timed out')) {
      return {
        title: 'Request Timeout',
        description: 'The server took too long to respond. Please try again.',
      };
    }
    
    // API/Server errors
    if (message.includes('500') || message.includes('server error')) {
      return {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
      };
    }
    
    if (message.includes('400') || message.includes('bad request')) {
      return {
        title: 'Invalid Request',
        description: 'The request could not be processed. Please try again.',
      };
    }
    
    if (message.includes('401') || message.includes('unauthorized')) {
      return {
        title: 'Session Expired',
        description: 'Please refresh the page and try again.',
      };
    }
    
    if (message.includes('403') || message.includes('forbidden')) {
      return {
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
      };
    }
    
    // localStorage errors
    if (message.includes('localstorage') || message.includes('storage')) {
      return {
        title: 'Storage Unavailable',
        description: 'Your browser storage is full or unavailable. Some features may not work.',
      };
    }
  }
  
  // Default fallback
  return {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again.',
  };
};

/**
 * Shows an error toast with user-friendly message
 */
export const showError = (error: unknown, severity: ErrorSeverity = 'error'): void => {
  const { title, description } = getUserMessage(error);
  
  if (severity === 'critical') {
    toast.error(title, {
      description: description,
      duration: 10000,
    });
  } else if (severity === 'warning') {
    toast.warning(title, {
      description: description,
      duration: 5000,
    });
  } else {
    toast(title, {
      description: description,
      duration: 4000,
    });
  }
};

/**
 * Shows a success toast
 */
export const showSuccess = (title: string, description?: string): void => {
  toast.success(title, {
    description,
    duration: 3000,
  });
};

/**
 * Shows an info toast
 */
export const showInfo = (title: string, description?: string): void => {
  toast(title, {
    description,
    duration: 3000,
  });
};

/**
 * Logs error to console (and could be extended to send to logging service)
 */
export const logError = (context: string, error: unknown, extra?: Record<string, unknown>): void => {
  console.error(`[Error - ${context}]`, error, extra);
  
  // Future: could send to external logging service like Sentry
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra });
  // }
};

/**
 * Checks if the error is a network-related error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('network') || 
           message.includes('fetch') || 
           message.includes('internet') ||
           message.includes('failed to fetch');
  }
  return false;
};

/**
 * Checks if the error is a timeout error
 */
export const isTimeoutError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('timeout');
  }
  return false;
};

/**
 * Async wrapper that shows toast on error
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  context: string,
  options?: {
    successMessage?: string;
    showErrorToast?: boolean;
  }
): Promise<T | null> => {
  try {
    const result = await fn();
    if (options?.successMessage) {
      showSuccess(options.successMessage);
    }
    return result;
  } catch (error) {
    logError(context, error);
    if (options?.showErrorToast !== false) {
      showError(error);
    }
    return null;
  }
};