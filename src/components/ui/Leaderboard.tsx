/**
 * Leaderboard UI Component - Hexagonal Architecture
 * 
 * This component is part of the UI layer (adapter in hexagonal terms).
 * It uses the useLeaderboard hook which connects to the service layer.
 * 
 * Architecture:
 * - Domain: src/types/highScores.ts (GameName, HighScore, GameSession)
 * - Port: src/services/highScores.ts (HighScoresPort interface)
 * - Adapter (Hook): src/hooks/useLeaderboard.ts
 * - Adapter (UI): This component
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Crown, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/forms/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display/card'
import { useLeaderboard, useScoreSubmitter } from '@/hooks/useLeaderboard'
import type { GameName, GameSession } from '@/types/highScores'

interface LeaderboardProps {
  game: GameName
  limit?: number
  currentSession?: GameSession | null
  autoFetch?: boolean
}

export function Leaderboard({ 
  game, 
  limit = 10, 
  currentSession,
  autoFetch = true 
}: LeaderboardProps) {
  const { t } = useTranslation('common')
  const { scores, loading, error, fetchScores, submitScore } = useLeaderboard(game, limit, { autoFetch })
  const [username, setUsername] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmitScore = async () => {
    if (!username || username.length !== 3 || !currentSession) return

    const success = await submitScore(username, 0, currentSession)
    
    if (success) {
      setSubmitStatus('success')
      setUsername('')
    } else {
      setSubmitStatus('error')
    }
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />
    return <span className="text-muted-foreground font-mono w-5 inline-block text-right">{index + 1}</span>
  }

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-yellow-500/10 border-yellow-500/30'
    if (index === 1) return 'bg-gray-500/10 border-gray-500/30'
    if (index === 2) return 'bg-amber-700/10 border-amber-700/30'
    return ''
  }

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <CardTitle>{t('high_scores.title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSession && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/5 border border-primary/20"
          >
            <p className="text-sm font-medium mb-3">{t('high_scores.submit_title')}</p>
            <div className="flex gap-2">
              <Input
                type="text"
                maxLength={3}
                placeholder={t('high_scores.username_placeholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3))}
                className="font-mono text-center tracking-widest uppercase"
              />
              <Button
                onClick={handleSubmitScore}
                disabled={username.length !== 3}
                className="min-w-[100px]"
              >
                {t('high_scores.submit')}
              </Button>
            </div>
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-green-600 mt-2"
                >
                  {t('high_scores.success')}
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-600 mt-2"
                >
                  {t('high_scores.error')}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t('high_scores.empty')}</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground uppercase tracking-wider px-2 pb-2 border-b">
              <div className="col-span-2 text-center">#</div>
              <div className="col-span-4">{t('high_scores.player')}</div>
              <div className="col-span-4 text-right">{t('high_scores.points')}</div>
              <div className="col-span-2 text-right">{t('high_scores.date')}</div>
            </div>
            <AnimatePresence mode="popLayout">
              {scores.map((entry, index) => (
                <motion.div
                  key={`${entry.username}-${entry.score}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`grid grid-cols-12 gap-2 items-center px-2 py-2 rounded-md ${getRankStyle(index)} border border-transparent`}
                >
                  <div className="col-span-2 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  <div className="col-span-4 font-mono font-medium tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-muted-foreground" />
                    {entry.username}
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="col-span-2 text-right text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ScoreSubmitterProps {
  game: GameName
  finalScore: number
  session: GameSession
}

export function ScoreSubmitter({ game, finalScore, session }: ScoreSubmitterProps) {
  const { t } = useTranslation('common')
  const [username, setUsername] = useState('')
  const { submit, submitting, submitted, error, reset } = useScoreSubmitter(game)

  const handleSubmit = async () => {
    await submit(username, finalScore, session)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-6"
      >
        <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          {t('high_scores.game_won')}
        </h3>
        <p className="text-muted-foreground">
          {t('high_scores.success')}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">{t('game_over.final_score')}</p>
        <p className="text-4xl font-bold font-mono">{finalScore.toLocaleString()}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t('high_scores.username_label')}</label>
        <Input
          type="text"
          maxLength={3}
          placeholder={t('high_scores.username_placeholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3))}
          className="font-mono text-center text-2xl tracking-widest uppercase h-14"
          disabled={submitting}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center">{t('high_scores.error')}</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={username.length !== 3 || submitting}
        className="w-full h-12 text-lg"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {t('high_scores.submitting')}
          </>
        ) : (
          t('high_scores.submit')
        )}
      </Button>
    </motion.div>
  )
}
