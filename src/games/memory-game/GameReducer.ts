// src/games/memory-game/GameReducer.ts

import { GameState, Action, Difficulty, Card } from './types';
import { EMOJI_CARDS, DIFFICULTY_SETTINGS } from '../../utils/memory-game_const';

const createShuffledCards = (difficulty: Difficulty): Card[] => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const cardValues = EMOJI_CARDS.slice(0, settings.pairs);
  const gameCards = [...cardValues, ...cardValues];

  // Fisher-Yates shuffle
  for (let i = gameCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
  }

  return gameCards.map((value, index) => ({
    id: `card-${index}`,
    value,
    isFlipped: false,
    isMatched: false,
  }));
};

export const initialState: GameState = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  gameStatus: 'idle',
  difficulty: Difficulty.Easy,
  timer: 0,
};

export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        difficulty: action.payload.difficulty,
        cards: createShuffledCards(action.payload.difficulty),
        gameStatus: 'playing',
      };
    case 'FLIP_CARD':
      if (state.flippedCards.length === 2) return state;

      const newCards = [...state.cards];
      newCards[action.payload.index].isFlipped = true;

      return {
        ...state,
        cards: newCards,
        flippedCards: [...state.flippedCards, action.payload.index],
        moves: state.moves + 1,
      };
    case 'CHECK_MATCH':
      if (state.flippedCards.length !== 2) return state;

      const [firstIndex, secondIndex] = state.flippedCards;
      const newMatchedPairs = state.matchedPairs + 1;

      if (state.cards[firstIndex].value === state.cards[secondIndex].value) {
        const newCards = state.cards.map((card, index) => {
          if (index === firstIndex || index === secondIndex) {
            return { ...card, isMatched: true };
          }
          return card;
        });
        return {
          ...state,
          cards: newCards,
          matchedPairs: newMatchedPairs,
          flippedCards: [],
        };
      } else {
        // No match, just return the state. The hook will handle flipping back.
        return state;
      }
    case 'RESET_FLIPPED':
        const resetCards = state.cards.map((card, index) => {
            if(state.flippedCards.includes(index)){
                return { ...card, isFlipped: false };
            }
            return card;
        });
        return {
            ...state,
            cards: resetCards,
            flippedCards: [],
        }
    case 'GAME_WON':
      return {
        ...state,
        gameStatus: 'won',
      };
    case 'RESET_GAME':
      return initialState;
    case 'TICK':
      return {
        ...state,
        timer: state.timer + 1,
      };
    default:
      return state;
  }
};
