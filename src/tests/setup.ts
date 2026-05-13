import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';



// Cleanup after each test - prevents memory leaks and test pollution
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock crypto.randomUUID for deterministic tests
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn(() => `test-uuid-${Math.random().toString(36).slice(2)}`),
  },
});

// Polyfill ResizeObserver for components that use Radix UI sizing hooks
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
globalThis.ResizeObserver = ResizeObserverMock;

Element.prototype.scrollIntoView = vi.fn();