import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tetrisReducer, createInitialState } from './GameReducer';
import type { TetrisState, Piece } from './types';

const mockPiece = (overrides: Partial<Piece> = {}): Piece => ({
  type: 'T',
  shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  position: { x: 3, y: 0 },
  rotation: 0,
  ...overrides,
});

const emptyBoard = () => Array.from({ length: 20 }, () => Array(10).fill(0));

const playingState = (overrides: Partial<TetrisState> = {}): TetrisState => ({
  board: emptyBoard(),
  currentPiece: mockPiece(),
  nextPiece: 'S',
  holdPiece: null,
  canHold: true,
  score: 0,
  level: 1,
  lines: 0,
  status: 'playing',
  clearedLines: [],
  ghostPosition: { x: 3, y: 18 },
  ...overrides,
});

describe('tetrisReducer', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('NEW_GAME starts playing', () => {
    const next = tetrisReducer(createInitialState(), { type: 'NEW_GAME' });
    expect(next.status).toBe('playing');
    expect(next.currentPiece).not.toBeNull();
  });

  it('PAUSE_GAME pauses', () => {
    const next = tetrisReducer(playingState(), { type: 'PAUSE_GAME' });
    expect(next.status).toBe('paused');
  });

  it('PAUSE_GAME ignored when paused', () => {
    const s = playingState({ status: 'paused' });
    expect(tetrisReducer(s, { type: 'PAUSE_GAME' })).toBe(s);
  });

  it('RESUME_GAME resumes', () => {
    const next = tetrisReducer(playingState({ status: 'paused' }), { type: 'RESUME_GAME' });
    expect(next.status).toBe('playing');
  });

  it('MOVE_LEFT moves piece', () => {
    const next = tetrisReducer(playingState(), { type: 'MOVE_LEFT' });
    expect(next.currentPiece!.position.x).toBe(2);
  });

  it('MOVE_RIGHT moves piece', () => {
    const next = tetrisReducer(playingState(), { type: 'MOVE_RIGHT' });
    expect(next.currentPiece!.position.x).toBe(4);
  });

  it('MOVE_LEFT ignored without piece', () => {
    const s = playingState({ currentPiece: null });
    expect(tetrisReducer(s, { type: 'MOVE_LEFT' })).toBe(s);
  });

  it('ROTATE rotates', () => {
    const next = tetrisReducer(playingState(), { type: 'ROTATE', direction: 'clockwise' });
    expect(next.currentPiece!.rotation).toBe(1);
  });

  it('SOFT_DROP moves down and adds 1', () => {
    const next = tetrisReducer(playingState(), { type: 'SOFT_DROP' });
    expect(next.currentPiece!.position.y).toBe(1);
    expect(next.score).toBe(1);
  });

  it('HARD_DROP drops piece, locks, spawns new', () => {
    const next = tetrisReducer(playingState(), { type: 'HARD_DROP' });
    expect(next.currentPiece).not.toBeNull();
    expect(next.score).toBeGreaterThan(0);
  });

  it('HOLD_PIECE holds current', () => {
    const next = tetrisReducer(playingState(), { type: 'HOLD_PIECE' });
    expect(next.holdPiece).toBe('T');
    expect(next.canHold).toBe(false);
  });

  it('HOLD_PIICE swaps', () => {
    const next = tetrisReducer(playingState({ holdPiece: 'O' }), { type: 'HOLD_PIECE' });
    expect(next.currentPiece!.type).toBe('O');
  });

  it('HOLD_PIECE ignored when canHold false', () => {
    const s = playingState({ canHold: false });
    expect(tetrisReducer(s, { type: 'HOLD_PIECE' })).toBe(s);
  });

  it('TICK moves piece down', () => {
    const next = tetrisReducer(playingState(), { type: 'TICK' });
    expect(next.currentPiece!.position.y).toBe(1);
  });

  it('LINE_CLEAR resets clearedLines', () => {
    const next = tetrisReducer(playingState({ clearedLines: [10] }), { type: 'LINE_CLEAR', lines: [10] });
    expect(next.clearedLines).toEqual([]);
  });

  it('GAME_OVER sets game_over and clears piece', () => {
    const next = tetrisReducer(playingState(), { type: 'GAME_OVER' });
    expect(next.status).toBe('game_over');
    expect(next.currentPiece).toBeNull();
  });

  it('unknown action returns state unchanged', () => {
    const s = playingState();
    expect(tetrisReducer(s, { type: 'UNKNOWN' as any })).toBe(s);
  });

  it('move ignored when paused', () => {
    const s = playingState({ status: 'paused' });
    expect(tetrisReducer(s, { type: 'MOVE_LEFT' })).toBe(s);
  });
});
