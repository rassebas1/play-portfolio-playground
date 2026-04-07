export type Personality = 'friend' | 'manager';
export type ChatPosition = 'bottom-right' | 'bottom-left';
export type MessageSender = 'user' | 'bot';

export interface QuickReply {
  label: string;
  intentKey: string;
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  intent?: string;
  quickReplies?: QuickReply[];
}

export interface KeywordPattern {
  word: string;
  weight: number;
}

export interface Intent {
  key: string;
  keywords: KeywordPattern[];
  regex?: RegExp[];
  priority: number;
  requiresContext?: boolean;
  contextKey?: string;
  relatedIntents?: string[];
}

export interface IntentMatch {
  intent: Intent;
  score: number;
  matchedKeywords: string[];
  params?: Record<string, string>;
}

export interface ConversationContext {
  lastIntent?: string;
  lastParams?: Record<string, string>;
  depth: number;
  lastActivity: number;
  consecutiveFallbacks?: number;
}

export interface ChatState {
  messages: Message[];
  personality: Personality;
  context: ConversationContext;
  isLoading: boolean;
  isReady: boolean;
}

export interface ChatBotProps {
  defaultOpen?: boolean;
  position?: ChatPosition;
  className?: string;
}
