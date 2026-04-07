/**
 * Tests for WaveIndicator component.
 */
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WaveIndicator } from './WaveIndicator';
import { MAX_WAVES } from '../constants';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'status.planning': 'Planning Phase',
        'status.wave_active': 'Wave in Progress',
        'status.wave_complete': 'Wave Complete!',
        'status.game_over': 'Game Over',
        'status.victory': 'Victory!',
        'ui.start_wave': 'Start Wave',
        'ui.next_wave': 'Next Wave',
        'ui.enemies_remaining': 'Enemies remaining: {{count}}',
      };
      if (key === 'ui.wave' && options) return `Wave ${options.count}`;
      if (key === 'ui.enemies_remaining' && options) return `Enemies remaining: ${options.count}`;
      return translations[key] || key;
    },
  }),
}));

const defaultProps = {
  currentWave: 1,
  phase: 'planning',
  enemiesRemaining: 0,
  onStartWave: vi.fn(),
  canStartWave: true,
};

describe('WaveIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows current wave number and max waves', () => {
    render(<WaveIndicator {...defaultProps} />);

    expect(screen.getByText(`Wave 1 / ${MAX_WAVES}`)).toBeInTheDocument();
  });

  it('shows status text based on phase', () => {
    const { rerender } = render(<WaveIndicator {...defaultProps} phase="planning" />);
    expect(screen.getByText('Planning Phase')).toBeInTheDocument();

    rerender(<WaveIndicator {...defaultProps} phase="playing" />);
    expect(screen.getByText('Wave in Progress')).toBeInTheDocument();

    rerender(<WaveIndicator {...defaultProps} phase="waveComplete" />);
    expect(screen.getByText('Wave Complete!')).toBeInTheDocument();

    rerender(<WaveIndicator {...defaultProps} phase="gameOver" />);
    expect(screen.getByText('Game Over')).toBeInTheDocument();

    rerender(<WaveIndicator {...defaultProps} phase="victory" />);
    expect(screen.getByText('Victory!')).toBeInTheDocument();
  });

  it('shows start wave button in planning phase', () => {
    render(<WaveIndicator {...defaultProps} phase="planning" />);

    expect(screen.getByRole('button', { name: /Next Wave/ })).toBeInTheDocument();
  });

  it('hides start wave button in other phases', () => {
    const phases = ['playing', 'waveComplete', 'gameOver', 'victory'];

    phases.forEach((phase) => {
      const { unmount } = render(<WaveIndicator {...defaultProps} phase={phase} />);

      expect(screen.queryByRole('button', { name: /Next Wave/ })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Start Wave/ })).not.toBeInTheDocument();

      unmount();
    });
  });

  it('shows enemies remaining during active wave', () => {
    render(
      <WaveIndicator
        {...defaultProps}
        phase="playing"
        enemiesRemaining={5}
      />
    );

    expect(screen.getByText('Enemies remaining: 5')).toBeInTheDocument();
  });

  it('hides enemies remaining when not in playing phase', () => {
    render(
      <WaveIndicator
        {...defaultProps}
        phase="planning"
        enemiesRemaining={10}
      />
    );

    expect(screen.queryByText('Enemies remaining: 10')).not.toBeInTheDocument();
  });

  it('progress bar reflects wave progress', () => {
    const { container, rerender } = render(
      <WaveIndicator {...defaultProps} currentWave={10} />
    );

    // Progress should be (10 / MAX_WAVES) * 100 = 50%
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '50%' });

    rerender(<WaveIndicator {...defaultProps} currentWave={20} />);
    const fullBar = container.querySelector('[style*="width"]');
    expect(fullBar).toHaveStyle({ width: '100%' });
  });

  it('calls onStartWave when start wave button is clicked', () => {
    const onStartWave = vi.fn();

    render(<WaveIndicator {...defaultProps} onStartWave={onStartWave} />);

    const startButton = screen.getByRole('button', { name: /Next Wave/ });
    fireEvent.click(startButton);

    expect(onStartWave).toHaveBeenCalledTimes(1);
  });

  it('disables start wave button when canStartWave is false', () => {
    render(<WaveIndicator {...defaultProps} canStartWave={false} />);

    const startButton = screen.getByRole('button', { name: /Next Wave/ });
    expect(startButton).toBeDisabled();
  });

  it('shows "Start Wave" text when currentWave is 0', () => {
    render(<WaveIndicator {...defaultProps} currentWave={0} />);

    expect(screen.getByRole('button', { name: /Start Wave/ })).toBeInTheDocument();
  });
});
