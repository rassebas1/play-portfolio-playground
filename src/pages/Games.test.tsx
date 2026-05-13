import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Games from './Games';

describe('Games', () => {
  it('renders game zone heading', () => {
    render(<MemoryRouter><Games /></MemoryRouter>);
    expect(screen.getByText('game_zone_heading')).toBeInTheDocument();
  });

  it('renders all 9 game cards', () => {
    render(<MemoryRouter><Games /></MemoryRouter>);
    const playButtons = screen.getAllByText('button.play_game');
    expect(playButtons).toHaveLength(9);
  });
});
