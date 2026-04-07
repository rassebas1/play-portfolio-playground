import React from 'react';
import { X, Bot, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Personality } from '../types';

interface ChatHeaderProps {
  onClose: () => void;
  personality: Personality;
  onTogglePersonality: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClose,
  personality,
  onTogglePersonality,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Portfolio Assistant</h3>
          <button
            onClick={onTogglePersonality}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-400 transition-colors cursor-pointer"
            aria-label={`Switch to ${personality === 'friend' ? 'manager' : 'friend'} mode`}
          >
            {personality === 'friend' ? (
              <>
                <Users className="w-3 h-3" />
                <span>Friend mode</span>
              </>
            ) : (
              <>
                <Briefcase className="w-3 h-3" />
                <span>Manager mode</span>
              </>
            )}
          </button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-slate-400 hover:text-white hover:bg-slate-700/50"
        aria-label="Close chat"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};
