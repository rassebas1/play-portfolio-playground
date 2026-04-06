/**
 * Tests for TowerSelector component.
 */
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TowerSelector } from './TowerSelector';
import { TowerType } from '../types';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'towers.basic': 'Basic Tower',
        'towers.sniper': 'Sniper Tower',
        'towers.slow': 'Slow Tower',
        'towers.splash': 'Splash Tower',
        'towers.basic_desc': 'Reliable damage at low cost',
        'towers.sniper_desc': 'High damage, long range, slow fire rate',
        'towers.slow_desc': 'Slows enemies to help other towers',
        'towers.splash_desc': 'Area damage to multiple enemies',
        'ui.select_tower': 'Select a tower to place',
      };
      return translations[key] || key;
    },
  }),
}));

const defaultProps = {
  selectedTowerType: null as TowerType | null,
  onSelectTower: vi.fn(),
  resources: 200,
  disabled: false,
};

describe('TowerSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 4 tower types', () => {
    render(<TowerSelector {...defaultProps} />);

    expect(screen.getByText('Basic Tower')).toBeInTheDocument();
    expect(screen.getByText('Sniper Tower')).toBeInTheDocument();
    expect(screen.getByText('Slow Tower')).toBeInTheDocument();
    expect(screen.getByText('Splash Tower')).toBeInTheDocument();
  });

  it('shows tower cost, damage, range, and fire rate', () => {
    render(<TowerSelector {...defaultProps} />);

    // Costs from TOWER_STATS
    expect(screen.getByText('💰 50')).toBeInTheDocument(); // basic
    expect(screen.getByText('💰 100')).toBeInTheDocument(); // sniper
    expect(screen.getByText('💰 75')).toBeInTheDocument(); // slow
    expect(screen.getByText('💰 125')).toBeInTheDocument(); // splash

    // Damage values
    expect(screen.getByText('⚔️ 10')).toBeInTheDocument(); // basic
    expect(screen.getByText('⚔️ 50')).toBeInTheDocument(); // sniper

    // Range values (basic and splash both have range 2, so use getAllByText)
    const range2Elements = screen.getAllByText('🎯 2');
    expect(range2Elements.length).toBe(2); // basic and splash
    expect(screen.getByText('🎯 5')).toBeInTheDocument(); // sniper
    expect(screen.getByText('🎯 3')).toBeInTheDocument(); // slow

    // Fire rate values (basic and slow both have 1/s, so use getAllByText)
    const fireRate1Elements = screen.getAllByText('⚡ 1/s');
    expect(fireRate1Elements.length).toBe(2); // basic and slow
    expect(screen.getByText('⚡ 0.33/s')).toBeInTheDocument(); // sniper
    expect(screen.getByText('⚡ 0.5/s')).toBeInTheDocument(); // splash
  });

  it('selects tower when clicked', () => {
    const onSelectTower = vi.fn();

    render(<TowerSelector {...defaultProps} onSelectTower={onSelectTower} />);

    const basicTowerButton = screen.getByRole('button', { name: /Basic Tower - Cost: 50/ });
    fireEvent.click(basicTowerButton);

    expect(onSelectTower).toHaveBeenCalledWith('basic');
  });

  it('deselects tower when clicked again', () => {
    const onSelectTower = vi.fn();

    render(
      <TowerSelector
        {...defaultProps}
        selectedTowerType="basic"
        onSelectTower={onSelectTower}
      />
    );

    const basicTowerButton = screen.getByRole('button', { name: /Basic Tower - Cost: 50/ });
    fireEvent.click(basicTowerButton);

    expect(onSelectTower).toHaveBeenCalledWith(null);
  });

  it('disables towers when cannot afford', () => {
    render(<TowerSelector {...defaultProps} resources={60} />);

    // Basic tower (cost 50) should be enabled
    const basicButton = screen.getByRole('button', { name: /Basic Tower - Cost: 50/ });
    expect(basicButton).not.toBeDisabled();

    // Sniper tower (cost 100) should be disabled
    const sniperButton = screen.getByRole('button', { name: /Sniper Tower - Cost: 100/ });
    expect(sniperButton).toBeDisabled();

    // Splash tower (cost 125) should be disabled
    const splashButton = screen.getByRole('button', { name: /Splash Tower - Cost: 125/ });
    expect(splashButton).toBeDisabled();
  });

  it('disables all towers when disabled prop is true', () => {
    render(<TowerSelector {...defaultProps} disabled resources={500} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
