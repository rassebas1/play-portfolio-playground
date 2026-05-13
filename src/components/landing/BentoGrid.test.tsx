import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests/utils/render';
import { BentoGrid } from './BentoGrid';

describe('BentoGrid', () => {
  it('renders skills section heading', () => {
    render(<BentoGrid />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('renders skill category titles', () => {
    render(<BentoGrid />);
    expect(screen.getByText('skills_bento_frontend_title')).toBeInTheDocument();
    expect(screen.getByText('skills_bento_backend_title')).toBeInTheDocument();
  });
});
