import { describe, it, expect } from 'vitest';
import { GameReducer, initialState, GameState } from './GameReducer';
import type { Tile } from './types';

const createTile = (id: string, value: number, row: number, col: number, extras: Partial<Tile> = {}): Tile => ({
  id,
  value,
  row,
  col,
  ...extras,
});

const createState = (extras: Partial<GameState> = {}): GameState => ({
  tiles: {},
  byIds: [],
  hasChanged: false,
  inMotion: false,
  score: 0,
  isGameOver: false,
  isWon: false,
  canUndo: false,
  previousState: null,
  highestTile: 0,
  ...extras,
});

describe('2048 GameReducer', () => {
  describe('ADD_TILE action', () => {
    it('should add a tile to tiles object and byIds array', () => {
      const tile = createTile('tile-1', 2, 0, 0);
      const state = createState();
      const newState = GameReducer(state, { type: 'ADD_TILE', tile });

      expect(newState.tiles['tile-1']).toEqual(tile);
      expect(newState.byIds).toContain('tile-1');
      expect(newState.byIds).toHaveLength(1);
    });

    it('should preserve existing tiles when adding new one', () => {
      const tile1 = createTile('tile-1', 2, 0, 0);
      const tile2 = createTile('tile-2', 4, 1, 0);
      const state = createState({
        tiles: { 'tile-1': tile1 },
        byIds: ['tile-1'],
      });
      const newState = GameReducer(state, { type: 'ADD_TILE', tile: tile2 });

      expect(newState.tiles['tile-1']).toEqual(tile1);
      expect(newState.tiles['tile-2']).toEqual(tile2);
      expect(newState.byIds).toHaveLength(2);
    });

    it('should not modify original state', () => {
      const tile = createTile('tile-1', 2, 0, 0);
      const state = createState();
      GameReducer(state, { type: 'ADD_TILE', tile });

      expect(state.tiles['tile-1']).toBeUndefined();
      expect(state.byIds).toHaveLength(0);
    });
  });

  describe('CREATE_TILE action', () => {
    it('should add tile like ADD_TILE', () => {
      const tile = createTile('tile-1', 2, 0, 0);
      const state = createState();
      const newState = GameReducer(state, { type: 'CREATE_TILE', tile });

      expect(newState.tiles['tile-1']).toEqual(tile);
      expect(newState.byIds).toContain('tile-1');
    });

    it('should set hasChanged to true', () => {
      const tile = createTile('tile-1', 2, 0, 0);
      const state = createState({ hasChanged: false });
      const newState = GameReducer(state, { type: 'CREATE_TILE', tile });

      expect(newState.hasChanged).toBe(true);
    });
  });

  describe('MERGE_TILE action', () => {
    it('should mark source tile as removed', () => {
      const source = createTile('source-1', 2, 0, 0);
      const dest = createTile('dest-1', 2, 1, 0);
      const state = createState({
        tiles: { 'source-1': source, 'dest-1': dest },
        byIds: ['source-1', 'dest-1'],
      });
      const newState = GameReducer(state, { type: 'MERGE_TILE', source, destination: dest });

      expect(newState.tiles['source-1'].isRemoved).toBe(true);
    });

    it('should double destination tile value', () => {
      const source = createTile('source-1', 2, 0, 0);
      const dest = createTile('dest-1', 4, 1, 0);
      const state = createState({
        tiles: { 'source-1': source, 'dest-1': dest },
        byIds: ['source-1', 'dest-1'],
      });
      const newState = GameReducer(state, { type: 'MERGE_TILE', source, destination: dest });

      expect(newState.tiles['dest-1'].value).toBe(8);
    });

    it('should mark destination tile as merged', () => {
      const source = createTile('source-1', 2, 0, 0);
      const dest = createTile('dest-1', 2, 1, 0);
      const state = createState({
        tiles: { 'source-1': source, 'dest-1': dest },
        byIds: ['source-1', 'dest-1'],
      });
      const newState = GameReducer(state, { type: 'MERGE_TILE', source, destination: dest });

      expect(newState.tiles['dest-1'].isMerged).toBe(true);
    });

    it('should set hasChanged to true', () => {
      const source = createTile('source-1', 2, 0, 0);
      const dest = createTile('dest-1', 2, 1, 0);
      const state = createState({ hasChanged: false });
      const newState = GameReducer(state, { type: 'MERGE_TILE', source, destination: dest });

      expect(newState.hasChanged).toBe(true);
    });
  });

  describe('UPDATE_TILE action', () => {
    it('should update tile properties', () => {
      const tile = createTile('tile-1', 2, 0, 0, { isNew: true });
      const updatedTile = { ...tile, isNew: false, row: 1, col: 1 };
      const state = createState({
        tiles: { 'tile-1': tile },
        byIds: ['tile-1'],
      });
      const newState = GameReducer(state, { type: 'UPDATE_TILE', tile: updatedTile });

      expect(newState.tiles['tile-1'].col).toBe(1);
      expect(newState.tiles['tile-1'].isNew).toBe(false);
    });

    it('should set hasChanged to true', () => {
      const tile = createTile('tile-1', 2, 0, 0);
      const state = createState({ hasChanged: false });
      const newState = GameReducer(state, { type: 'UPDATE_TILE', tile });

      expect(newState.hasChanged).toBe(true);
    });
  });

  describe('START_MOVE action', () => {
    it('should set inMotion to true', () => {
      const state = createState({ inMotion: false });
      const newState = GameReducer(state, { type: 'START_MOVE' });

      expect(newState.inMotion).toBe(true);
    });

    it('should reset hasChanged to false', () => {
      const state = createState({ hasChanged: true });
      const newState = GameReducer(state, { type: 'START_MOVE' });

      expect(newState.hasChanged).toBe(false);
    });

    it('should enable undo capability', () => {
      const state = createState({ canUndo: false });
      const newState = GameReducer(state, { type: 'START_MOVE' });

      expect(newState.canUndo).toBe(true);
    });

    it('should save current state for undo', () => {
      const tile = createTile('tile-1', 2, 0, 0);
      const state = createState({
        tiles: { 'tile-1': tile },
        byIds: ['tile-1'],
      });
      const newState = GameReducer(state, { type: 'START_MOVE' });

      expect(newState.previousState).not.toBeNull();
      expect(newState.previousState?.tiles['tile-1']).toEqual(tile);
    });
  });

  describe('END_MOVE action', () => {
    it('should filter out removed tiles from byIds but keep in tiles object', () => {
      const tile1 = createTile('tile-1', 2, 0, 0);
      const tile2 = createTile('tile-2', 4, 1, 0, { isRemoved: true });
      const state = createState({
        tiles: { 'tile-1': tile1, 'tile-2': tile2 },
        byIds: ['tile-1', 'tile-2'],
        inMotion: true,
      });
      const newState = GameReducer(state, { type: 'END_MOVE' });

      // Note: reducer keeps isRemoved tiles in tiles object but removes from byIds
      expect(newState.byIds).not.toContain('tile-2');
      expect(newState.byIds).toContain('tile-1');
    });

    it('should reset animation flags on remaining tiles', () => {
      const tile = createTile('tile-1', 2, 0, 0, { isNew: true, isMerged: true });
      const state = createState({
        tiles: { 'tile-1': tile },
        byIds: ['tile-1'],
        inMotion: true,
      });
      const newState = GameReducer(state, { type: 'END_MOVE' });

      expect(newState.tiles['tile-1'].isNew).toBe(false);
      expect(newState.tiles['tile-1'].isMerged).toBe(false);
      expect(newState.tiles['tile-1'].previousPosition).toBeUndefined();
    });

    it('should set inMotion to false', () => {
      const tile = createTile('tile-1', 2, 0, 0);
      const state = createState({
        tiles: { 'tile-1': tile },
        byIds: ['tile-1'],
        inMotion: true,
      });
      const newState = GameReducer(state, { type: 'END_MOVE' });

      expect(newState.inMotion).toBe(false);
    });
  });

  describe('RESET_GAME action', () => {
    it('should reset to initial state', () => {
      const tile = createTile('tile-1', 2048, 0, 0);
      const state = createState({
        tiles: { 'tile-1': tile },
        byIds: ['tile-1'],
        score: 1000,
        isWon: true,
        highestTile: 2048,
      });
      const newState = GameReducer(state, { type: 'RESET_GAME' });

      expect(newState.tiles).toEqual({});
      expect(newState.byIds).toEqual([]);
      expect(newState.score).toBe(0);
      expect(newState.isWon).toBe(false);
      expect(newState.highestTile).toBe(0);
    });
  });

  describe('UPDATE_ALL_TILES action', () => {
    it('should update tiles and byIds', () => {
      const newTiles = {
        'tile-1': createTile('tile-1', 4, 0, 0),
        'tile-2': createTile('tile-2', 2, 1, 0),
      };
      const newByIds = ['tile-1', 'tile-2'];
      const state = createState({ score: 100 });
      const newState = GameReducer(state, { type: 'UPDATE_ALL_TILES', tiles: newTiles, byIds: newByIds, score: 20 });

      expect(newState.tiles).toEqual(newTiles);
      expect(newState.byIds).toEqual(newByIds);
    });

    it('should add score to existing score', () => {
      const state = createState({ score: 100 });
      const newState = GameReducer(state, { type: 'UPDATE_ALL_TILES', tiles: {}, byIds: [], score: 20 });

      expect(newState.score).toBe(120);
    });

    it('should update highestTile if new tiles are higher', () => {
      const newTiles = {
        'tile-1': createTile('tile-1', 512, 0, 0),
      };
      const state = createState({ highestTile: 256 });
      const newState = GameReducer(state, { type: 'UPDATE_ALL_TILES', tiles: newTiles, byIds: ['tile-1'], score: 0 });

      expect(newState.highestTile).toBe(512);
    });

    it('should not decrease highestTile', () => {
      const newTiles = {
        'tile-1': createTile('tile-1', 2, 0, 0),
      };
      const state = createState({ highestTile: 256 });
      const newState = GameReducer(state, { type: 'UPDATE_ALL_TILES', tiles: newTiles, byIds: ['tile-1'], score: 0 });

      expect(newState.highestTile).toBe(256);
    });

    it('should skip removed tiles when calculating highest', () => {
      const newTiles = {
        'tile-1': createTile('tile-1', 512, 0, 0),
        'tile-2': createTile('tile-2', 2, 1, 0, { isRemoved: true }),
      };
      const state = createState({ highestTile: 256 });
      const newState = GameReducer(state, { type: 'UPDATE_ALL_TILES', tiles: newTiles, byIds: ['tile-1', 'tile-2'], score: 0 });

      expect(newState.highestTile).toBe(512);
    });
  });

  describe('UNDO_MOVE action', () => {
    it('should revert to previous state', () => {
      const prevState = createState({ score: 100 });
      const state = createState({ score: 200, previousState: prevState, canUndo: true });
      const newState = GameReducer(state, { type: 'UNDO_MOVE', previousState: prevState });

      expect(newState.score).toBe(100);
    });

    it('should disable undo after using it', () => {
      const prevState = createState({ score: 100 });
      const state = createState({ previousState: prevState, canUndo: true });
      const newState = GameReducer(state, { type: 'UNDO_MOVE', previousState: prevState });

      expect(newState.canUndo).toBe(false);
    });

    it('should use current state if previousState is null', () => {
      const state = createState({ score: 200, previousState: null });
      const newState = GameReducer(state, { type: 'UNDO_MOVE', previousState: null });

      expect(newState.score).toBe(200);
    });
  });

  describe('CONTINUE_GAME action', () => {
    it('should set isWon to false', () => {
      const state = createState({ isWon: true });
      const newState = GameReducer(state, { type: 'CONTINUE_GAME' });

      expect(newState.isWon).toBe(false);
    });

    it('should preserve other state properties', () => {
      const tile = createTile('tile-1', 2048, 0, 0);
      const state = createState({
        isWon: true,
        score: 1000,
        tiles: { 'tile-1': tile },
        byIds: ['tile-1'],
      });
      const newState = GameReducer(state, { type: 'CONTINUE_GAME' });

      expect(newState.score).toBe(1000);
      expect(newState.tiles['tile-1']).toEqual(tile);
    });
  });

  describe('GAME_OVER action', () => {
    it('should set isGameOver to true', () => {
      const state = createState({ isGameOver: false });
      const newState = GameReducer(state, { type: 'GAME_OVER' });

      expect(newState.isGameOver).toBe(true);
    });
  });

  describe('WIN_GAME action', () => {
    it('should set isWon to true', () => {
      const state = createState({ isWon: false });
      const newState = GameReducer(state, { type: 'WIN_GAME' });

      expect(newState.isWon).toBe(true);
    });
  });

  describe('SET_INITIAL_STATE action', () => {
    it('should completely replace state', () => {
      const newStateObj = createState({ score: 500, highestTile: 1024 });
      const state = createState({ score: 100 });
      const newState = GameReducer(state, { type: 'SET_INITIAL_STATE', newState: newStateObj });

      expect(newState.score).toBe(500);
      expect(newState.highestTile).toBe(1024);
    });
  });

  describe('default case', () => {
    it('should return current state for unknown action', () => {
      const tile = createTile('tile-1', 2, 0, 0);
      const state = createState({
        tiles: { 'tile-1': tile },
        byIds: ['tile-1'],
        score: 100,
      });
      const newState = GameReducer(state, { type: 'UNKNOWN_ACTION' as any });

      expect(newState).toEqual(state);
    });
  });
});

describe('2048 GameReducer - initialState', () => {
  it('should have correct default values', () => {
    expect(initialState.tiles).toEqual({});
    expect(initialState.byIds).toEqual([]);
    expect(initialState.hasChanged).toBe(false);
    expect(initialState.inMotion).toBe(false);
    expect(initialState.score).toBe(0);
    expect(initialState.isGameOver).toBe(false);
    expect(initialState.isWon).toBe(false);
    expect(initialState.canUndo).toBe(false);
    expect(initialState.previousState).toBeNull();
    expect(initialState.highestTile).toBe(0);
  });
});