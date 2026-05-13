import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GamePage from './GamePage';

vi.mock('@/games', () => ({
  GAME_REGISTRY: {
    tetris: {
      component: () => <div>Tetris Game</div>,
      difficulty: 'Medium', category: 'Puzzle', icon: '🎮', color: 'blue',
    },
  },
  getAllGameIds: () => ['tetris', 'snake', '2048'],
  getGameEntry: (id: string) => id === 'tetris' ? { component: () => <div>Tetris Game</div>, difficulty: 'Medium', category: 'Puzzle', icon: '🎮', color: 'blue' } : undefined,
}));
vi.mock('@/hooks/use-title', () => ({ default: vi.fn() }));
vi.mock('@/hooks/useAnalytics', () => ({ useAnalytics: () => ({ trackGameStart: vi.fn(), trackGameEnd: vi.fn() }) }));

describe('GamePage', () => {
  it('redirects to home for invalid game id', () => {
    render(
      <MemoryRouter initialEntries={['/game/invalid-game']}>
        <Routes>
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders game component for valid game id', () => {
    render(
      <MemoryRouter initialEntries={['/game/tetris']}>
        <Routes>
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Tetris Game')).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(
      <MemoryRouter initialEntries={['/game/tetris']}>
        <Routes>
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Go back/)).toBeInTheDocument();
  });
});
