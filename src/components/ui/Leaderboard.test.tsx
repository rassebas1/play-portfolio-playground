import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Leaderboard } from './Leaderboard';

vi.mock('@/hooks/useLeaderboard', () => ({
  useLeaderboard: vi.fn(() => ({
    scores: [], loading: false, error: null,
    isOffline: false, fetchScores: vi.fn(), retry: vi.fn(),
  })),
  useScoreSubmitter: vi.fn(() => ({
    submitting: false, submitted: false, error: null, submitScore: vi.fn(),
  })),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('Leaderboard', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders leaderboard text', () => {
    render(<BrowserRouter><Leaderboard game="tetris" /></BrowserRouter>);
    const elements = screen.getAllByText(/leaderboard/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
