/**
 * i18n Mock for Testing
 * Provides a mock i18next instance for tests
 */

import { vi } from 'vitest';

// Mock i18next
export const mockT = vi.fn((key: string, options?: Record<string, unknown>) => {
  // Return the key if no translation found (simulates i18next behavior)
  const translated = options ? `${key} ${JSON.stringify(options)}` : key;
  return translated;
});

export const mockI18n = {
  t: mockT,
  language: 'en',
  changeLanguage: vi.fn().mockResolvedValue(undefined),
  use: vi.fn().mockReturnThis(),
  init: vi.fn().mockResolvedValue(undefined),
};

// Default export for imports
export default mockI18n;

// Utility function to configure mock translations
export function setMockTranslations(translations: Record<string, string>) {
  mockT.mockImplementation((key: string) => {
    return translations[key] || key;
  });
}

// Utility to reset to default behavior
export function resetMockTranslations() {
  mockT.mockImplementation((key: string) => key);
}