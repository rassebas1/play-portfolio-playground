
// src/games/memory-game/hooks/useMemoryGame.ts

import { useReducer, useEffect, useCallback } from 'react';
import { gameReducer, initialState } from '../GameReducer';
import { Difficulty } from '../types';

export const useMemoryGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (state.gameStatus === 'playing') {
      const timer = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.gameStatus]);

  useEffect(() => {
    if (state.flippedCards.length === 2) {
      const [firstIndex, secondIndex] = state.flippedCards;
      if (state.cards[firstIndex].value === state.cards[secondIndex].value) {
        dispatch({ type: 'CHECK_MATCH' });
      } else {
        setTimeout(() => {
          dispatch({ type: 'RESET_FLIPPED' });
        }, 1000);
      }
    }
  }, [state.flippedCards, state.cards]);

  useEffect(() => {
    if (state.gameStatus === 'playing' && state.cards.length > 0 && state.matchedPairs === state.cards.length / 2) {
      dispatch({ type: 'GAME_WON' });
    }
  }, [state.matchedPairs, state.cards.length, state.gameStatus]);

  const startGame = (difficulty: Difficulty) => {
    dispatch({ type: 'START_GAME', payload: { difficulty } });
  };

  const flipCard = (index: number) => {
    if (state.flippedCards.length < 2 && !state.cards[index].isFlipped && state.gameStatus === 'playing') {
      dispatch({ type: 'FLIP_CARD', payload: { index } });
    }
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return { state, startGame, flipCard, resetGame };
};
