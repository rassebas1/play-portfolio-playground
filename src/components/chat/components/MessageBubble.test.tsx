import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageBubble } from './MessageBubble';

describe('MessageBubble', () => {
  const userMessage = {
    id: '1',
    text: 'Hello!',
    sender: 'user' as const,
    timestamp: new Date('2024-01-01T12:00:00'),
  };

  const botMessage = {
    id: '2',
    text: 'Hi there!',
    sender: 'bot' as const,
    timestamp: new Date('2024-01-01T12:00:05'),
  };

  it('renders user message text', () => {
    render(<MessageBubble message={userMessage} />);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('renders bot message text', () => {
    render(<MessageBubble message={botMessage} />);
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('aligns user messages to the right', () => {
    const { container } = render(<MessageBubble message={userMessage} />);
    expect(container.querySelector('.justify-end')).toBeInTheDocument();
  });

  it('aligns bot messages to the left', () => {
    const { container } = render(<MessageBubble message={botMessage} />);
    expect(container.querySelector('.justify-start')).toBeInTheDocument();
  });

  it('does not render QuickReplyBar for user messages', () => {
    render(<MessageBubble message={userMessage} />);
    expect(screen.queryByText('Hello!')).toBeInTheDocument();
  });
});
