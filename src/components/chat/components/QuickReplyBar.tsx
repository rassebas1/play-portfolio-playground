import React from 'react';
import type { QuickReply } from '../types';

interface QuickReplyBarProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
}

export const QuickReplyBar: React.FC<QuickReplyBarProps> = ({
  replies,
  onSelect,
}) => {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {replies.map((reply) => (
        <button
          key={reply.intentKey}
          onClick={() => onSelect(reply)}
          className="px-3 py-1.5 text-xs bg-slate-800/60 text-slate-300 border border-slate-700/50 rounded-full hover:bg-violet-600/20 hover:text-violet-300 hover:border-violet-500/30 transition-colors cursor-pointer"
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
};
