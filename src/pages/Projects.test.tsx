import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from './Projects';

describe('Projects', () => {
  it('renders page title', () => {
    render(<MemoryRouter><Projects /></MemoryRouter>);
    expect(screen.getByText('projects_page_title')).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    render(<MemoryRouter><Projects /></MemoryRouter>);
    expect(screen.getByText('projects_category_all')).toBeInTheDocument();
  });
});
