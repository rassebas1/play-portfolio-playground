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
 * 
 * Accessibility Features:
 * - ARIA labels and roles
 * - Live regions for dynamic content
 * - Keyboard navigation
 * - Screen reader announcements
 * - Focus management
 * 
 * Offline Features:
 * - Online/offline status indicator
 * - Cached data display when offline
 * - Retry functionality
 */

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Crown, User, Loader2, WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/forms/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display/card'
import { useLeaderboard, useScoreSubmitter } from '@/hooks/useLeaderboard'
import type { GameName, GameSession } from '@/types/highScores'
import { validateUsername, containsProfanity } from '@/utils/profanityFilter'
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from '@/types/highScores'
import { getGameMetrics, hasMultipleMetrics, type GameMetric } from '@/types/games'

interface LeaderboardProps {
  game: GameName
  limit?: number
  currentSession?: GameSession | null
  finalScore?: number
  autoFetch?: boolean
  metric?: string
}

export function Leaderboard({ 
  game, 
  limit = 10, 
  currentSession,
  finalScore = 0,
  autoFetch = true,
  metric: initialMetric
}: LeaderboardProps) {
  const { t } = useTranslation('common')
  
  // Get game metrics configuration
  const gameMetrics = getGameMetrics(game)
  const primaryMetric = gameMetrics?.primary || 'score'
  const availableMetrics = gameMetrics?.metrics || [{ key: 'score', labelKey: 'leaderboard.score', strategy: 'highest' as const }]
  const supportsMultipleMetrics = availableMetrics.length > 1
  
  // State for selected metric
  const [selectedMetric, setSelectedMetric] = useState<string>(initialMetric || primaryMetric)
  
  // Update selected metric when initialMetric changes
  useEffect(() => {
    if (initialMetric) {
      setSelectedMetric(initialMetric)
    }
  }, [initialMetric])
  
  const { 
    scores, 
    loading, 
    error, 
    isOffline, 
    lastFetched,
    fetchScores, 
    retry 
  } = useLeaderboard(game, limit, { autoFetch, metric: selectedMetric })
  
  const leaderboardRef = useRef<HTMLDivElement>(null)

  // Announce to screen readers when scores load
  useEffect(() => {
    if (!loading && scores.length > 0) {
      const announcement = `${scores.length} ${t('high_scores.points')} loaded`
      const liveRegion = document.getElementById('leaderboard-live-region')
      if (liveRegion) {
        liveRegion.textContent = announcement
      }
    }
  }, [loading, scores.length, t])

  const handleRetry = async () => {
    await retry()
  }

  const formatLastFetched = (timestamp: number | null) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" aria-hidden="true" />
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" aria-hidden="true" />
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" aria-hidden="true" />
    return <span className="text-muted-foreground font-mono w-5 inline-block text-right" aria-label={`Rank ${index + 1}`}>{index + 1}</span>
  }

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-yellow-500/10 border-yellow-500/30'
    if (index === 1) return 'bg-gray-500/10 border-gray-500/30'
    if (index === 2) return 'bg-amber-700/10 border-amber-700/30'
    return ''
  }

  return (
    <Card 
      className="w-full max-w-md overflow-hidden"
      role="region"
      aria-label={`${t('high_scores.title')} - ${game}`}
    >
      {/* Screen reader live region for announcements */}
      <div 
        id="leaderboard-live-region"
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" aria-hidden="true" />
            <CardTitle>{t('high_scores.title')}</CardTitle>
          </div>
          
          {/* Offline indicator */}
          {isOffline && (
            <div 
              className="flex items-center gap-1 text-amber-600 text-sm"
              role="status"
              aria-label={t('high_scores.offline') || 'You are offline'}
            >
              <WifiOff className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">{t('high_scores.offline') || 'Offline'}</span>
            </div>
          )}
        </div>
        
        {/* Last updated timestamp */}
        {lastFetched && (
          <p className="text-xs text-muted-foreground mt-1">
            {t('high_scores.last_updated', { time: formatLastFetched(lastFetched) })}
          </p>
        )}
        
        {/* Metric Tabs - Only show if game has multiple metrics */}
        {supportsMultipleMetrics && (
          <div className="flex gap-1 mt-2" role="tablist" aria-label="Leaderboard metrics">
            {availableMetrics.map((m: GameMetric) => (
              <button
                key={m.key}
                role="tab"
                aria-selected={selectedMetric === m.key}
                onClick={() => setSelectedMetric(m.key)}
                className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  selectedMetric === m.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {t(m.labelKey)}
              </button>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Offline notice */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800"
            role="alert"
          >
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t('high_scores.offline_notice') || 'You are viewing cached scores while offline.'}
            </p>
          </motion.div>
        )}

        {/* Loading state */}
        {loading ? (
          <div 
            className="flex items-center justify-center py-8"
            aria-label={t('high_scores.loading')}
          >
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">{t('high_scores.loading')}</span>
          </div>
        ) : scores.length === 0 ? (
          // Empty state
          <div 
            className="text-center py-8 text-muted-foreground"
            role="status"
            aria-label={t('high_scores.empty')}
          >
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p>{t('high_scores.empty')}</p>
          </div>
        ) : (
          // Leaderboard list
          <div 
            ref={leaderboardRef}
            role="list"
            aria-label={`${t('high_scores.title')} - ${scores.length} ${t('high_scores.points')}`}
          >
            {/* Header row - visually hidden but available to screen readers */}
            <div className="sr-only" role="row">
              <span>{t('high_scores.rank')}</span>
              <span>{t('high_scores.player')}</span>
              <span>{t('high_scores.points')}</span>
              <span>{t('high_scores.date')}</span>
            </div>
            
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
                  role="listitem"
                  className={`grid grid-cols-12 gap-2 items-center px-2 py-2 rounded-md ${getRankStyle(index)} border border-transparent`}
                  tabIndex={0}
                  aria-label={`Rank ${index + 1}: ${entry.username}, ${entry.score} ${t('high_scores.points')}, ${new Date(entry.created_at).toLocaleDateString()}`}
                >
                  <div className="col-span-2 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  <div className="col-span-4 font-mono font-medium tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
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

        {/* Error state with retry */}
        {error && !loading && (
          <div className="text-center py-4">
            <p className="text-sm text-red-600 mb-3" role="alert">
              {error}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="flex items-center gap-2 mx-auto"
              aria-label={t('high_scores.retry') || 'Try again'}
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              {t('high_scores.retry') || 'Retry'}
            </Button>
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
  metrics?: Record<string, number>
  isNewHighScore?: boolean
}

export function ScoreSubmitter({ game, finalScore, session, metrics, isNewHighScore = false }: ScoreSubmitterProps) {
  const { t } = useTranslation('common')
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const { submit, submitting, submitted, error, reset } = useScoreSubmitter(game)
  const inputRef = useRef<HTMLInputElement>(null)

  const isUsernameValid = username.length >= USERNAME_MIN_LENGTH && username.length <= USERNAME_MAX_LENGTH && !containsProfanity(username)

  const handleSubmit = async () => {
    const validation = validateUsername(username)
    if (!validation.valid) {
      setUsernameError(validation.error || 'Invalid username')
      return
    }
    await submit(username, finalScore, session, metrics)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isUsernameValid) {
      handleSubmit()
    }
  }

  // Clear error when username changes
  useEffect(() => {
    if (usernameError) {
      setUsernameError(null)
    }
  }, [username])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-6"
        role="status"
        aria-live="polite"
      >
        <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-500" aria-hidden="true" />
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
      role="form"
      aria-label={t('high_scores.submit_title')}
    >
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          {isNewHighScore ? t('high_scores.new_high_score') : t('high_scores.submit_title')}
        </p>
        <p 
          className="text-4xl font-bold font-mono"
          aria-label={`${finalScore} points`}
        >
          {finalScore.toLocaleString()}
        </p>
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="score-submitter-username" 
          className="text-sm font-medium"
        >
          {t('high_scores.username_label')}
        </label>
        <Input
          ref={inputRef}
          id="score-submitter-username"
          type="text"
          maxLength={USERNAME_MAX_LENGTH}
          placeholder={t('high_scores.username_placeholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, USERNAME_MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          className="font-mono text-center text-2xl tracking-widest uppercase h-14"
          disabled={submitting}
          aria-describedby="username-hint"
          aria-invalid={usernameError ? 'true' : 'false'}
          autoComplete="off"
        />
        <p id="username-hint" className="text-xs text-muted-foreground">
          {t('high_scores.username_hint') || `Enter ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} letters or numbers`}
        </p>
      </div>

      {usernameError && (
        <p 
          className="text-sm text-red-600 text-center" 
          role="alert"
        >
          {usernameError}
        </p>
      )}

      {error && (
        <p 
          className="text-sm text-red-600 text-center" 
          role="alert"
        >
          {t('high_scores.error')}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!isUsernameValid || submitting}
        className="w-full h-12 text-lg"
        aria-label={submitting ? t('high_scores.submitting') : t('high_scores.submit')}
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" aria-hidden="true" />
            {t('high_scores.submitting')}
          </>
        ) : (
          t('high_scores.submit')
        )}
      </Button>
    </motion.div>
  )
}
