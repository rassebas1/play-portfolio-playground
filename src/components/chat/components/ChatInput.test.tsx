import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    disabled: false,
    loading: false,
    placeholder: 'Type a message...',
  };

  it('renders input with placeholder', () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<ChatInput {...defaultProps} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('Type a message...'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onSubmit on form submit', () => {
    const onSubmit = vi.fn();
    render(<ChatInput {...defaultProps} onSubmit={onSubmit} value="hello" />);
    fireEvent.submit(screen.getByRole('button', { name: /send/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when Enter is pressed', () => {
    const onSubmit = vi.fn();
    render(<ChatInput {...defaultProps} onSubmit={onSubmit} value="hello" />);
    fireEvent.keyDown(screen.getByPlaceholderText('Type a message...'), { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not submit on Shift+Enter', () => {
    const onSubmit = vi.fn();
    render(<ChatInput {...defaultProps} onSubmit={onSubmit} value="hello" />);
    fireEvent.keyDown(screen.getByPlaceholderText('Type a message...'), { key: 'Enter', shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables input and button when disabled', () => {
    render(<ChatInput {...defaultProps} disabled={true} />);
    expect(screen.getByPlaceholderText('Type a message...')).toBeDisabled();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<ChatInput {...defaultProps} loading={true} />);
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    const { container } = render(<ChatInput {...defaultProps} loading={true} />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
