import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { GameName } from '@/types/highScores'

interface ScoreRecordResult {
  isNewHighScore: boolean
  previousHighScore: number | null
  newHighScore: number
}

interface GameScoreContextType {
  currentGame: GameName | null
  currentScore: number | null
  previousHighScore: number | null
  isNewHighScore: boolean
  setCurrentGame: (game: GameName | null) => void
  recordScore: (score: number) => ScoreRecordResult
  resetScore: () => void
}

const GameScoreContext = createContext<GameScoreContextType | undefined>(undefined)

const HIGH_SCORE_PREFIX = 'highScore_'

export function GameScoreProvider({ children }: { children: ReactNode }) {
  const [currentGame, setCurrentGame] = useState<GameName | null>(null)
  const [currentScore, setCurrentScore] = useState<number | null>(null)
  const [previousHighScore, setPreviousHighScore] = useState<number | null>(null)
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  const recordScore = useCallback((score: number): ScoreRecordResult => {
    if (!currentGame) {
      return { isNewHighScore: false, previousHighScore: null, newHighScore: score }
    }

    const storageKey = `${HIGH_SCORE_PREFIX}${currentGame}`
    let storedHighScore: number | null = null

    try {
      const stored = localStorage.getItem(storageKey)
      storedHighScore = stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error reading high score:', error)
    }

    let newHigh = false
    let newHighScoreValue = score
    let previous = storedHighScore

    if (storedHighScore === null || score > storedHighScore) {
      newHigh = true
      newHighScoreValue = score
      previous = storedHighScore

      try {
        localStorage.setItem(storageKey, JSON.stringify(score))
      } catch (error) {
        console.error('Error saving high score:', error)
      }
    } else {
      newHighScoreValue = storedHighScore
    }

    setCurrentScore(score)
    setPreviousHighScore(previous)
    setIsNewHighScore(newHigh)

    return {
      isNewHighScore: newHigh,
      previousHighScore: previous,
      newHighScore: newHighScoreValue
    }
  }, [currentGame])

  const resetScore = useCallback(() => {
    setCurrentScore(null)
    setPreviousHighScore(null)
    setIsNewHighScore(false)
  }, [])

  return (
    <GameScoreContext.Provider
      value={{
        currentGame,
        currentScore,
        previousHighScore,
        isNewHighScore,
        setCurrentGame,
        recordScore,
        resetScore
      }}
    >
      {children}
    </GameScoreContext.Provider>
  )
}

export function useGameScore() {
  const context = useContext(GameScoreContext)
  if (!context) {
    throw new Error('useGameScore must be used within a GameScoreProvider')
  }
  return context
}

export function getLocalHighScore(gameId: string): number | null {
  try {
    const stored = localStorage.getItem(`${HIGH_SCORE_PREFIX}${gameId}`)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}
