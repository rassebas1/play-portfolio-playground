import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/error-handler';

interface Props {
  children: ReactNode;
  /** Optional: Name of the component this boundary wraps */
  componentName?: string;
  /** Optional: Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional: Fallback UI to render */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log the error with context
    logError(this.props.componentName || 'ErrorBoundary', error, {
      componentStack: errorInfo.componentStack,
    });

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // If there's a custom fallback, render it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                An unexpected error occurred. You can try again or reload the page.
              </p>
              
              {this.state.error && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground mb-2">
                    Error details
                  </summary>
                  <pre className="bg-muted p-2 rounded overflow-auto max-h-32 text-xs">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={this.handleReset} 
                  variant="default"
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload} 
                  variant="outline"
                  className="flex-1"
                >
                  Reload Page
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                If this keeps happening, please refresh the page.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Creates a wrapped component with error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<Props>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary componentName={Component.displayName || Component.name} {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Hook to programmatically trigger error boundary reset from children
 */
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);
  
  const throwError = (err: Error) => {
    setError(err);
  };
  
  const clearError = () => {
    setError(null);
  };
  
  if (error) {
    throw error;
  }
  
  return { throwError, clearError };
};
