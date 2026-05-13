import { render, screen } from '@testing-library/react';
import { ProjectSlide } from './ProjectSlide';
import { vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: Record<string, unknown>) => (
      <div className={className as string} data-testid="project-slide" {...props}>{children}</div>
    ),
  },
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
  Trophy: () => <span data-testid="trophy-icon" />,
  ArrowRight: () => <span data-testid="arrow-right-icon" />,
}));

// Mock react-router-dom Link
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid="router-link">{children}</a>
  ),
}));

describe('ProjectSlide', () => {
  const defaultProps = {
    company: 'Test Company',
    title: 'Test Title',
    description: 'Test description text',
    period: '2024',
    technologies: ['React', 'TypeScript'],
    achievement: 'Test achievement',
    category: 'personal' as const,
    isActive: true,
  };

  it('renders project slide', () => {
    render(<ProjectSlide {...defaultProps} />);
    expect(screen.getByTestId('project-slide')).toBeInTheDocument();
  });

  it('renders company name', () => {
    render(<ProjectSlide {...defaultProps} />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<ProjectSlide {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<ProjectSlide {...defaultProps} />);
    expect(screen.getByText('Test description text')).toBeInTheDocument();
  });

  it('renders technologies', () => {
    render(<ProjectSlide {...defaultProps} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders achievement when provided', () => {
    render(<ProjectSlide {...defaultProps} />);
    expect(screen.getByTestId('trophy-icon')).toBeInTheDocument();
  });

  it('renders link to projects page', () => {
    render(<ProjectSlide {...defaultProps} />);
    expect(screen.getByTestId('router-link')).toBeInTheDocument();
  });

  it('renders without achievement', () => {
    const propsWithoutAchievement = { ...defaultProps, achievement: undefined };
    render(<ProjectSlide {...propsWithoutAchievement} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});