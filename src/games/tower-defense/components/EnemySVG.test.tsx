/**
 * Tests for EnemySVG component.
 * Covers shape rendering per enemy type, color, health display, slow indicator, and tooltip.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnemySVG } from './EnemySVG';
import { ENEMY_SVG_SHAPES, ENEMY_COLORS } from '../constants';
import { Enemy } from '../types';

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

function normalizePathData(path: string): string {
  return path.replace(/\s+/g, ' ').trim();
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
    expect(normalizePathData(path?.getAttribute('d') ?? '')).toBe(normalizePathData(ENEMY_SVG_SHAPES.basic.path));
  });

  it('renders the correct shape for fast enemy (diamond)', () => {
    const enemy = createTestEnemy({ type: 'fast' });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const path = document.querySelector('svg path');
    expect(normalizePathData(path?.getAttribute('d') ?? '')).toBe(normalizePathData(ENEMY_SVG_SHAPES.fast.path));
  });

  it('renders the correct shape for tank enemy (hexagon)', () => {
    const enemy = createTestEnemy({ type: 'tank' });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const path = document.querySelector('svg path');
    expect(normalizePathData(path?.getAttribute('d') ?? '')).toBe(normalizePathData(ENEMY_SVG_SHAPES.tank.path));
  });

  it('renders the correct shape for boss enemy (star)', () => {
    const enemy = createTestEnemy({ type: 'boss' });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const path = document.querySelector('svg path');
    expect(normalizePathData(path?.getAttribute('d') ?? '')).toBe(normalizePathData(ENEMY_SVG_SHAPES.boss.path));
  });

  it('applies correct fill color based on enemy type', () => {
    const enemy = createTestEnemy({ type: 'tank' });
    render(<EnemySVG enemy={enemy} cellSize={48} px={50} py={50} />);

    const paths = document.querySelectorAll('svg path');
    const bodyPath = paths[1];
    expect(bodyPath).toHaveAttribute('fill', ENEMY_COLORS.tank);
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
    expect(tooltip?.textContent).toContain('Fast');
    expect(tooltip?.textContent).toContain('HP: 30/50');
    expect(tooltip?.textContent).toContain('+15💰');
  });

  it('renders at correct position', () => {
    const enemy = createTestEnemy();
    render(<EnemySVG enemy={enemy} cellSize={48} px={25} py={75} />);

    const wrapper = document.querySelector('[data-testid="enemy-wrapper"]');
    expect(wrapper).toHaveStyle({ left: '25%', top: '75%' });
  });
});
