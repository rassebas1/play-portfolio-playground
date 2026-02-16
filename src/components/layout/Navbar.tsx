import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { games } from '@/pages/Games'; // Import games list for dynamic navigation
import { useTranslation } from 'react-i18next';

/**
 * Defines the main navigation items for the application.
 * Each item has a display name and a corresponding route path.
 */
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Experience', href: '/experience' },
  { name: 'Education', href: '/education' },
];

/**
 * Navbar component.
 * Provides a responsive navigation bar for the application, including:
 * - Desktop navigation links and a games dropdown.
 * - Mobile navigation via a sheet (sidebar).
 * - Theme switching functionality.
 * - Language selection dropdown.
 *
 * @returns {JSX.Element} The rendered navigation bar.
 */
export const Navbar: React.FC = () => {
  // `useTranslation` hook for internationalization, providing translation function `t` and i18n instance.
  const { t, i18n } = useTranslation('common');

  /**
   * Changes the application's language using i18next.
   * @param {string} lng - The language code (e.g., 'en', 'es', 'fr').
   * @returns {void}
   */
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          {/* Desktop Navigation */}
          <nav aria-label="Desktop navigation" className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Portfolio Logo/Brand Link */}
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold inline-block">{t('portfolio')}</span>
            </Link>
            {/* Main Navigation Links */}
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                }
              >
                {t(item.name)} {/* Translated navigation item name */}
              </NavLink>
            ))}

            {/* Games Dropdown for Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium transition-colors hover:text-primary data-[state=open]:text-primary"
                >
                  {t('Games')} {/* Translated "Games" label */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" forceMount>
                {/* Filter and map through games that are "Ready to Play" */}
                {games.filter(game => game.status === 'Ready to Play').map((game) => (
                  <DropdownMenuItem key={game.id} asChild>
                    <Link to={`/game/${game.id}`}>
                      {game.icon} {game.name} {/* Game icon and name */}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Navigation (Sheet/Sidebar) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden" // Only visible on mobile
              >
                <Menu className="h-6 w-6" /> {/* Hamburger menu icon */}
                <span className="sr-only">{t('toggle_menu_aria_label')}</span> {/* Hamburger menu icon */} {/* Screen reader text */}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">{t('mobile_navigation_aria_label')}</SheetTitle>
              <nav className="flex flex-col gap-4 pt-6">
                {/* Portfolio Logo/Brand Link for Mobile */}
                <Link to="/" className="mb-4 flex items-center space-x-2">
                  <span className="font-bold">{t('portfolio')}</span>
                </Link>
                {/* Main Navigation Links for Mobile */}
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `text-lg font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-foreground'}`
                    }
                  >
                    {t(item.name)} {/* Translated navigation item name */}
                  </NavLink>
                ))}

                {/* Games Section for Mobile */}
                <div className="mt-4">
                  <h4 className="mb-2 text-lg font-semibold">{t('Games')}</h4> {/* Translated "Games" label */}
                  <div className="flex flex-col gap-2 pl-4">
                    {/* Filter and map through games that are "Ready to Play" */}
                    {games.filter(game => game.status === 'Ready to Play').map((game) => (
                      <Link
                        key={game.id}
                        to={`/game/${game.id}`}
                        className="text-base text-muted-foreground hover:text-primary"
                      >
                        {game.icon} {game.name} {/* Game icon and name */}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right-aligned utilities: Theme Switcher and Language Selector */}
        <div className="flex items-center">
          <ThemeSwitcher /> {/* Component for switching between light/dark themes */}
          {/* Language Selection Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('change_language_aria_label')}>
                <Languages className="h-6 w-6" /> {/* Language icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Language Options */}
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                <span className="mr-2">🇬🇧</span> {t('language.english')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('es')}>
                <span className="mr-2">🇪🇸</span> {t('language.spanish')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')}>
                <span className="mr-2">🇫🇷</span> {t('language.french')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
