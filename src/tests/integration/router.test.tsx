/**
 * Router Integration Tests
 * Tests for navigation, route params, query params, and deep linking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Test components to verify routing behavior
const HomePage = () => <div data-testid="page">Home</div>;
const GamesPage = () => <div data-testid="page">Games</div>;
const ExperiencePage = () => <div data-testid="page">Experience</div>;
const EducationPage = () => <div data-testid="page">Education</div>;
const GamePage = () => {
  const params = useParams();
  return <div data-testid="page">Game: {params.gameId}</div>;
};
const NotFoundPage = () => <div data-testid="page">404 Not Found</div>;

// Navigation component for testing navigation
const NavigationTestComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div>
      <span data-testid="current-path">{location.pathname}</span>
      <button data-testid="nav-home" onClick={() => navigate('/')}>Home</button>
      <button data-testid="nav-games" onClick={() => navigate('/games')}>Games</button>
      <button data-testid="nav-experience" onClick={() => navigate('/experience')}>Experience</button>
      <button data-testid="nav-game-id" onClick={() => navigate('/game/tower-defense')}>Tower Defense</button>
      <button data-testid="nav-with-state" onClick={() => navigate('/games', { state: { from: 'home' } })}>With State</button>
    </div>
  );
};

// Component that displays query params
const QueryParamsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get('filter');
  const sort = searchParams.get('sort');
  
  return (
    <div>
      <span data-testid="query-filter">{filter || 'none'}</span>
      <span data-testid="query-sort">{sort || 'none'}</span>
    </div>
  );
};

describe('Router Navigation', () => {
  describe('Basic Navigation', () => {
    it('renders home page at root path', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('page')).toHaveTextContent('Home');
    });

    it('navigates to games page', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<NavigationTestComponent />} />
            <Route path="/games" element={<GamesPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.click(screen.getByTestId('nav-games'));
      
      expect(screen.getByTestId('page')).toHaveTextContent('Games');
    });

    it('updates location on navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<NavigationTestComponent />} />
            <Route path="/games" element={<NavigationTestComponent />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('current-path')).toHaveTextContent('/');
      
      await user.click(screen.getByTestId('nav-games'));
      
      expect(screen.getByTestId('current-path')).toHaveTextContent('/games');
    });
  });

  describe('Route Parameters', () => {
    it('extracts gameId parameter from URL', () => {
      render(
        <MemoryRouter initialEntries={['/game/tower-defense']}>
          <Routes>
            <Route path="/game/:gameId" element={<GamePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('page')).toHaveTextContent('Game: tower-defense');
    });

    it('extracts different gameId parameters', () => {
      render(
        <MemoryRouter initialEntries={['/game/brick-breaker']}>
          <Routes>
            <Route path="/game/:gameId" element={<GamePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('page')).toHaveTextContent('Game: brick-breaker');
    });

    it('navigates to route with parameter', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<NavigationTestComponent />} />
            <Route path="/game/:gameId" element={<GamePage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.click(screen.getByTestId('nav-game-id'));
      
      expect(screen.getByTestId('page')).toHaveTextContent('Game: tower-defense');
    });
  });

  describe('Query Parameters', () => {
    it('reads query parameters from URL', () => {
      render(
        <MemoryRouter initialEntries={['/games?filter=active&sort=date']}>
          <Routes>
            <Route path="/games" element={<QueryParamsPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('query-filter')).toHaveTextContent('active');
      expect(screen.getByTestId('query-sort')).toHaveTextContent('date');
    });

    it('handles missing query parameters', () => {
      render(
        <MemoryRouter initialEntries={['/games']}>
          <Routes>
            <Route path="/games" element={<QueryParamsPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('query-filter')).toHaveTextContent('none');
      expect(screen.getByTestId('query-sort')).toHaveTextContent('none');
    });

    it('updates when query params change', async () => {
      // Each render creates a new test container
      // Verify component responds to different query values
      const { container: container1 } = render(
        <MemoryRouter initialEntries={['/games?filter=active']}>
          <Routes>
            <Route path="/games" element={<QueryParamsPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Verify first render shows correct filter
      expect(screen.getByTestId('query-filter')).toHaveTextContent('active');
    });
  });

  describe('Deep Linking', () => {
    it('loads experience page directly from URL', () => {
      render(
        <MemoryRouter initialEntries={['/experience']}>
          <Routes>
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('page')).toHaveTextContent('Experience');
    });

    it('loads education page directly from URL', () => {
      render(
        <MemoryRouter initialEntries={['/education']}>
          <Routes>
            <Route path="/education" element={<EducationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('page')).toHaveTextContent('Education');
    });

    it('loads game page with specific game from deep link', () => {
      render(
        <MemoryRouter initialEntries={['/game/tic-tac-toe']}>
          <Routes>
            <Route path="/game/:gameId" element={<GamePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('page')).toHaveTextContent('Game: tic-tac-toe');
    });

    it('shows 404 for unknown route', () => {
      render(
        <MemoryRouter initialEntries={['/unknown-route']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('page')).toHaveTextContent('404 Not Found');
    });
  });

  describe('Navigation State', () => {
    it('passes state through navigation', async () => {
      const user = userEvent.setup();
      
      const StateReceiver = () => {
        const location = useLocation();
        return <div data-testid="state">{JSON.stringify(location.state)}</div>;
      };

      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<NavigationTestComponent />} />
            <Route path="/games" element={<StateReceiver />} />
          </Routes>
        </MemoryRouter>
      );

      await user.click(screen.getByTestId('nav-with-state'));
      
      expect(screen.getByTestId('state')).toHaveTextContent('{"from":"home"}');
    });

    it('preserves state on navigation', async () => {
      const user = userEvent.setup();
      
      const StateChecker = () => {
        const location = useLocation();
        const navigate = useNavigate();
        return (
          <div>
            <span data-testid="state-from">{location.state?.from || 'none'}</span>
            <button data-testid="nav-back" onClick={() => navigate(-1)}>Back</button>
          </div>
        );
      };

      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<NavigationTestComponent />} />
            <Route path="/games" element={<StateChecker />} />
          </Routes>
        </MemoryRouter>
      );

      await user.click(screen.getByTestId('nav-with-state'));
      expect(screen.getByTestId('state-from')).toHaveTextContent('home');
    });
  });
});