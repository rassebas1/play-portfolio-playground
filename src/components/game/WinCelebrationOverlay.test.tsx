import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { WinCelebrationOverlay } from './WinCelebrationOverlay';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('WinCelebrationOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when isVisible is false', () => {
    const { container } = render(
      <WinCelebrationOverlay isVisible={false} winner="X" onComplete={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders X player text when winner is X', () => {
    render(
      <WinCelebrationOverlay isVisible={true} winner="X" onComplete={vi.fn()} />
    );
    expect(screen.getByText(/Player X/)).toBeInTheDocument();
  });

  it('renders O player text when winner is O', () => {
    render(
      <WinCelebrationOverlay isVisible={true} winner="O" onComplete={vi.fn()} />
    );
    expect(screen.getByText(/Player O/)).toBeInTheDocument();
  });

  it('uses winnerName when provided', () => {
    render(
      <WinCelebrationOverlay isVisible={true} winner="X" winnerName="Player 1" onComplete={vi.fn()} />
    );
    expect(screen.getByText('Player 1')).toBeInTheDocument();
  });

  it('shows trophy icon for generic winner', () => {
    const { container } = render(
      <WinCelebrationOverlay isVisible={true} winner="draw" onComplete={vi.fn()} />
    );
    expect(container.innerHTML).toContain('🏆');
  });

  it('calls onComplete after duration expires', () => {
    const onComplete = vi.fn();
    render(
      <WinCelebrationOverlay isVisible={true} winner="X" duration={500} onComplete={onComplete} />
    );
    act(() => { vi.advanceTimersByTime(600); });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('renders subtitle from translation key', () => {
    render(
      <WinCelebrationOverlay isVisible={true} winner="X" onComplete={vi.fn()} />
    );
    expect(screen.getByText('celebration.winner_subtitle')).toBeInTheDocument();
  });
});
