import { Tile } from "./types";

export interface GameState {
    tiles: { [id: string]: Tile };
    byIds: string[];
    hasChanged: boolean;
    inMotion: boolean;
    score: number;
    highScore: number;
    isGameOver: boolean;
    isWon: boolean;
    previousState: GameState | null;
}

export const initialState: GameState = {
    tiles: {},
    byIds: [],
    hasChanged: false,
    inMotion: false,
    score: 0,
    highScore: 0,
    isGameOver: false,
    isWon: false,
    previousState: null,
};

type Action =
    | { type: "ADD_TILE"; tile: Tile }
    | { type: "CREATE_TILE"; tile: Tile }
    | { type: "MERGE_TILE"; source: Tile; destination: Tile }
    | { type: "UPDATE_TILE"; tile: Tile }
    | { type: "START_MOVE" }
    | { type: "END_MOVE" }
    | { type: "RESET_GAME" }
    | { type: "UPDATE_ALL_TILES"; tiles: { [id: string]: Tile }; byIds: string[]; score: number }
    | { type: "UNDO_MOVE"; previousState: GameState }
    | { type: "CONTINUE_GAME" }
    | { type: "GAME_OVER" }
    | { type: "WIN_GAME" }
    | { type: "SET_INITIAL_STATE"; newState: GameState };

export const GameReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        case "ADD_TILE":
            console.log("ADD_TILE dispatched", action.tile);
            return {
                ...state,
                tiles: {
                    ...state.tiles,
                    [action.tile.id]: action.tile,
                },
                byIds: [...state.byIds, action.tile.id],
            };
        case "CREATE_TILE":
            return {
                ...state,
                tiles: {
                    ...state.tiles,
                    [action.tile.id]: action.tile,
                },
                byIds: [...state.byIds, action.tile.id],
                hasChanged: true,
            };
        case "MERGE_TILE":
            return {
                ...state,
                tiles: {
                    ...state.tiles,
                    [action.source.id]: {
                        ...action.source,
                        isRemoved: true,
                    },
                    [action.destination.id]: {
                        ...action.destination,
                        value: action.destination.value * 2,
                        isMerged: true,
                    },
                },
                hasChanged: true,
            };
        case "UPDATE_TILE":
            return {
                ...state,
                tiles: {
                    ...state.tiles,
                    [action.tile.id]: action.tile,
                },
                hasChanged: true
            };
        case "START_MOVE":
            return {
                ...state,
                inMotion: true,
                hasChanged: false,
                previousState: state, // Save current state for undo
            };
        case "END_MOVE":
            const newTiles = { ...state.tiles };
            const newByIds = state.byIds.filter(id => !newTiles[id].isRemoved);

            newByIds.forEach(id => {
                const tile = newTiles[id];
                newTiles[id] = {
                    ...tile,
                    isNew: false,
                    isMerged: false,
                    previousPosition: undefined,
                };
            });

            return {
                ...state,
                tiles: newTiles,
                byIds: newByIds,
                inMotion: false,
            };
        case "RESET_GAME":
            return {
                ...initialState,
                highScore: Math.max(state.highScore, state.score), // Preserve high score
            };
        case "UPDATE_ALL_TILES":
            return {
                ...state,
                tiles: action.tiles,
                byIds: action.byIds,
                score: state.score + action.score,
                highScore: Math.max(state.highScore, state.score + action.score),
            };
        case "UNDO_MOVE":
            return action.previousState || state;
        case "CONTINUE_GAME":
            return {
                ...state,
                isWon: false, // Allows the game to continue
            };
        case "GAME_OVER":
            return {
                ...state,
                isGameOver: true,
                highScore: Math.max(state.highScore, state.score),
            };
        case "WIN_GAME":
            return {
                ...state,
                isWon: true,
                highScore: Math.max(state.highScore, state.score),
            };
        case "SET_INITIAL_STATE":
            return action.newState;
        default:
            return state;
    }
};