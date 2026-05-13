import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { GameScoreProvider, useGameScore, getLocalHighScore } from './GameScoreContext'
import type { ReactNode } from 'react'

beforeEach(() => {
  localStorage.clear()
})

describe('getLocalHighScore', () => {
  it('returns null when nothing is stored', () => {
    expect(getLocalHighScore('test-game')).toBeNull()
  })

  it('returns parsed value when data exists', () => {
    localStorage.setItem('highScore_test-game', '100')
    expect(getLocalHighScore('test-game')).toBe(100)
  })

  it('handles corrupted JSON gracefully', () => {
    localStorage.setItem('highScore_test-game', 'not-json')
    expect(getLocalHighScore('test-game')).toBeNull()
  })
})

describe('GameScoreProvider and useGameScore', () => {
  it('provides context values', () => {
    const { result } = renderHook(() => useGameScore(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <GameScoreProvider>{children}</GameScoreProvider>
      ),
    })

    expect(result.current.currentScore).toBeNull()
    expect(result.current.currentGame).toBeNull()
    expect(result.current.isNewHighScore).toBe(false)
    expect(result.current.previousHighScore).toBeNull()
  })

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useGameScore())).toThrow(
      'useGameScore must be used within a GameScoreProvider'
    )
  })

  it('recordScore returns isNewHighScore false when no currentGame', () => {
    const { result } = renderHook(() => useGameScore(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <GameScoreProvider>{children}</GameScoreProvider>
      ),
    })

    const res = act(() => result.current.recordScore(100))

    expect(result.current.currentScore).toBeNull()
  })

  it('records a score and detects new high score', () => {
    const { result } = renderHook(() => useGameScore(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <GameScoreProvider>{children}</GameScoreProvider>
      ),
    })

    act(() => result.current.setCurrentGame('tic-tac-toe' as any))

    act(() => {
      const res = result.current.recordScore(100)
      expect(res.isNewHighScore).toBe(true)
      expect(res.newHighScore).toBe(100)
    })

    expect(result.current.currentScore).toBe(100)
    expect(result.current.isNewHighScore).toBe(true)
  })

  it('does not update when new score is lower', () => {
    localStorage.setItem('highScore_tic-tac-toe', '200')

    const { result } = renderHook(() => useGameScore(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <GameScoreProvider>{children}</GameScoreProvider>
      ),
    })

    act(() => result.current.setCurrentGame('tic-tac-toe' as any))

    act(() => {
      const res = result.current.recordScore(50)
      expect(res.isNewHighScore).toBe(false)
      expect(res.newHighScore).toBe(200)
    })
  })

  it('resetScore clears all score state', () => {
    const { result } = renderHook(() => useGameScore(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <GameScoreProvider>{children}</GameScoreProvider>
      ),
    })

    act(() => result.current.setCurrentGame('tic-tac-toe' as any))
    act(() => { result.current.recordScore(100) })
    act(() => { result.current.resetScore() })

    expect(result.current.currentScore).toBeNull()
    expect(result.current.isNewHighScore).toBe(false)
    expect(result.current.previousHighScore).toBeNull()
  })
})
