export type CellState = 'hidden' | 'revealed' | 'flagged';

export type CellValue = number | 'mine' | 'empty';

export interface Cell {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  isRevealed: boolean;
  isFlagged: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export interface GameState {
  board: Cell[][];
  config: GameConfig;
  gameStatus: 'idle' | 'playing' | 'won' | 'lost';
  mineCount: number;
  flagCount: number;
  elapsedTime: number;
  difficulty: Difficulty;
  revealedCount: number;
  firstClick: boolean;
}

export type GameAction =
  | { type: 'INITIALIZE'; payload: { difficulty: Difficulty } }
  | { type: 'REVEAL_CELL'; payload: { row: number; col: number } }
  | { type: 'TOGGLE_FLAG'; payload: { row: number; col: number } }
  | { type: 'RESTART' }
  | { type: 'TICK' }
  | { type: 'SET_DIFFICULTY'; payload: { difficulty: Difficulty } };

export interface GameStatistics {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  bestTime: number | null;
}