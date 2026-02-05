import { useEffect } from 'react';
import { GameState, Action } from '../types';

interface UseMemoryGameLogicProps {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

export const useMemoryGameLogic = ({ state, dispatch }: UseMemoryGameLogicProps) => {
  // Effect for the game timer
  useEffect(() => {
    if (state.gameStatus === 'playing') {
      const timer = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.gameStatus, dispatch]);

  // Effect for checking card matches
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
  }, [state.flippedCards, state.cards, dispatch]);

  // Effect for checking win condition
  useEffect(() => {
    if (state.gameStatus === 'playing' && state.cards.length > 0 && state.matchedPairs === state.cards.length / 2) {
      dispatch({ type: 'GAME_WON' });
    }
  }, [state.matchedPairs, state.cards.length, state.gameStatus, dispatch]);
};
