import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Particle configuration for firework animation
 */
interface Particle {
  id: number;
  color: string;
  angle: number;
  distance: number;
  delay: number;
}

/**
 * Props for WinCelebrationOverlay component
 */
interface WinCelebrationOverlayProps {
  /** Controls visibility of the overlay */
  isVisible: boolean;
  /** Winner identifier (e.g., 'X', 'O', or any string) */
  winner: string;
  /** Display name for the winner (fallback if translation key not provided) */
  winnerName?: string;
  /** Translation key for winner title (e.g., 'celebration.winner_title') */
  winnerTitleKey?: string;
  /** Translation key for winner subtitle (e.g., 'celebration.winner_subtitle') */
  winnerSubtitleKey?: string;
  /** Translation namespace to use (default: 'common') */
  translationNamespace?: string;
  /** Number of particles in firework animation (default: 30) */
  particleCount?: number;
  /** Total duration in milliseconds (default: 1500) */
  duration?: number;
  /** Callback triggered when animation completes */
  onComplete: () => void;
}

/**
 * Generates random particles for firework animation
 */
const generateParticles = (count: number): Particle[] => {
  const colors = [
    '#3B82F6', // Blue
    '#F97316', // Orange
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    angle: (360 / count) * i + (Math.random() * 30 - 15),
    distance: 80 + Math.random() * 60,
    delay: Math.random() * 100,
  }));
};

/**
 * WinCelebrationOverlay - A reusable celebration component with firework animation
 * 
 * Displays a full-screen dark overlay with animated firework particles,
 * winner icon, and celebratory text. Blocks all page interactions during
 * the celebration.
 * 
 * Supports per-game customization through translation keys.
 * 
 * Animation timeline (default 1500ms):
 * - 0-250ms: Fade in overlay
 * - 250-1250ms: Firework burst + winner display (1 second)
 * - 1250-1500ms: Fade out overlay
 * 
 * @example
 * ```tsx
 * // With custom translation keys
 * <WinCelebrationOverlay
 *   isVisible={showCelebration}
 *   winner="X"
 *   winnerTitleKey="celebration.winner_title"
 *   winnerSubtitleKey="celebration.winner_subtitle"
 *   translationNamespace="tic-tac-toe"
 *   onComplete={() => setShowCelebration(false)}
 * />
 * 
 * // With fallback display name
 * <WinCelebrationOverlay
 *   isVisible={showCelebration}
 *   winner="X"
 *   winnerName="Player X"
 *   onComplete={() => setShowCelebration(false)}
 * />
 * ```
 */
export const WinCelebrationOverlay: React.FC<WinCelebrationOverlayProps> = ({
  isVisible,
  winner,
  winnerName,
  winnerTitleKey,
  winnerSubtitleKey,
  translationNamespace = 'common',
  particleCount = 30,
  duration = 1500,
  onComplete,
}) => {
  const { t } = useTranslation(translationNamespace);
  
  // Animation phases: hidden → fade-in → active → fade-out
  const [phase, setPhase] = useState<'hidden' | 'fade-in' | 'active' | 'fade-out'>('hidden');
  
  // Use ref for onComplete to avoid stale closure issues and effect restarts
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete; // Keep ref updated with latest callback
  
  // Track if animation has started to prevent double-triggering on parent re-renders
  const hasStartedRef = useRef(false);
  
  // Generate particles once
  const particles = useMemo(() => generateParticles(particleCount), [particleCount]);
  
  // Calculate timing based on duration prop
  const fadeInDuration = Math.floor(duration * 0.167); // ~16.7% of duration (250ms default)
  const fadeOutDuration = Math.floor(duration * 0.167); // ~16.7% of duration (250ms default)
  const celebrationDuration = duration - fadeInDuration - fadeOutDuration;
  
  // Calculate CSS animation durations based on total duration (in seconds for CSS)
  const fireworkDuration = celebrationDuration / 1000;
  const iconBounceDuration = Math.min(0.6, celebrationDuration / 2000);
  const textRevealDuration = Math.min(0.5, celebrationDuration / 2400);
  const textRevealDelay = iconBounceDuration * 0.5;
  
  // Handle animation timeline
  useEffect(() => {
    // Reset hasStartedRef when isVisible becomes false
    if (!isVisible) {
      hasStartedRef.current = false;
      return;
    }
    
    // Only start animation if visible, in hidden phase, and hasn't started yet
    if (isVisible && phase === 'hidden' && !hasStartedRef.current) {
      hasStartedRef.current = true;
      
      // Start with fade-in
      setPhase('fade-in');
      
      const timers: NodeJS.Timeout[] = [];
      
      // Use requestAnimationFrame to ensure browser paints opacity-0 first
      requestAnimationFrame(() => {
        // Transition to active phase after fade-in
        timers.push(
          setTimeout(() => setPhase('active'), fadeInDuration)
        );
        
        // Transition to fade-out after celebration
        timers.push(
          setTimeout(() => setPhase('fade-out'), fadeInDuration + celebrationDuration)
        );
        
        // Complete and cleanup - use ref to always call latest callback
        timers.push(
          setTimeout(() => {
            setPhase('hidden');
            hasStartedRef.current = false; // Reset when complete
            onCompleteRef.current();
          }, duration)
        );
      });
      
      return () => timers.forEach(clearTimeout);
    }
    // Note: onComplete is intentionally omitted from deps to prevent effect restarts
    // The ref pattern ensures we always have access to the latest callback
  }, [isVisible, phase, duration, fadeInDuration, celebrationDuration]);
  
  // Get winner display text
  const getWinnerTitle = () => {
    if (winnerTitleKey) {
      return t(winnerTitleKey, { player: winner, defaultValue: winnerName || `Player ${winner}` });
    }
    return winnerName || `Player ${winner}`;
  };

  const getWinnerSubtitle = () => {
    if (winnerSubtitleKey) {
      return t(winnerSubtitleKey, { defaultValue: 'Wins!' });
    }
    return t('celebration.winner_subtitle', { defaultValue: 'Wins!' });
  };
  
  // Don't render if hidden
  if (phase === 'hidden') return null;
  
  // Determine if we should show the celebration content
  const showContent = phase === 'active' || phase === 'fade-out';
  
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/70 backdrop-blur-sm',
        'transition-opacity ease-in-out',
        phase === 'fade-in' && 'opacity-0',
        phase === 'active' && 'opacity-100',
        phase === 'fade-out' && 'opacity-0'
      )}
      style={{
        transitionDuration: `${fadeInDuration}ms`,
      }}
      aria-hidden="true"
    >
      {/* Particle Container - Firework burst */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              left: '50%',
              top: '40%',
              backgroundColor: particle.color,
              boxShadow: `0 0 6px ${particle.color}`,
              animation: `firework-particle ${fireworkDuration}s ease-out ${particle.delay}ms forwards`,
              ['--angle' as string]: `${particle.angle}deg`,
              ['--distance' as string]: `${particle.distance}px`,
            }}
          />
        ))}
      </div>
      
      {/* Winner Display */}
      <div
        className={cn(
          'relative z-10 text-center',
          'transition-all duration-300 ease-out',
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        )}
      >
        {/* Animated Winner Icon */}
        <div 
          className="mb-6"
          style={{
            animation: `winner-icon-bounce ${iconBounceDuration}s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`,
          }}
        >
          {winner === 'X' ? (
            <X
              className="w-28 h-28 sm:w-32 sm:h-32 mx-auto text-blue-500"
              strokeWidth={2.5}
              style={{
                filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.8))',
              }}
            />
          ) : winner === 'O' ? (
            <Circle
              className="w-28 h-28 sm:w-32 sm:h-32 mx-auto text-orange-500"
              strokeWidth={2.5}
              style={{
                filter: 'drop-shadow(0 0 30px rgba(249, 115, 22, 0.8))',
              }}
            />
          ) : (
            // Generic trophy for other winners
            <div className="text-7xl sm:text-8xl">🏆</div>
          )}
        </div>
        
        {/* Animated Winner Text */}
        <div
          style={{
            animation: `winner-text-reveal ${textRevealDuration}s ease-out ${textRevealDelay}s forwards`,
            opacity: 0,
          }}
        >
          <h2
            className={cn(
              'text-4xl sm:text-5xl md:text-6xl font-bold text-white',
              'drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
            )}
          >
            {getWinnerTitle()}
          </h2>
          <p className="text-2xl sm:text-3xl text-white/90 mt-2 font-semibold">
            {getWinnerSubtitle()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinCelebrationOverlay;
