import { describe, it, expect, vi } from 'vitest';
import { getRandomBoardCoordinate } from './gameLogic';

describe('getRandomBoardCoordinate', () => {
  it('returns coordinates within board bounds', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const coord = getRandomBoardCoordinate();
    expect(coord.x).toBeGreaterThanOrEqual(0);
    expect(coord.x).toBeLessThan(20);
    expect(coord.y).toBeGreaterThanOrEqual(0);
    expect(coord.y).toBeLessThan(20);
    vi.restoreAllMocks();
  });
});
