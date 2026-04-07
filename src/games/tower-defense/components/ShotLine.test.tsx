/**
 * Tests for ShotLine component.
 * Covers line rendering, opacity calculation, and color.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ShotLine, calculateShotOpacity } from './ShotLine';

describe('ShotLine', () => {
  it('renders an SVG line element', () => {
    render(
      <ShotLine
        fromX={0}
        fromY={0}
        toX={50}
        toY={50}
        color="#4ade80"
        opacity={0.8}
      />
    );

    const line = document.querySelector('line');
    expect(line).toBeInTheDocument();
  });

  it('sets correct line coordinates', () => {
    render(
      <ShotLine
        fromX={10}
        fromY={20}
        toX={60}
        toY={80}
        color="#f472b6"
        opacity={0.5}
      />
    );

    const line = document.querySelector('line');
    expect(line).toHaveAttribute('x1', '10');
    expect(line).toHaveAttribute('y1', '20');
    expect(line).toHaveAttribute('x2', '60');
    expect(line).toHaveAttribute('y2', '80');
  });

  it('applies correct stroke color', () => {
    render(
      <ShotLine
        fromX={0}
        fromY={0}
        toX={100}
        toY={100}
        color="#fbbf24"
        opacity={1}
      />
    );

    const line = document.querySelector('line');
    expect(line).toHaveAttribute('stroke', '#fbbf24');
  });

  it('applies correct opacity', () => {
    render(
      <ShotLine
        fromX={0}
        fromY={0}
        toX={100}
        toY={100}
        color="#60a5fa"
        opacity={0.6}
      />
    );

    const line = document.querySelector('line');
    expect(line).toHaveAttribute('stroke-opacity', '0.6');
  });
});

describe('calculateShotOpacity()', () => {
  it('returns 1.0 for a fresh projectile (lifetime = 0)', () => {
    expect(calculateShotOpacity(0, 1000)).toBe(1);
  });

  it('returns 0.5 for a projectile at max lifetime', () => {
    expect(calculateShotOpacity(1000, 1000)).toBeCloseTo(0.5);
  });

  it('returns value between 1.0 and 0.5 for intermediate lifetime', () => {
    const opacity = calculateShotOpacity(500, 1000);
    expect(opacity).toBeGreaterThan(0.5);
    expect(opacity).toBeLessThan(1);
  });

  it('caps opacity at 0.5 for projectiles beyond max lifetime', () => {
    expect(calculateShotOpacity(2000, 1000)).toBeCloseTo(0.5);
  });
});
