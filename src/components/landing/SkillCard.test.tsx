import { render, screen } from '@testing-library/react';
import { SkillCard } from './SkillCard';
import { Code } from 'lucide-react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: Record<string, unknown>) => (
      <div className={className as string} {...props}>{children}</div>
    ),
  },
}));

describe('SkillCard', () => {
  const defaultProps = {
    title: 'Frontend Development',
    description: 'Building responsive web applications',
    icon: Code,
    skills: ['React', 'TypeScript', 'Tailwind'],
    index: 0,
  };

  it('renders title correctly', () => {
    render(<SkillCard {...defaultProps} />);
    
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
  });

  it('renders description correctly', () => {
    render(<SkillCard {...defaultProps} />);
    
    expect(screen.getByText('Building responsive web applications')).toBeInTheDocument();
  });

  it('renders all skill tags', () => {
    render(<SkillCard {...defaultProps} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind')).toBeInTheDocument();
  });

  it('renders with different index', () => {
    render(<SkillCard {...defaultProps} index={5} />);
    
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
  });

  it('renders with empty skills array', () => {
    render(<SkillCard {...defaultProps} skills={[]} />);
    
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
  });

  it('renders with single skill', () => {
    render(<SkillCard {...defaultProps} skills={['JavaScript']} />);
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SkillCard {...defaultProps} className="custom-class" />
    );
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});