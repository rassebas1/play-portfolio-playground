import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

const mockChangeLanguage = vi.fn();
// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
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
    { id: 'snake', name: 'Snake', icon: '🐍', status: 'Ready to Play' },
    { id: '2048', name: '2048', icon: '🔢', status: 'Ready to Play' },
    { id: 'flappy-bird', name: 'Flappy Bird', icon: '🐦', status: 'In Progress' },
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

  it('renders Games dropdown for desktop and shows playable games', async () => {
    const { user } = renderWithRouter(<Navbar />);

    const gamesDropdownTrigger = screen.getByRole('button', { name: 'Games' });
    await user.click(gamesDropdownTrigger);

    const menu = await screen.findByRole('menu');

    expect(within(menu).getByText(/🐍\s*Snake/)).toBeInTheDocument();
    expect(within(menu).getByText(/🔢\s*2048/)).toBeInTheDocument();
    expect(within(menu).queryByText(/🐦\s*Flappy Bird/)).not.toBeInTheDocument();
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
    expect(within(mobileMenu).getByText('🐍 Snake')).toBeVisible();
    expect(within(mobileMenu).queryByText('🐦 Flappy Bird')).not.toBeInTheDocument();
  });

  it('renders ThemeSwitcher', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
  });
});
