/**
 * Tests for ImpactEffect component.
 * Covers rendering at correct position, color, and TTL-based visibility.
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ImpactEffect, isImpactExpired } from './ImpactEffect';

describe('ImpactEffect', () => {
  it('renders a circle at the correct position', () => {
    const effect = {
      id: 'impact-1',
      row: 3,
      col: 5,
      color: '#4ade80',
      createdAt: Date.now(),
      ttl: 300,
    };

    render(<ImpactEffect effect={effect} cellSize={48} />);

    const circle = document.querySelector('circle');
    expect(circle).toBeInTheDocument();
  });

  it('applies correct fill color to the flash circle', () => {
    const effect = {
      id: 'impact-2',
      row: 0,
      col: 0,
      color: '#f472b6',
      createdAt: Date.now(),
      ttl: 300,
    };

    render(<ImpactEffect effect={effect} cellSize={48} />);

    const circles = document.querySelectorAll('circle');
    // Second circle is the flash (first is the ring with fill="none")
    expect(circles[1]).toHaveAttribute('fill', '#f472b6');
  });

  it('positions the effect at the correct pixel coordinates (center of cell)', () => {
    const effect = {
      id: 'impact-3',
      row: 2,
      col: 4,
      color: '#60a5fa',
      createdAt: Date.now(),
      ttl: 300,
    };

    render(<ImpactEffect effect={effect} cellSize={48} />);

    const g = document.querySelector('[data-testid="impact-effect"]');
    // Center of cell: col * cellSize + cellSize/2, row * cellSize + cellSize/2
    expect(g).toHaveAttribute('transform', 'translate(216, 120)');
  });
});

describe('isImpactExpired()', () => {
  it('returns false for a fresh impact effect', () => {
    const effect = {
      id: 'fresh',
      row: 0,
      col: 0,
      color: '#fff',
      createdAt: Date.now(),
      ttl: 300,
    };
    expect(isImpactExpired(effect, Date.now())).toBe(false);
  });

  it('returns true for an effect past its TTL', () => {
    const effect = {
      id: 'expired',
      row: 0,
      col: 0,
      color: '#fff',
      createdAt: 1000,
      ttl: 300,
    };
    expect(isImpactExpired(effect, 1500)).toBe(true);
  });

  it('returns false for an effect exactly at its TTL boundary', () => {
    const effect = {
      id: 'boundary',
      row: 0,
      col: 0,
      color: '#fff',
      createdAt: 1000,
      ttl: 300,
    };
    expect(isImpactExpired(effect, 1299)).toBe(false);
  });

  it('returns true for an effect one ms past TTL', () => {
    const effect = {
      id: 'just-expired',
      row: 0,
      col: 0,
      color: '#fff',
      createdAt: 1000,
      ttl: 300,
    };
    expect(isImpactExpired(effect, 1301)).toBe(true);
  });
});
