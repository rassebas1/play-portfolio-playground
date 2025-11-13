/**
 * src/games/2048/GameReducer.ts
 *
 * Defines the reducer logic for the 2048 game, managing state transitions
 * based on various game actions. It handles tile creation, movement, merging,
 * score updates, and game over/win conditions.
 */

import { Tile } from "./types";

/**
 * Interface representing the entire state of the 2048 game.
 */
export interface GameState {
    tiles: { [id: string]: Tile }; // Object mapping tile IDs to Tile objects
    byIds: string[];               // Array of tile IDs, maintaining order for rendering
    hasChanged: boolean;           // Indicates if the board state has changed in the current move
    inMotion: boolean;             // True if tiles are currently animating
    score: number;                 // Current score of the game
    isGameOver: boolean;           // True if the game is over (no more moves possible)
    isWon: boolean;                // True if the player has reached the 2048 tile
    canUndo: boolean;              // True if the last move can be undone
    previousState: GameState | null; // Stores the state before the last move for undo functionality
}

/**
 * The initial state for the 2048 Game.
 * @type {GameState}
 */
export const initialState: GameState = {
    tiles: {},
    byIds: [],
    hasChanged: false,
    inMotion: false,
    score: 0,
    isGameOver: false,
    isWon: false,
    canUndo: false,
    previousState: null,
};

/**
 * Type definition for all possible actions that can be dispatched to the 2048 game reducer.
 */
type Action =
    | { type: "ADD_TILE"; tile: Tile }                               // Adds a new tile to the board
    | { type: "CREATE_TILE"; tile: Tile }                           // Creates a tile (similar to ADD_TILE but sets hasChanged)
    | { type: "MERGE_TILE"; source: Tile; destination: Tile }       // Merges two tiles
    | { type: "UPDATE_TILE"; tile: Tile }                           // Updates properties of an existing tile
    | { type: "START_MOVE" }                                        // Initiates a move animation
    | { type: "END_MOVE" }                                          // Concludes a move animation
    | { type: "RESET_GAME" }                                        // Resets the game to its initial state
    | { type: "UPDATE_ALL_TILES"; tiles: { [id: string]: Tile }; byIds: string[]; score: number } // Updates all tiles and score after a move
    | { type: "UNDO_MOVE"; previousState: GameState }               // Reverts to a previous game state
    | { type: "CONTINUE_GAME" }                                     // Allows playing after winning
    | { type: "GAME_OVER" }                                         // Sets game over state
    | { type: "WIN_GAME" }                                          // Sets win game state
    | { type: "SET_INITIAL_STATE"; newState: GameState };           // Sets the entire state to a new initial state

/**
 * Reducer function for the 2048 game.
 * Manages state transitions based on dispatched actions.
 *
 * @param {GameState} state - The current state of the game.
 * @param {Action} action - The action to be performed.
 * @returns {GameState} The new state of the game.
 */
export const GameReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        /**
         * Action: ADD_TILE
         * Adds a new tile to the game state.
         * Payload: { tile: Tile } - The tile object to add.
         */
        case "ADD_TILE":
            return {
                ...state,
                tiles: {
                    ...state.tiles,
                    [action.tile.id]: action.tile,
                },
                byIds: [...state.byIds, action.tile.id],
            };
        
        /**
         * Action: CREATE_TILE
         * Creates a tile and marks that the board has changed.
         * Payload: { tile: Tile } - The tile object to create.
         */
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
        
        /**
         * Action: MERGE_TILE
         * Handles the merging of two tiles. Marks the source tile for removal and updates the destination tile.
         * Payload: { source: Tile; destination: Tile } - The source and destination tiles of the merge.
         */
        case "MERGE_TILE":
            return {
                ...state,
                tiles: {
                    ...state.tiles,
                    [action.source.id]: {
                        ...action.source,
                        isRemoved: true, // Mark source tile as removed
                    },
                    [action.destination.id]: {
                        ...action.destination,
                        value: action.destination.value * 2, // Double the value of the destination tile
                        isMerged: true, // Mark destination tile as merged
                    },
                },
                hasChanged: true,
            };
        
        /**
         * Action: UPDATE_TILE
         * Updates properties of an existing tile.
         * Payload: { tile: Tile } - The updated tile object.
         */
        case "UPDATE_TILE":
            return {
                ...state,
                tiles: {
                    ...state.tiles,
                    [action.tile.id]: action.tile,
                },
                hasChanged: true
            };
        
        /**
         * Action: START_MOVE
         * Sets the game state to indicate that tiles are in motion, saves the current state for undo,
         * and marks that an undo is now possible.
         */
        case "START_MOVE":
            return {
                ...state,
                inMotion: true,
                hasChanged: false, // Reset hasChanged for the new move
                canUndo: true,
                previousState: state, // Save current state for undo functionality
            };
        
        /**
         * Action: END_MOVE
         * Concludes a move animation. Cleans up removed tiles and resets animation flags.
         */
        case "END_MOVE":
            const newTiles = { ...state.tiles };
            // Filter out tiles that were marked as removed during the move
            const newByIds = state.byIds.filter(id => !newTiles[id].isRemoved);

            // Reset animation-related flags for remaining tiles
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
                inMotion: false, // No longer in motion
            };
        
        /**
         * Action: RESET_GAME
         * Resets the game to its initial state.
         */
        case "RESET_GAME":
            return {
                ...initialState,
            };
        
        /**
         * Action: UPDATE_ALL_TILES
         * Updates the entire set of tiles and the current score after a move has been processed.
         * Payload: { tiles: { [id: string]: Tile }; byIds: string[]; score: number }
         */
        case "UPDATE_ALL_TILES":
            return {
                ...state,
                tiles: action.tiles,
                byIds: action.byIds,
                score: state.score + action.score, // Add score from the move result
            };
        
        /**
         * Action: UNDO_MOVE
         * Reverts the game state to the `previousState` saved before the last move.
         * Payload: { previousState: GameState } - The state to revert to.
         */
        case "UNDO_MOVE":
            return {
                ...(action.previousState || state), // Revert to previous state, or current if previous is null
                canUndo: false, // Undo can only be performed once per saved state
            };
        
        /**
         * Action: CONTINUE_GAME
         * Resets the `isWon` flag, allowing the player to continue playing after reaching 2048.
         */
        case "CONTINUE_GAME":
            return {
                ...state,
                isWon: false,
            };
        
        /**
         * Action: GAME_OVER
         * Sets the game over flag to true.
         */
        case "GAME_OVER":
            return {
                ...state,
                isGameOver: true,
            };
        
        /**
         * Action: WIN_GAME
         * Sets the game won flag to true.
         */
        case "WIN_GAME":
            return {
                ...state,
                isWon: true,
            };
        
        /**
         * Action: SET_INITIAL_STATE
         * Completely replaces the current game state with a new one. Used for restarting the game.
         * Payload: { newState: GameState } - The new state to set.
         */
        case "SET_INITIAL_STATE":
            return action.newState;
        
        /**
         * Default case: Returns the current state if the action type is not recognized.
         */
        default:
            return state;
    }
};