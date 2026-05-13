import { render, screen } from '@testing-library/react';
import { ProjectsCarousel } from './ProjectsCarousel';
import { vi } from 'vitest';

// Mock framer-motion before importing component
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: Record<string, unknown>) => (
      <div className={className as string} data-testid="carousel-header" {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock lucide-react icons - use forwardRef to avoid render issues
vi.mock('lucide-react', () => ({
  ChevronLeft: ({ 'data-testid': testId }: { 'data-testid'?: string }) => 
    <button data-testid={testId || 'chevron-left'}>Left</button>,
  ChevronRight: ({ 'data-testid': testId }: { 'data-testid'?: string }) => 
    <button data-testid={testId || 'chevron-right'}>Right</button>,
}));

// Mock ProjectSlide properly
vi.mock('./ProjectSlide', () => ({
  ProjectSlide: vi.fn(({ title, isActive }: { title: string; isActive: boolean }) => (
    <div data-testid={isActive ? 'active-project-slide' : 'hidden-project-slide'}>
      {title}
    </div>
  )),
}));

describe('ProjectsCarousel', () => {
  it('renders carousel header', () => {
    render(<ProjectsCarousel />);
    expect(screen.getByTestId('carousel-header')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<ProjectsCarousel />);
    expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
  });

  it('renders at least one project slide', () => {
    render(<ProjectsCarousel />);
    // Use queryByTestId to avoid error when none found
    expect(screen.queryByTestId('active-project-slide')).toBeInTheDocument();
  });
});