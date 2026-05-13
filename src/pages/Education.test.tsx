import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/utils/render';
import Education from './Education';

vi.mock('framer-motion', () => ({
  motion: { div: 'div', h1: 'h1', p: 'p', span: 'span', li: 'li', ul: 'ul' },
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollYProgress: { get: vi.fn(), onChange: vi.fn() } }),
  useTransform: vi.fn(() => ({ get: vi.fn() })),
  useInView: vi.fn(() => [vi.fn(), true]),
}));

describe('Education', () => {
  it('renders education heading', () => {
    render(<Education />);
    expect(screen.getByText('education_heading')).toBeInTheDocument();
  });

  it('renders academic journey label', () => {
    render(<Education />);
    expect(screen.getByText('academic_journey')).toBeInTheDocument();
  });

  it('renders university names', () => {
    render(<Education />);
    expect(screen.getByText('Ramon Llull - La Salle University, Barcelona, Spain')).toBeInTheDocument();
    expect(screen.getByText('Central University, Bogotá, Colombia')).toBeInTheDocument();
  });
});
