import { useState, useCallback } from 'react';

export const useGame = (bestScoreKey: string) => {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScoreState] = useState(() => parseInt(localStorage.getItem(bestScoreKey) || '0'));
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const setBestScore = useCallback((newBestScore: number) => {
    localStorage.setItem(bestScoreKey, newBestScore.toString());
    setBestScoreState(newBestScore);
  }, [bestScoreKey]);

  const resetGame = useCallback(() => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(false);
    setGameStarted(false);
  }, []);

  return {
    score,
    setScore,
    bestScore,
    setBestScore,
    isGameOver,
    setIsGameOver,
    isPlaying,
    setIsPlaying,
    gameStarted,
    setGameStarted,
    resetGame,
  };
};