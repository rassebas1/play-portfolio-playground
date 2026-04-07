/**
 * Wave Indicator Component
 * 
 * Displays current wave number, progress, and wave start button.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MAX_WAVES } from '../constants';

interface WaveIndicatorProps {
  currentWave: number;
  phase: string;
  enemiesRemaining: number;
  onStartWave: () => void;
  canStartWave: boolean;
}

export const WaveIndicator: React.FC<WaveIndicatorProps> = ({
  currentWave,
  phase,
  enemiesRemaining,
  onStartWave,
  canStartWave,
}) => {
  const { t } = useTranslation('games/tower-defense');
  const progress = (currentWave / MAX_WAVES) * 100;

  const getStatusText = () => {
    switch (phase) {
      case 'planning':
        return t('status.planning');
      case 'playing':
        return t('status.wave_active');
      case 'waveComplete':
        return t('status.wave_complete');
      case 'gameOver':
        return t('status.game_over');
      case 'victory':
        return t('status.victory');
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Wave number and status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t('ui.wave', { count: currentWave })} / {MAX_WAVES}
          </span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              phase === 'playing'
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : phase === 'gameOver'
                  ? 'bg-red-500/20 text-red-400'
                  : phase === 'victory'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-muted text-muted-foreground'
            )}
          >
            {getStatusText()}
          </span>
        </div>

        {/* Start Wave Button */}
        {phase === 'planning' && (
          <Button
            onClick={onStartWave}
            disabled={!canStartWave}
            size="sm"
            className={cn(
              'min-h-[32px] text-xs font-semibold',
              'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500',
              canStartWave && 'animate-pulse'
            )}
          >
            {currentWave === 0 ? t('ui.start_wave') : t('ui.next_wave')}
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Enemies remaining (during active wave) */}
      {phase === 'playing' && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {t('ui.enemies_remaining', { count: enemiesRemaining }) || `Enemies: ${enemiesRemaining}`}
          </span>
        </div>
      )}
    </div>
  );
};
