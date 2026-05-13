import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary } from './error-boundary';

vi.mock('@/lib/error-handler', () => ({
  logError: vi.fn(),
}));

const GoodComponent = () => <div>All good</div>;

const BuggyComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error', () => {
    render(<ErrorBoundary><GoodComponent /></ErrorBoundary>);
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders fallback UI on error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><BuggyComponent /></ErrorBoundary>);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary fallback={<div>Custom Error</div>}>
        <BuggyComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('shows error details when expanded', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><BuggyComponent /></ErrorBoundary>);
    fireEvent.click(screen.getByText('Error details'));
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});

describe('withErrorBoundary', () => {
  it('wraps component', () => {
    const Wrapped = withErrorBoundary(GoodComponent);
    render(<Wrapped />);
    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
