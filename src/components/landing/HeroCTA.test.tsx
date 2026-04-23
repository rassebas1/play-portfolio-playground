import { render, screen } from '@testing-library/react';
import { HeroCTA } from './HeroCTA';
import { BrowserRouter } from 'react-router-dom';

// Mock framer-motion - only add test ID to first-level elements
vi.mock('framer-motion', () => {
  let isRoot = true;
  return {
    motion: {
      div: ({ children, className, ...props }: Record<string, unknown>) => {
        const testId = isRoot ? 'hero-cta' : undefined;
        isRoot = false;
        return <div className={className as string} data-testid={testId} {...props}>{children}</div>;
      },
      button: ({ children, className, ...props }: Record<string, unknown>) => (
        <button className={className as string} {...props}>{children}</button>
      ),
      a: ({ children, className, ...props }: Record<string, unknown>) => (
        <a className={className as string} {...props}>{children}</a>
      ),
    },
  };
});

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Github: () => <svg data-testid="github-icon" />,
  Linkedin: () => <svg data-testid="linkedin-icon" />,
  Gamepad2: () => <svg data-testid="gamepad-icon" />,
  ArrowDown: () => <svg data-testid="arrow-icon" />,
  FileDown: () => <svg data-testid="download-icon" />,
  MessageCircle: () => <svg data-testid="chat-icon" />,
}));

// Mock react-router-dom Link and BrowserRouter
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid="router-link">{children}</a>
  ),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
}));

describe('HeroCTA', () => {
  it('renders the component', () => {
    render(
      <BrowserRouter>
        <HeroCTA />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('hero-cta')).toBeInTheDocument();
  });

  it('renders download CV button', () => {
    render(
      <BrowserRouter>
        <HeroCTA />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('download-icon')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(
      <BrowserRouter>
        <HeroCTA />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
  });

  it('renders chat icon', () => {
    render(
      <BrowserRouter>
        <HeroCTA />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('chat-icon')).toBeInTheDocument();
  });
});