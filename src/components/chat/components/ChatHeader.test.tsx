import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatHeader } from './ChatHeader';

describe('ChatHeader', () => {
  it('renders assistant name', () => {
    render(<ChatHeader onClose={vi.fn()} personality="friend" onTogglePersonality={vi.fn()} />);
    expect(screen.getByText('Portfolio Assistant')).toBeInTheDocument();
  });

  it('shows Friend mode when personality is friend', () => {
    render(<ChatHeader onClose={vi.fn()} personality="friend" onTogglePersonality={vi.fn()} />);
    expect(screen.getByText('Friend mode')).toBeInTheDocument();
  });

  it('shows Manager mode when personality is manager', () => {
    render(<ChatHeader onClose={vi.fn()} personality="manager" onTogglePersonality={vi.fn()} />);
    expect(screen.getByText('Manager mode')).toBeInTheDocument();
  });

  it('calls onTogglePersonality when personality button is clicked', () => {
    const onToggle = vi.fn();
    render(<ChatHeader onClose={vi.fn()} personality="friend" onTogglePersonality={onToggle} />);
    fireEvent.click(screen.getByLabelText(/switch to/i));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ChatHeader onClose={onClose} personality="friend" onTogglePersonality={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Close chat'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
