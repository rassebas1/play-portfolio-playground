import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from './i18n-test';

// Create a QueryClient for tests with disabled retry to speed up tests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0, // cacheTime is now gcTime in v5
    },
  },
});

// Default wrapper that includes all providers
function DefaultProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>{children}</BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

/**
 * Custom render function that includes all necessary providers:
 * - BrowserRouter for React Router
 * - QueryClientProvider for React Query
 * - I18nextProvider for internationalization
 *
 * Usage:
 * import { renderWithProviders } from '@/tests/utils/render';
 *
 * // Basic usage
 * renderWithProviders(<MyComponent />);
 *
 * // With custom options
 * renderWithProviders(<MyComponent />, {
 *   route: '/some-route'
 * });
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    /**
     * Initial route to set for the test
     * Note: This uses a simple approach - for more complex routing tests,
     * consider using @testing-library/react-router-mock or similar
     */
    route?: string;
  }
) {
  const { route, ...restOptions } = options || {};

  // For route support, we'd need additional setup
  // For now, render with providers
  return render(ui, {
    wrapper: DefaultProviders,
    ...restOptions,
  });
}

// Re-export everything from testing-library for convenience
export * from '@testing-library/react';

// Export queryClient for cases where tests need to manipulate it
export { queryClient };