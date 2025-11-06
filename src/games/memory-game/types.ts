
// src/games/memory-game/types.ts

export interface Card {
  id: string;
  value: string; // The value to match (e.g., an emoji or image URL)
  isFlipped: boolean;
  isMatched: boolean;
}

export enum Difficulty {
  Easy = 'Easy', // 4x3
  Medium = 'Medium', // 4x4
  Hard = 'Hard', // 6x4
}

export interface GameState {
  cards: Card[];
  flippedCards: number[]; // Indices of flipped cards
  matchedPairs: number;
  moves: number;
  gameStatus: 'idle' | 'playing' | 'won';
  difficulty: Difficulty;
  timer: number;
}

export type Action =
  | { type: 'START_GAME'; payload: { difficulty: Difficulty } }
  | { type: 'FLIP_CARD'; payload: { index: number } }
  | { type: 'CHECK_MATCH' }
  | { type: 'RESET_FLIPPED' }
  | { type: 'GAME_WON' }
  | { type: 'RESET_GAME' }
  | { type: 'TICK' };
