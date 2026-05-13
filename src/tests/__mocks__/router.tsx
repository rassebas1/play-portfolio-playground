/**
 * React Router Mock for Testing
 * Provides mock functions for React Router hooks
 */

import { vi } from 'vitest';
import { useNavigate, useLocation, useParams, useRoutes } from 'react-router-dom';

// Create mock implementations
export const mockNavigate = vi.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};
export const mockParams = {};

// Override the hooks to return mock values
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
  useRoutes: vi.fn(),
  Navigate: vi.fn(({ to }: { to: string }) => `Navigate to ${to}`),
  Router: vi.fn(({ children }: { children: React.ReactNode }) => children),
  BrowserRouter: vi.fn(({ children }: { children: React.ReactNode }) => children),
  Link: vi.fn(({ to, children }: { to: string; children: React.ReactNode }) => 
    `<Link to="${to}">${children}</Link>`
  ),
  NavLink: vi.fn(),
}));

/**
 * Utility to set mock location
 */
export function setMockLocation(pathname: string, options?: {
  search?: string;
  hash?: string;
  state?: unknown;
}) {
  Object.assign(mockLocation, {
    pathname,
    search: options?.search || '',
    hash: options?.hash || '',
    state: options?.state || null,
    key: Math.random().toString(36).slice(2),
  });
}

/**
 * Utility to set mock params
 */
export function setMockParams(params: Record<string, string>) {
  Object.assign(mockParams, params);
}

/**
 * Utility to reset all mocks
 */
export function resetRouterMocks() {
  mockNavigate.mockReset();
  setMockLocation('/');
  Object.keys(mockParams).forEach(key => delete mockParams[key]);
}

/**
 * Helper to simulate navigation
 * Use this in tests to verify navigation was called
 *
 * @param expectedPath - Expected path that should have been navigated to
 * @returns true if navigate was called with the expected path
 */
export function expectNavigatedTo(expectedPath: string): boolean {
  return mockNavigate.mock.calls.some(call => 
    call[0] === expectedPath || call[0]?.pathname === expectedPath
  );
}