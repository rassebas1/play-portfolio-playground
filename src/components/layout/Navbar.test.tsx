import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

const mockChangeLanguage = vi.fn();
// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const translations: Record<string, string> = {
        'Home': 'Home',
        'Experience': 'Experience',
        'Education': 'Education',
        'Games': 'Games',
        'portfolio': 'Portfolio',
        'change_language_aria_label': 'Change language',
        'toggle_menu_aria_label': 'Toggle Menu',
        'mobile_navigation_aria_label': 'Mobile Navigation',
        'language.english': 'English',
        'language.spanish': 'Español',
        'language.french': 'Français',
        'language.italian': 'Italiano',
        'ticTacToe.name': 'Tic Tac Toe',
        'game2048.name': '2048',
        'flappyBird.name': 'Flappy Bird',
        'snake.name': 'Snake',
        'memoryGame.name': 'Memory Game',
        'brickBreaker.name': 'Brick Breaker',
        'status.ready_to_play': 'Ready to Play',
        'status.in_progress': 'In Progress',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: mockChangeLanguage,
      language: 'en',
    },
  }),
}));

// Mock games list
vi.mock('@/pages/Games', () => ({
  games: [
    { id: 'snake', name: 'snake.name', icon: '🐍', status: 'status.ready_to_play' },
    { id: '2048', name: 'game2048.name', icon: '🔢', status: 'status.ready_to_play' },
    { id: 'flappy-bird', name: 'flappyBird.name', icon: '🐦', status: 'status.in_progress' },
  ],
}));

// Mock ThemeSwitcher (assuming it's a component without complex internal logic for this test)
vi.mock('@/components/ui/theme-switcher', () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">Theme Switcher Mock</div>,
}));

// Helper to render with MemoryRouter
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: MemoryRouter }),
  };
};


describe('Navbar', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
  });

  it('renders desktop navigation links', () => {
    renderWithRouter(<Navbar />);
    
    const desktopNav = screen.getByLabelText('Desktop navigation');

    expect(within(desktopNav).getByText('Home')).toBeInTheDocument();
    expect(within(desktopNav).getByText('Experience')).toBeInTheDocument();
    expect(within(desktopNav).getByText('Education')).toBeInTheDocument();
  });

  it('renders Games link with dropdown structure', () => {
    renderWithRouter(<Navbar />);
    
    const gamesLink = screen.getByRole('link', { name: 'Games' });
    expect(gamesLink).toBeInTheDocument();
    expect(gamesLink).toHaveAttribute('href', '/games');
  });

  it('changes language when a language option is clicked', async () => {
    const { user } = renderWithRouter(<Navbar />);

    const languageDropdownTrigger = screen.getByRole('button', { name: 'Change language' });
    await user.click(languageDropdownTrigger);

    const spanishOption = await screen.findByText('Español');
    await user.click(spanishOption);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });


  // Test mobile navigation
  it('renders mobile menu trigger', () => {
    // Simulate mobile display
    renderWithRouter(<Navbar />);
    const mobileMenuButton = screen.getByRole('button', { name: 'Toggle Menu' });
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('opens mobile navigation when trigger is clicked', async () => {
    const { user } = renderWithRouter(<Navbar />);
    const mobileMenuButton = screen.getByRole('button', { name: 'Toggle Menu' });
    await user.click(mobileMenuButton);

    const mobileMenu = await screen.findByRole('dialog');

    expect(within(mobileMenu).getByText('Home')).toBeVisible();
    expect(within(mobileMenu).getByText('Experience')).toBeVisible();
    expect(within(mobileMenu).getByText('Education')).toBeVisible();
    expect(within(mobileMenu).getByText('Games')).toBeVisible();
    expect(within(mobileMenu).getByText(/Snake/)).toBeVisible();
    expect(within(mobileMenu).queryByText(/Flappy/)).not.toBeInTheDocument();
  });

  it('renders ThemeSwitcher', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
  });
});
