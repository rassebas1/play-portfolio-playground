import { describe, it, expect } from 'vitest';
import { GAME_REGISTRY, getGameEntry, getAllGameIds, getGameInfo } from './index';
import type { GameType } from '@/types/global';

describe('GAME_REGISTRY', () => {
  it('has 9 games registered', () => {
    expect(Object.keys(GAME_REGISTRY)).toHaveLength(9);
  });

  it('each entry has required metadata', () => {
    for (const entry of Object.values(GAME_REGISTRY)) {
      expect(entry.difficulty).toBeTruthy();
      expect(entry.category).toBeTruthy();
      expect(entry.icon).toBeTruthy();
      expect(entry.color).toBeTruthy();
      expect(entry.component).toBeDefined();
    }
  });
});

describe('getGameEntry', () => {
  it('returns entry for valid game id', () => {
    const entry = getGameEntry('tetris');
    expect(entry).toBeDefined();
    expect(entry?.category).toBe('Puzzle');
  });

  it('returns undefined for invalid game id', () => {
    expect(getGameEntry('invalid' as GameType)).toBeUndefined();
  });
});

describe('getAllGameIds', () => {
  it('returns all 9 game ids', () => {
    const ids = getAllGameIds();
    expect(ids).toHaveLength(9);
    expect(ids).toContain('tic-tac-toe');
    expect(ids).toContain('2048');
    expect(ids).toContain('tower-defense');
  });
});

describe('getGameInfo', () => {
  it('returns formatted info for valid game', () => {
    const info = getGameInfo('snake');
    expect(info).toEqual({
      id: 'snake',
      name: 'Snake',
      difficulty: 'Medium',
      category: 'Arcade',
      icon: '🐍',
      color: 'hsl(150, 100%, 35%)',
    });
  });

  it('returns null for invalid game id', () => {
    expect(getGameInfo('invalid' as GameType)).toBeNull();
  });

  it('formats hyphenated names correctly', () => {
    const info = getGameInfo('tic-tac-toe');
    expect(info?.name).toBe('Tic Tac Toe');
  });
});
