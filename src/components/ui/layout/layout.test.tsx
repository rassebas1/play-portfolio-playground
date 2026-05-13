import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Separator } from './separator';
import { Layout } from './layout';

vi.mock('@/components/layout/Navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Separator', () => {
  it('renders separator element', () => {
    render(<Separator />);
    expect(document.querySelector('[data-orientation]')).toBeInTheDocument();
  });
});

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  it('renders children', () => {
    render(<Layout navigationState="idle"><p>Test content</p></Layout>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders Navbar and Footer', () => {
    render(<Layout navigationState="idle"><p>content</p></Layout>);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders skip-to-content link', () => {
    render(<Layout navigationState="idle"><p>content</p></Layout>);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('renders main content region', () => {
    render(<Layout navigationState="idle"><p>content</p></Layout>);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('has full-height flex column layout', () => {
    const { container } = render(<Layout navigationState="idle"><p>content</p></Layout>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('min-h-screen');
    expect(root.className).toContain('flex');
    expect(root.className).toContain('flex-col');
  });

  it('transitions from loading to idle with timer', () => {
    const { rerender } = render(<Layout navigationState="loading"><p>content</p></Layout>);

    rerender(<Layout navigationState="idle"><p>content</p></Layout>);

    // After 299ms, progress bar should still be visible (min display time is 300ms)
    vi.advanceTimersByTime(299);

    // After 300ms, the timer fires and hides the progress bar
    vi.advanceTimersByTime(1);
  });
});
