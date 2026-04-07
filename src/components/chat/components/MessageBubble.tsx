import React from 'react';
import type { QuickReply } from '../types';
import { QuickReplyBar } from './QuickReplyBar';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    quickReplies?: QuickReply[];
  };
  onQuickReply?: (reply: QuickReply) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onQuickReply,
}) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[85%]">
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm ${
            isUser
              ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-md'
              : 'bg-slate-800/80 text-slate-100 border border-slate-700/50 rounded-bl-md'
          }`}
        >
          <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
          <span
            className={`text-[10px] mt-1.5 block opacity-60 ${
              isUser ? 'text-violet-200' : 'text-slate-500'
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        {!isUser && message.quickReplies && message.quickReplies.length > 0 && onQuickReply && (
          <QuickReplyBar replies={message.quickReplies} onSelect={onQuickReply} />
        )}
      </div>
    </div>
  );
};
