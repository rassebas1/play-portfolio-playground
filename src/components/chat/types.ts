export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatBotProps {
  defaultOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export type ChatPosition = 'bottom-right' | 'bottom-left';
