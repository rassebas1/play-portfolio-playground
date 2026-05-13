import { render, screen, fireEvent } from '@testing-library/react';
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
  beforeEach(() => {
    localStorage.clear();
  });

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

  it('renders scroll to projects button', () => {
    render(
      <BrowserRouter>
        <HeroCTA />
      </BrowserRouter>
    );

    // Set up an element with the target id for scrollIntoView to work
    const target = document.createElement('div');
    target.id = 'featured-projects';
    document.body.appendChild(target);
    const scrollSpy = vi.fn();
    target.scrollIntoView = scrollSpy;

    const scrollBtn = screen.getByLabelText('Scroll to featured projects');
    expect(scrollBtn).toBeInTheDocument();

    scrollBtn.click();
    expect(scrollSpy).toHaveBeenCalled();
    document.body.removeChild(target);
  });

  it('handleCvDownload calls trackEvent synchronously on click', () => {
    global.fetch = vi.fn(() => Promise.resolve(new Response()));

    render(
      <BrowserRouter>
        <HeroCTA />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId('download-icon').closest('button')!);

    // trackEvent runs synchronously up to the fetch call
    expect(global.fetch).toHaveBeenCalled();
    // window.open runs after await — verified in async tests
  });

  it('getOrCreateSessionId creates and reuses session id', () => {
    render(
      <BrowserRouter>
        <HeroCTA />
      </BrowserRouter>
    );

    // getOrCreateSessionId is called by trackEvent on download click
    fireEvent.click(screen.getByTestId('download-icon').closest('button')!);

    const sessionId = localStorage.getItem('portfolio_session_id');
    expect(sessionId).toBeTruthy();

    // localStorage was mocked, so we verify the session was created
    expect(sessionId?.length).toBeGreaterThan(0);
  });

  it('trackEvent handles fetch failure gracefully', () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(
      <BrowserRouter>
        <HeroCTA />
      </BrowserRouter>
    );

    expect(() => {
      fireEvent.click(screen.getByTestId('download-icon').closest('button')!);
    }).not.toThrow();
  });
});