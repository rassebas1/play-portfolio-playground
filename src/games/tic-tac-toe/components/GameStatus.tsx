import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Circle, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GameResult, Player } from '../types';

/**
 * PlayerToken component - Displays animated player icon
 */
interface PlayerTokenProps {
  player: Player;
  isActive: boolean;
  size?: 'sm' | 'lg';
}

const PlayerToken: React.FC<PlayerTokenProps> = ({ player, isActive, size = 'lg' }) => {
  const sizeClasses = size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  const containerClasses = size === 'lg' ? 'w-14 h-14' : 'w-9 h-9';
  
  return (
    <div className={cn(
      containerClasses,
      "rounded-xl flex items-center justify-center transition-all duration-300",
      "border-2",
      player === 'X' 
        ? "bg-blue-500/10 border-blue-500 text-blue-500"
        : "bg-orange-500/10 border-orange-500 text-orange-500",
      isActive && "scale-110 shadow-lg",
      isActive && player === 'X' && "shadow-blue-500/30",
      isActive && player === 'O' && "shadow-orange-500/30",
      !isActive && "opacity-40 scale-95 grayscale"
    )}>
      {player === 'X' ? (
        <X className={cn(sizeClasses, "stroke-[3]")} />
      ) : (
        <Circle className={cn(sizeClasses, "stroke-[3]")} />
      )}
    </div>
  );
};

/**
 * Props for the GameStatus component.
 */
interface GameStatusProps {
  gameResult: GameResult;
  winner: Player | null;
  moveCount: number;
  gameStarted: boolean;
  currentPlayer: Player;
}

/**
 * GameStatus component - Floating indicator with animated player tokens
 */
export const GameStatus: React.FC<GameStatusProps> = ({
  gameResult,
  winner,
  moveCount,
  gameStarted,
  currentPlayer,
}) => {
  const { t } = useTranslation('games/tic-tac-toe');
  const { t: tCommon } = useTranslation('common');

  const isXActive = gameResult === 'ongoing' && currentPlayer === 'X';
  const isOActive = gameResult === 'ongoing' && currentPlayer === 'O';
  const showWinner = gameResult === 'win' && winner;

  // Generate status message based on game state
  const getStatusMessage = () => {
    if (gameResult === 'win' && winner) {
      return t('status.win', { player: winner });
    }
    if (gameResult === 'draw') {
      return t('status.draw');
    }
    if (!gameStarted) {
      return t('status.start');
    }
    return t('status.turn', { player: currentPlayer });
  };

  return (
    <div className="flex justify-center mb-6">
      <div className={cn(
        "inline-flex items-center gap-4 px-6 py-3 rounded-2xl",
        "bg-card/80 backdrop-blur-sm border border-border shadow-xl",
        "transition-all duration-300"
      )}>
        {/* Player X Token */}
        <div className="relative">
          <PlayerToken 
            player="X" 
            isActive={showWinner ? winner === 'X' : isXActive} 
          />
          {isXActive && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          )}
        </div>

        {/* Status Content */}
        <div className="flex flex-col items-center min-w-[140px]">
          {/* Status Icon and Text */}
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {gameResult === 'win' && <Trophy className="w-4 h-4 text-yellow-500" />}
            {gameResult === 'draw' && <Users className="w-4 h-4 text-muted-foreground" />}
            <span>{getStatusMessage()}</span>
          </div>
          
          {/* Move Count with pluralization */}
          <div className="text-xs text-muted-foreground mt-1">
            {tCommon('move_count', { count: moveCount })}
          </div>
        </div>

        {/* Player O Token */}
        <div className="relative">
          <PlayerToken 
            player="O" 
            isActive={showWinner ? winner === 'O' : isOActive} 
          />
          {isOActive && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
