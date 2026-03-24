import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bot, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Difficulty, GameMode, DifficultyInfo } from '../types';
import { DIFFICULTIES } from '../types';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
  disabled?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onDifficultyChange,
  gameMode,
  onGameModeChange,
  disabled = false,
}) => {
  const { t } = useTranslation('games/tic-tac-toe');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Game Mode Toggle - Retro arcade style */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-900 dark:bg-slate-800 rounded-lg p-1 border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <button
            onClick={() => onGameModeChange('pvp')}
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200",
              gameMode === 'pvp'
                ? "bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                : "text-cyan-300 hover:text-cyan-100 hover:bg-slate-700/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Users className="w-4 h-4" />
            {t('ai.pvp')}
          </button>
          <button
            onClick={() => onGameModeChange('pve')}
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200",
              gameMode === 'pve'
                ? "bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                : "text-cyan-300 hover:text-cyan-100 hover:bg-slate-700/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Bot className="w-4 h-4" />
            {t('ai.pve')}
          </button>
        </div>
      </div>

      {/* Difficulty Selector - Only show in PVE mode */}
      {gameMode === 'pve' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-slate-400 uppercase tracking-wider">{t('ai.difficulty.label')}:</span>
            <span className="text-cyan-400 font-bold">{t(`ai.difficulty.${difficulty}`)}</span>
          </div>

          {/* Difficulty Options - Horizontal scroll on mobile */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-2 px-2 md:px-0">
            {DIFFICULTIES.map((diff, index) => (
              <button
                key={diff.id}
                onClick={() => onDifficultyChange(diff.id)}
                disabled={disabled}
                className={cn(
                  "flex-shrink-0 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wide",
                  "border-2 transition-all duration-200",
                  difficulty === diff.id
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                    : "border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-300",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="block text-[10px] opacity-60 mb-0.5">{index + 1}</span>
                {t(diff.labelKey)}
              </button>
            ))}
          </div>

          {/* Description */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {t(`ai.difficulty.${difficulty}_desc`)}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DifficultySelector;
