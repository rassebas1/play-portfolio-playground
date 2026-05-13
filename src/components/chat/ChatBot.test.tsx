import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatBot } from './ChatBot';

vi.mock('framer-motion', () => ({
  motion: { div: 'div', button: 'button', span: 'span' },
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('react-i18next', () => {
  const tFn = (key: string) => key;
  return { useTranslation: () => ({ t: tFn, i18n: { language: 'en' } }) };
});

vi.mock('./engine/KnowledgeEngine', () => {
  class MockKE {
    matchIntent = vi.fn(() => ({
      intent: { key: 'greeting', priority: 10 },
      score: 1, matchedKeywords: ['hello'],
    }));
  }
  return { KnowledgeEngine: MockKE };
});

vi.mock('./engine/context', () => {
  class MockCT {
    getContext = vi.fn(() => ({ depth: 0, lastActivity: Date.now() }));
    update = vi.fn(); shouldEscalate = vi.fn(() => false); reset = vi.fn();
  }
  return { ContextTracker: MockCT };
});

vi.mock('./engine/responses', () => ({
  resolveResponse: vi.fn(() => 'Hello! How can I help you?'),
}));

vi.mock('./engine/quickReplies', () => ({
  generateQuickReplies: vi.fn(() => []),
}));

describe('ChatBot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders chat button when closed', () => {
    render(<ChatBot />);
    expect(screen.getByLabelText('Open chat')).toBeInTheDocument();
  });

  it('opens chat on button click', () => {
    render(<ChatBot />);
    fireEvent.click(screen.getByLabelText('Open chat'));
    expect(screen.getByText('intents.greeting.friend')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Assistant')).toBeInTheDocument();
  });

  it('renders open by default', () => {
    render(<ChatBot defaultOpen={true} />);
    expect(screen.getByText('Portfolio Assistant')).toBeInTheDocument();
  });

  it('shows Friend mode initially', () => {
    render(<ChatBot defaultOpen={true} />);
    expect(screen.getByText('Friend mode')).toBeInTheDocument();
  });

  it('closes chat on close', () => {
    render(<ChatBot defaultOpen={true} />);
    fireEvent.click(screen.getByLabelText('Close chat'));
    expect(screen.getByLabelText('Open chat')).toBeInTheDocument();
  });
});
