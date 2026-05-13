import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toaster } from './toaster';

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toasts: [{ id: '1', title: 'Test Title', description: 'Test Desc', action: null }] }),
}));

vi.mock('@/components/ui/toast', () => ({
  ToastProvider: ({ children }: any) => <div data-testid="toast-provider">{children}</div>,
  Toast: ({ children }: any) => <div data-testid="toast">{children}</div>,
  ToastTitle: ({ children }: any) => <div data-testid="toast-title">{children}</div>,
  ToastDescription: ({ children }: any) => <div data-testid="toast-desc">{children}</div>,
  ToastClose: () => <button data-testid="toast-close">X</button>,
  ToastViewport: () => <div data-testid="toast-viewport" />,
}));

describe('Toaster', () => {
  it('renders with toast items', () => {
    const { container } = render(<Toaster />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders toast title and description', () => {
    render(<Toaster />);
    expect(screen.getByTestId('toast-title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('toast-desc')).toHaveTextContent('Test Desc');
  });

  it('renders close button for each toast', () => {
    render(<Toaster />);
    expect(screen.getByTestId('toast-close')).toBeInTheDocument();
  });
});
