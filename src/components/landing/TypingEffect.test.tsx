import { render } from '@testing-library/react';
import { TypingEffect } from './TypingEffect';

// Mock completo para evitar dependencias externas
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: Record<string, unknown>) => (
      <div className={className as string} data-testid="typing-container" {...props}>{children}</div>
    ),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TypingEffect', () => {
  it('renders the component container', () => {
    const { getByTestId } = render(<TypingEffect roles={['Developer']} />);
    
    expect(getByTestId('typing-container')).toBeInTheDocument();
  });

  it('renders with multiple roles', () => {
    const { getByTestId } = render(<TypingEffect roles={['Developer', 'Engineer']} />);
    
    expect(getByTestId('typing-container')).toBeInTheDocument();
  });

  it('renders with empty roles array', () => {
    const { getByTestId } = render(<TypingEffect roles={[]} />);
    
    expect(getByTestId('typing-container')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <TypingEffect roles={['Developer']} className="custom-class" />
    );
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});