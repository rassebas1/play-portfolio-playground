import { describe, it, expect } from 'vitest';
import { moveAndMergeLine } from './lineProcessor';
import type { Tile } from '@/games/2048/types';

const tile = (value: number, id: string): Tile => ({ id, value, row: 0, col: 0 });

describe('moveAndMergeLine', () => {
  it('shifts tiles to the left removing gaps', () => {
    const line: (Tile | null)[] = [null, tile(2, 'a'), null, tile(4, 'b')];
    const { newLine, score } = moveAndMergeLine(line);
    expect(newLine[0]?.value).toBe(2);
    expect(newLine[1]?.value).toBe(4);
    expect(newLine[2]).toBeNull();
    expect(newLine[3]).toBeNull();
    expect(score).toBe(0);
  });

  it('merges two adjacent equal tiles', () => {
    const a = tile(2, 'a');
    const b = tile(2, 'b');
    const line: (Tile | null)[] = [a, b, null, null];
    const { newLine, score } = moveAndMergeLine(line);
    expect(newLine[0]?.value).toBe(4);
    expect(newLine[0]?.isMerged).toBe(true);
    expect(newLine[1]).toBeNull();
    expect(score).toBe(4);
  });

  it('merges two equal tiles with a gap between them', () => {
    const a = tile(2, 'a');
    const b = tile(2, 'b');
    const line: (Tile | null)[] = [a, null, b, null];
    const { newLine, score } = moveAndMergeLine(line);
    expect(newLine[0]?.value).toBe(4);
    expect(newLine[0]?.isMerged).toBe(true);
    expect(score).toBe(4);
  });

  it('merges only the first matching pair (leftmost priority)', () => {
    const a = tile(2, 'a');
    const b = tile(2, 'b');
    const c = tile(2, 'c');
    const line: (Tile | null)[] = [a, b, c, null];
    const { newLine, score } = moveAndMergeLine(line);
    expect(newLine[0]?.value).toBe(4);
    expect(newLine[0]?.isMerged).toBe(true);
    expect(newLine[1]?.value).toBe(2);
    expect(newLine[1]?.isMerged).toBeUndefined();
    expect(score).toBe(4);
  });

  it('handles four equal tiles as two merges', () => {
    const a = tile(2, 'a');
    const b = tile(2, 'b');
    const c = tile(2, 'c');
    const d = tile(2, 'd');
    const line: (Tile | null)[] = [a, b, c, d];
    const { newLine, score } = moveAndMergeLine(line);
    expect(newLine[0]?.value).toBe(4);
    expect(newLine[1]?.value).toBe(4);
    expect(newLine[2]).toBeNull();
    expect(score).toBe(8);
  });

  it('does not merge three identical tiles into one', () => {
    const a = tile(4, 'a');
    const b = tile(4, 'b');
    const c = tile(4, 'c');
    const line: (Tile | null)[] = [a, b, c, null];
    const { newLine, score } = moveAndMergeLine(line);
    expect(newLine[0]?.value).toBe(8);
    expect(newLine[1]?.value).toBe(4);
    expect(newLine[2]).toBeNull();
    expect(score).toBe(8);
  });

  it('returns score 0 when no merge happens', () => {
    const line: (Tile | null)[] = [tile(2, 'a'), tile(4, 'b'), tile(8, 'c'), null];
    const { newLine, score } = moveAndMergeLine(line);
    expect(newLine[0]?.value).toBe(2);
    expect(newLine[1]?.value).toBe(4);
    expect(newLine[2]?.value).toBe(8);
    expect(score).toBe(0);
  });

  it('handles an all-null line', () => {
    const line: (Tile | null)[] = [null, null, null, null];
    const { newLine, score } = moveAndMergeLine(line);
    expect(newLine.every(c => c === null)).toBe(true);
    expect(score).toBe(0);
  });

  it('does not merge non-adjacent equal tiles separated by different value', () => {
    const a = tile(2, 'a');
    const b = tile(4, 'b');
    const c = tile(2, 'c');
    const line: (Tile | null)[] = [a, b, c, null];
    const { newLine, score } = moveAndMergeLine(line);
    expect(newLine[0]?.value).toBe(2);
    expect(newLine[1]?.value).toBe(4);
    expect(newLine[2]?.value).toBe(2);
    expect(score).toBe(0);
  });
});
