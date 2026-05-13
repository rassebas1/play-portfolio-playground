import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  it('renders main heading', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText('main_heading')).toBeInTheDocument();
  });

  it('renders hero tagline', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText('hero_tagline')).toBeInTheDocument();
  });
});
