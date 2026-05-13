import { describe, it, expect } from 'vitest';
import { TILE_COUNT_PER_ROW_OR_COLUMN, ANIMATION_DURATION } from './constants';

describe('2048 constants', () => {
  it('TILE_COUNT_PER_ROW_OR_COLUMN is 4', () => {
    expect(TILE_COUNT_PER_ROW_OR_COLUMN).toBe(4);
  });

  it('ANIMATION_DURATION is 200ms', () => {
    expect(ANIMATION_DURATION).toBe(200);
  });
});
