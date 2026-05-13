import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addRandomTile } from './tileUtils';
import type { Tile } from '@/games/2048/types';

describe('addRandomTile', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('adds a tile to an empty position', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // deterministic: 0.5 < 0.9 → value 2
    const result = addRandomTile({}, [], 'new-id');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('new-id');
    expect(result!.value).toBe(2);
    expect(result!.isNew).toBe(true);
    expect(result!.isMerged).toBe(false);
  });

  it('creates a 4 tile when random >= 0.9', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.95); // 0.95 >= 0.9 → value 4
    const result = addRandomTile({}, [], 'new-id');
    expect(result!.value).toBe(4);
  });

  it('returns null when board is full', () => {
    const tiles: { [id: string]: Tile } = {};
    const byIds: string[] = [];
    let id = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const tid = `t${id}`;
        tiles[tid] = { id: tid, value: 2, row: r, col: c } as Tile;
        byIds.push(tid);
        id++;
      }
    }
    const result = addRandomTile(tiles, byIds, 'new-id');
    expect(result).toBeNull();
  });
});
