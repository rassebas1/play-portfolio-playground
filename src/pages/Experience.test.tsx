import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests/utils/render';
import Experience from './Experience';

describe('Experience', () => {
  it('renders experience heading', () => {
    render(<Experience />);
    expect(screen.getByText('experience_heading')).toBeInTheDocument();
  });

  it('renders company names', () => {
    render(<Experience />);
    expect(screen.getByText('Telefónica – NTT DATA')).toBeInTheDocument();
    expect(screen.getByText('Banco Popular – NTT DATA')).toBeInTheDocument();
  });

  it('renders translated job titles', () => {
    render(<Experience />);
    expect(screen.getByText('nttDataTelefonica.title')).toBeInTheDocument();
  });
});
