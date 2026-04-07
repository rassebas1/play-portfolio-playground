/**
 * Tests for TowerSVG component.
 * Covers shape rendering per tower type, rotation, level indicator, and tooltip.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TowerSVG } from './TowerSVG';
import { TOWER_SVG_SHAPES, TOWER_COLORS } from '../constants';
import { Tower } from '../types';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'towers.basic': 'Basic Tower',
        'towers.sniper': 'Sniper Tower',
        'towers.slow': 'Slow Tower',
        'towers.splash': 'Splash Tower',
      };
      return translations[key] || key;
    },
  }),
}));

function createTestTower(overrides?: Partial<Tower>): Tower {
  return {
    id: 'tower-1',
    type: 'basic',
    row: 0,
    col: 0,
    level: 1,
    damage: 10,
    range: 2,
    fireRate: 1,
    lastFired: 0,
    totalDamage: 0,
    kills: 0,
    rotation: 0,
    targetId: null,
    ...overrides,
  };
}

describe('TowerSVG', () => {
  it('renders an SVG element with correct viewBox', () => {
    const tower = createTestTower();
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '-12 -12 24 24');
  });

  it('renders the correct body shape for basic tower (triangle)', () => {
    const tower = createTestTower({ type: 'basic' });
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('d', TOWER_SVG_SHAPES.basic.body);
  });

  it('renders the correct body shape for sniper tower (square)', () => {
    const tower = createTestTower({ type: 'sniper' });
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('d', TOWER_SVG_SHAPES.sniper.body);
  });

  it('renders the correct body shape for slow tower (circle)', () => {
    const tower = createTestTower({ type: 'slow' });
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('d', TOWER_SVG_SHAPES.slow.body);
  });

  it('renders the correct body shape for splash tower (diamond)', () => {
    const tower = createTestTower({ type: 'splash' });
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('d', TOWER_SVG_SHAPES.splash.body);
  });

  it('applies rotation to the cannon barrel', () => {
    const tower = createTestTower({ rotation: 45 });
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    const cannon = document.querySelector('[data-testid="cannon"]');
    expect(cannon).toHaveAttribute('transform', 'rotate(45)');
  });

  it('applies correct fill color based on tower type', () => {
    const tower = createTestTower({ type: 'sniper' });
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('fill', TOWER_COLORS.sniper);
  });

  it('shows level indicator when level > 1', () => {
    const tower = createTestTower({ level: 3 });
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not show level indicator when level is 1', () => {
    const tower = createTestTower({ level: 1 });
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    // Only the tower type name should be visible in tooltip, not a level badge
    const levelBadge = document.querySelector('[data-testid="level-badge"]');
    expect(levelBadge).toBeNull();
  });

  it('shows tooltip with stats on hover', () => {
    const tower = createTestTower({ type: 'basic', damage: 15, range: 3, fireRate: 1.5, kills: 7 });
    render(<TowerSVG tower={tower} isSelected={false} onClick={() => {}} />);

    const wrapper = document.querySelector('[data-testid="tower-wrapper"]');
    expect(wrapper).toHaveClass('group');

    // Tooltip should contain tower stats
    const tooltip = document.querySelector('[data-testid="tower-tooltip"]');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip?.textContent).toContain('Basic Tower');
    expect(tooltip?.textContent).toContain('DMG: 15');
    expect(tooltip?.textContent).toContain('RNG: 3');
    expect(tooltip?.textContent).toContain('FR: 1.5/s');
    expect(tooltip?.textContent).toContain('Kills: 7');
  });

  it('applies selection border when isSelected is true', () => {
    const tower = createTestTower();
    const { container } = render(<TowerSVG tower={tower} isSelected onClick={() => {}} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ filter: 'drop-shadow(0 0 3px #4ade80)' });
  });
});
