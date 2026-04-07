/**
 * Tests for EnemySVG component.
 * Covers shape rendering per enemy type, color, health display, slow indicator, and tooltip.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnemySVG } from './EnemySVG';
import { Enemy } from '../types';
import { ENEMY_COLORS } from '../constants';

function createTestEnemy(overrides?: Partial<Enemy>): Enemy {
  return {
    id: 'enemy-1',
    type: 'basic',
    health: 50,
    maxHealth: 50,
    speed: 3,
    row: 0,
    col: 0,
    pathIndex: 0,
    accumulatedDistance: 0,
    reward: 10,
    isSlowed: false,
    slowTimer: 0,
    spawnTime: Date.now() - 1000, // spawned 1s ago (past spawn animation)
    ...overrides,
  };
}

describe('EnemySVG', () => {
  it('renders an SVG element', () => {
    const enemy = createTestEnemy();
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders the correct shape for basic enemy (circle)', () => {
    const enemy = createTestEnemy({ type: 'basic' });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('d', 'M 0 -10 A 10 10 0 1 1 0 10 A 10 10 0 1 1 0 -10 Z');
  });

  it('renders the correct shape for fast enemy (diamond)', () => {
    const enemy = createTestEnemy({ type: 'fast' });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('d', 'M 0 -12 L 10 0 L 0 12 L -10 0 Z');
  });

  it('renders the correct shape for tank enemy (hexagon)', () => {
    const enemy = createTestEnemy({ type: 'tank' });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('d', 'M 0 -11 L 9.5 -5.5 L 9.5 5.5 L 0 11 L -9.5 5.5 L -9.5 -5.5 Z');
  });

  it('renders the correct shape for boss enemy (star)', () => {
    const enemy = createTestEnemy({ type: 'boss' });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('d', 'M 0 -12 L 3 -4 L 12 -4 L 5 2 L 7 11 L 0 6 L -7 11 L -5 2 L -12 -4 L -3 -4 Z');
  });

  it('applies correct fill color based on enemy type', () => {
    const enemy = createTestEnemy({ type: 'tank' });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const path = document.querySelector('svg path');
    expect(path).toHaveAttribute('fill', ENEMY_COLORS.tank);
  });

  it('applies slow filter when enemy is slowed', () => {
    const enemy = createTestEnemy({ isSlowed: true });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveStyle({ filter: 'brightness(0.7) saturate(0.5)' });
  });

  it('shows slow indicator when enemy is slowed', () => {
    const enemy = createTestEnemy({ isSlowed: true });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    expect(screen.getByText('❄️')).toBeInTheDocument();
  });

  it('does not show slow indicator when enemy is not slowed', () => {
    const enemy = createTestEnemy({ isSlowed: false });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const slowIndicator = document.querySelector('[data-testid="slow-indicator"]');
    expect(slowIndicator).toBeNull();
  });

  it('shows tooltip with enemy stats on hover', () => {
    const enemy = createTestEnemy({ type: 'fast', health: 30, maxHealth: 50, speed: 4, reward: 15 });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const tooltip = document.querySelector('[data-testid="enemy-tooltip"]');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip?.textContent).toContain('HP: 30/50');
    expect(tooltip?.textContent).toContain('Speed: 4');
    expect(tooltip?.textContent).toContain('+15');
  });

  it('renders at correct position', () => {
    const enemy = createTestEnemy();
    render(<EnemySVG enemy={enemy} cellSize={48} px={25} py={75} />);

    const wrapper = document.querySelector('[data-testid="enemy-wrapper"]');
    expect(wrapper).toHaveStyle({ left: '25%', top: '75%' });
  });
});
