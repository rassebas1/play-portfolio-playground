import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, MessageCircle, X, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message, ChatBotProps } from './types';
import { findRelevantContext } from './portfolio-context';

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hey! I'm your portfolio assistant. Ask me anything about the work shown here.",
  sender: 'bot',
  timestamp: new Date()
};

export function ChatBot({
  defaultOpen = false,
  position = 'bottom-right',
  className = ''
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<((prompt: string, options: object) => Promise<{ generated_text: string }[]>) | null>(null);

  const positionClasses = position === 'bottom-right'
    ? 'bottom-6 right-6'
    : 'bottom-6 left-6';

  const initModel = useCallback(async () => {
    try {
      const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0');
      generatorRef.current = await pipeline('text-generation', 'Xenova/gpt2');
      setModelReady(true);
    } catch (error) {
      console.error('Model loading error:', error);
    }
  }, []);

  useEffect(() => {
    initModel();
  }, [initModel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // First, try to find a rule-based or keyword-based response
    const contextResponse = findRelevantContext(userMessage);
    
    // If context response is a direct answer (rule-based), return it
    if (contextResponse.includes('\n') || contextResponse.length < 100) {
      // Check if it's a short rule-based response
      const isShortAnswer = contextResponse.split('\n').length <= 3 && contextResponse.length < 150;
      if (isShortAnswer) {
        return contextResponse;
      }
    }

    // Use AI with portfolio context
    if (!generatorRef.current) {
      return "I'm still loading the AI model. Please wait a moment!";
    }

    try {
      setLoading(true);

      // Build prompt with portfolio context
      const relevantContext = findRelevantContext(userMessage);
      const prompt = `You are a helpful assistant for a developer's portfolio. Answer questions based on the following context:

${relevantContext}

User: ${userMessage}
Assistant:`;

      const result = await generatorRef.current(prompt, {
        max_new_tokens: 150,
        num_beams: 1,
        temperature: 0.7,
        repetition_penalty: 1.2,
        max_length: 300,
      });

      let generatedText = result[0].generated_text;
      generatedText = generatedText.replace(prompt, '').trim();

      // Clean up the response
      generatedText = generatedText
        .split('\n')[0] // Take only first sentence/line
        .replace(/^(User:|Assistant:|You:)/gi, '') // Remove any残留
        .trim();

      if (!generatedText || generatedText.length < 10) {
        return contextResponse; // Fall back to context
      }

      // If generated text is too similar to context, use context instead
      const similarity = generatedText.toLowerCase().split(' ').filter(word => 
        relevantContext.toLowerCase().includes(word)
      ).length / generatedText.split(' ').length;

      if (similarity > 0.8) {
        return contextResponse;
      }

      return generatedText;
    } catch (error) {
      console.error('Generation error:', error);
      return contextResponse; // Fall back to context on error
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || loading || !modelReady) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botResponse = await generateResponse(input);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

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
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 border-2 border-white/20"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </Button>
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
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Portfolio Assistant</h3>
                  <p className="text-xs text-slate-400">AI-powered help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Status indicator */}
            <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-700/30">
              {modelReady ? (
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-400">Ready</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">Running locally</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                  <span className="text-amber-400">Loading AI model...</span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-md'
                        : 'bg-slate-800/80 text-slate-100 border border-slate-700/50 rounded-bl-md'
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                    <span className={`text-[10px] mt-1.5 block opacity-60 ${
                      message.sender === 'user' ? 'text-violet-200' : 'text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
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
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-slate-900/80 backdrop-blur border-t border-slate-700/50"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={modelReady ? "Ask me anything..." : "Loading..."}
                  disabled={!modelReady || loading}
                  className="flex-1 bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Button
                  type="submit"
                  disabled={!modelReady || loading || !input.trim()}
                  size="icon"
                  className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 border-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatBot;
