import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Message, QuickReply, Personality } from './types';
import { KnowledgeEngine } from './engine/KnowledgeEngine';
import { ContextTracker } from './engine/context';
import { resolveResponse } from './engine/responses';
import { generateQuickReplies } from './engine/quickReplies';
import { ChatHeader } from './components/ChatHeader';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import type { ChatBotProps } from './types';

const PERSONALITY_STORAGE_KEY = 'chatbot-personality';

function getInitialPersonality(): Personality {
  try {
    const stored = localStorage.getItem(PERSONALITY_STORAGE_KEY);
    if (stored === 'manager' || stored === 'friend') return stored;
  } catch {
    // localStorage not available
  }
  return 'friend';
}

function createInitialMessage(t: (key: string) => string): Message {
  return {
    id: '1',
    text: t('intents.greeting.friend'),
    sender: 'bot',
    timestamp: new Date(),
    quickReplies: [
      { label: t('quickReplies.about_me'), intentKey: 'about_me' },
      { label: t('quickReplies.experience'), intentKey: 'experience' },
      { label: t('quickReplies.projects'), intentKey: 'projects' },
      { label: t('quickReplies.games'), intentKey: 'games' },
    ],
  };
}

const engine = new KnowledgeEngine();
const tracker = new ContextTracker();

export function ChatBot({
  defaultOpen = false,
  position = 'bottom-right',
  className = '',
}: ChatBotProps) {
  const { t } = useTranslation('chatbot');
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [personality, setPersonality] = useState<Personality>(getInitialPersonality);
  const [messages, setMessages] = useState<Message[]>(() => [createInitialMessage(t)]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Re-initialize messages when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [createInitialMessage(t)];
      }
      return prev;
    });
  }, [t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleProcessMessage = useCallback(
    async (text: string, isQuickReply = false) => {
      if (!text.trim() || loading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        text: isQuickReply ? t(`quickReplies.${text}`) : text,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setLoading(true);

      // Small delay for UX feel
      await new Promise((r) => setTimeout(r, 300));

      const context = tracker.getContext();
      const match = engine.matchIntent(text, context);

      // Update conversation context
      if (match.intent.key !== 'fallback') {
        tracker.update(match.intent.key, match.params);
      } else {
        tracker.update('fallback');
      }

      // Escalate after consecutive fallbacks
      let responseText = resolveResponse(match, personality, t);
      if (tracker.shouldEscalate()) {
        responseText = t('fallback.escalation');
        tracker.reset();
      }

      // Generate quick replies
      const quickReplies = generateQuickReplies(match, t);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        intent: match.intent.key,
        quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    },
    [loading, personality, t],
  );

  const handleQuickReply = useCallback(
    (reply: QuickReply) => {
      handleProcessMessage(reply.intentKey, true);
    },
    [handleProcessMessage],
  );

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      await handleProcessMessage(input);
    },
    [input, handleProcessMessage],
  );

  const handleTogglePersonality = useCallback(() => {
    setPersonality((prev) => {
      const next = prev === 'friend' ? 'manager' : 'friend';
      try {
        localStorage.setItem(PERSONALITY_STORAGE_KEY, next);
      } catch {
        // localStorage not available
      }
      return next;
    });
  }, []);

  const positionClasses =
    position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6';

  return (
    <div className={`fixed ${positionClasses} z-50 ${className}`}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 border-2 border-white/20 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Open chat"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-[380px] h-[520px] max-w-[calc(100vw-3rem)] flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 rounded-2xl shadow-2xl shadow-violet-500/10 border border-slate-700/50 overflow-hidden"
          >
            {/* Header with personality toggle */}
            <ChatHeader
              onClose={() => setIsOpen(false)}
              personality={personality}
              onTogglePersonality={handleTogglePersonality}
            />

            {/* Status indicator */}
            <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-700/30">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-400">{t('status.ready')}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{t('status.running_locally')}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <MessageBubble
                    message={message}
                    onQuickReply={handleQuickReply}
                  />
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <div
                        className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSendMessage}
              disabled={false}
              loading={loading}
              placeholder={t('input.placeholder')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatBot;
