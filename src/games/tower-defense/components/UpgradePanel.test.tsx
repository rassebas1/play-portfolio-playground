/**
 * Tests for UpgradePanel component.
 */
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpgradePanel, UpgradePanelProps, UpgradeDiff } from './UpgradePanel';
import { Tower, GamePhase } from '../types';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (key === 'towers.basic') return 'Basic Tower';
      if (key === 'towers.sniper') return 'Sniper Tower';
      if (key === 'towers.slow') return 'Slow Tower';
      if (key === 'towers.splash') return 'Splash Tower';
      if (key === 'ui.wave' && options) return `Wave ${options.count}`;
      return key;
    },
  }),
}));

// Mock gameLogic
vi.mock('../gameLogic', () => ({
  getUpgradeCost: (tower: Tower) => 30 * tower.level,
  getSellValue: (tower: Tower) => Math.floor(25 * tower.level),
}));

// Test helpers
const makeTower = (overrides: Partial<Tower> = {}): Tower => ({
  id: 'tower-1',
  type: 'basic',
  row: 2,
  col: 2,
  level: 1,
  damage: 10,
  range: 2,
  fireRate: 1,
  lastFired: 0,
  totalDamage: 0,
  kills: 5,
  ...overrides,
});

const makeUpgradeDiff = (overrides: Partial<UpgradeDiff> = {}): UpgradeDiff => ({
  damage: 15,
  range: 2.5,
  fireRate: 1.2,
  cost: 30,
  ...overrides,
});

const defaultProps: UpgradePanelProps = {
  tower: makeTower(),
  resources: 100,
  phase: 'planning',
  upgradeDiff: makeUpgradeDiff(),
  onUpgrade: vi.fn(),
  onSell: vi.fn(),
};

describe('UpgradePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tower name, level, and stats', () => {
    render(<UpgradePanel {...defaultProps} />);

    expect(screen.getByText('Basic Tower')).toBeInTheDocument();
    expect(screen.getByText('Lv. 1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // damage
    expect(screen.getByText('2')).toBeInTheDocument(); // range
    expect(screen.getByText('5')).toBeInTheDocument(); // kills
  });

  it('shows upgrade button when level < 5', () => {
    render(<UpgradePanel {...defaultProps} />);

    // Upgrade button shows cost: 30 * level = 30
    const upgradeButton = screen.getByRole('button', { name: /30/ });
    expect(upgradeButton).toBeInTheDocument();
  });

  it('shows MAX label when level >= 5', () => {
    const maxTower = makeTower({ level: 5 });

    render(<UpgradePanel {...defaultProps} tower={maxTower} />);

    expect(screen.getByText('MAX')).toBeInTheDocument();
    // No upgrade button should exist
    expect(screen.queryByRole('button', { name: /150/ })).not.toBeInTheDocument();
  });

  it('shows sell button', () => {
    render(<UpgradePanel {...defaultProps} />);

    // Sell value: floor(25 * 1) = 25
    const sellButton = screen.getByRole('button', { name: /25/ });
    expect(sellButton).toBeInTheDocument();
  });

  it('disables upgrade button when cannot afford', () => {
    render(<UpgradePanel {...defaultProps} resources={10} />);

    const upgradeButton = screen.getByRole('button', { name: /30/ });
    expect(upgradeButton).toBeDisabled();
  });

  it('calls onUpgrade when upgrade button is clicked', () => {
    const onUpgrade = vi.fn();

    render(<UpgradePanel {...defaultProps} onUpgrade={onUpgrade} />);

    const upgradeButton = screen.getByRole('button', { name: /30/ });
    fireEvent.click(upgradeButton);

    expect(onUpgrade).toHaveBeenCalledTimes(1);
  });

  it('calls onSell when sell button is clicked', () => {
    const onSell = vi.fn();

    render(<UpgradePanel {...defaultProps} onSell={onSell} />);

    const sellButton = screen.getByRole('button', { name: /25/ });
    fireEvent.click(sellButton);

    expect(onSell).toHaveBeenCalledTimes(1);
  });

  it('hides upgrade and sell buttons when not in planning phase', () => {
    const phases: GamePhase[] = ['playing', 'waveComplete', 'gameOver', 'victory'];

    phases.forEach((phase) => {
      const { unmount } = render(<UpgradePanel {...defaultProps} phase={phase} />);

      expect(screen.queryByRole('button', { name: /30/ })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /25/ })).not.toBeInTheDocument();

      unmount();
    });
  });

  it('shows upgrade diff indicators when upgradeDiff is provided', () => {
    render(<UpgradePanel {...defaultProps} upgradeDiff={makeUpgradeDiff()} />);

    // Should show the → indicator with new values (both damage and range have →)
    const arrows = screen.getAllByText(/→/);
    expect(arrows.length).toBe(2); // damage and range both show →
  });

  it('does not show upgrade diff when upgradeDiff is null', () => {
    render(<UpgradePanel {...defaultProps} upgradeDiff={null} />);

    // Should not show → indicator
    const arrows = screen.queryAllByText(/→/);
    expect(arrows).toHaveLength(0);
  });
});
