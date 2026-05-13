import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickReplyBar } from './QuickReplyBar';

describe('QuickReplyBar', () => {
  const replies = [
    { intentKey: 'greet', label: 'Hello', priority: 1 },
    { intentKey: 'help', label: 'Help me', priority: 2 },
  ];

  it('renders quick reply buttons', () => {
    render(<QuickReplyBar replies={replies} onSelect={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Help me')).toBeInTheDocument();
  });

  it('calls onSelect when a reply is clicked', () => {
    const onSelect = vi.fn();
    render(<QuickReplyBar replies={replies} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Hello'));
    expect(onSelect).toHaveBeenCalledWith(replies[0]);
  });

  it('returns null when replies array is empty', () => {
    const { container } = render(<QuickReplyBar replies={[]} onSelect={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });
});
