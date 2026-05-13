import { render, screen } from '@testing-library/react';
import { SeniorityBadges } from './SeniorityBadges';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: Record<string, unknown>) => (
      <div className={className as string} data-testid="motion-div" {...props}>{children}</div>
    ),
  },
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Shield: () => <svg data-testid="shield-icon" />,
  Lock: () => <svg data-testid="lock-icon" />,
  CheckCircle: () => <svg data-testid="check-icon" />,
  Beaker: () => <svg data-testid="beaker-icon" />,
  FlaskConical: () => <svg data-testid="flask-icon" />,
  Palette: () => <svg data-testid="palette-icon" />,
  Clipboard: () => <svg data-testid="clipboard-icon" />,
  Zap: () => <svg data-testid="zap-icon" />,
  GitBranch: () => <svg data-testid="git-icon" />,
}));

describe('SeniorityBadges', () => {
  it('renders the component', () => {
    render(<SeniorityBadges />);
    expect(screen.getByText('badges_title')).toBeInTheDocument();
  });

  it('renders all 9 badge icons', () => {
    render(<SeniorityBadges />);
    
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.getByTestId('beaker-icon')).toBeInTheDocument();
    expect(screen.getByTestId('flask-icon')).toBeInTheDocument();
    expect(screen.getByTestId('palette-icon')).toBeInTheDocument();
    expect(screen.getByTestId('clipboard-icon')).toBeInTheDocument();
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    expect(screen.getByTestId('git-icon')).toBeInTheDocument();
  });

  it('renders with grid layout', () => {
    const { container } = render(<SeniorityBadges />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(<SeniorityBadges />);
    expect(screen.getByText('badges_title')).toBeInTheDocument();
    expect(screen.getByText('badges_subtitle')).toBeInTheDocument();
  });
});