import { render, screen } from '@testing-library/react';
import { Shield, Lock } from 'lucide-react';
import { BadgeItem } from './BadgeItem';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: Record<string, unknown>) => (
      <div className={className as string} data-testid="badge-item" {...props}>{children}</div>
    ),
  },
}));

describe('BadgeItem', () => {
  const defaultProps = {
    title: 'Security Badge',
    description: 'Security description',
    icon: Shield,
    category: 'security' as const,
    index: 0,
  };

  it('renders title correctly', () => {
    render(<BadgeItem {...defaultProps} />);
    
    expect(screen.getByText('Security Badge')).toBeInTheDocument();
  });

  it('renders description correctly', () => {
    render(<BadgeItem {...defaultProps} />);
    
    expect(screen.getByText('Security description')).toBeInTheDocument();
  });

  it('renders with quality category', () => {
    render(<BadgeItem {...defaultProps} category="quality" icon={Lock} />);
    
    expect(screen.getByText('Security Badge')).toBeInTheDocument();
  });

  it('renders with tools category', () => {
    render(<BadgeItem {...defaultProps} category="tools" />);
    
    expect(screen.getByText('Security Badge')).toBeInTheDocument();
  });

  it('renders with different index', () => {
    render(<BadgeItem {...defaultProps} index={5} />);
    
    expect(screen.getByText('Security Badge')).toBeInTheDocument();
  });

  it('renders multiple badges in list', () => {
    const badges = [
      { ...defaultProps, title: 'Badge 1', index: 0 },
      { ...defaultProps, title: 'Badge 2', index: 1 },
    ];

    badges.forEach(badge => render(<BadgeItem {...badge} />));
    
    expect(screen.getAllByText(/Badge \d/)).toHaveLength(2);
  });
});