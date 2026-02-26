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
  { name: 'Lab AI', href: '/lab-ai' },
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
  const { t, i18n } = useTranslation(['games','common']);

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
              <span className="font-bold inline-block">{t('portfolio', { ns: 'common' })}</span>
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

            {/* Games Dropdown for Desktop - Hover to show dropdown, Click to go to /games */}
            <div className="relative group">
              <Link to="/games">
                <Button
                  variant="ghost"
                  className="text-sm font-medium transition-colors hover:text-primary data-[state=open]:text-primary"
                >
                  {t('Games')} {/* Translated "Games" label */}
                </Button>
              </Link>
              {/* Dropdown menu shown on hover */}
              <div className="absolute left-0 top-full z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-1">
                  {/* Filter and map through games that are "Ready to Play" */}
                  {games.filter(game => game.status === 'status.ready_to_play').map((game) => (
                    <Link
                      key={game.id}
                      to={`/game/${game.id}`}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {game.icon} {t(game.name, { ns: 'games' })} {/* Game icon and translated name */}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Navigation (Sheet/Sidebar) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden min-w-[44px] min-h-[44px]"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('toggle_menu_aria_label')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] pt-12">
              <SheetTitle className="sr-only">{t('mobile_navigation_aria_label')}</SheetTitle>
              <nav className="flex flex-col gap-2">
                <Link 
                  to="/" 
                  className="mb-4 flex items-center space-x-2 text-lg font-semibold px-3 py-2 rounded-md hover:bg-accent"
                >
                  <span>{t('portfolio', { ns: 'common' })}</span>
                </Link>
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `text-base font-medium transition-colors rounded-md px-3 py-3 min-h-[44px] flex items-center ${
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-accent hover:text-primary text-foreground'
                      }`
                    }
                  >
                    {t(item.name)}
                  </NavLink>
                ))}

                <div className="mt-4 pt-4 border-t">
                  <h4 className="mb-3 text-sm font-semibold text-muted-foreground px-3">{t('Games')}</h4>
                  <div className="flex flex-col gap-1">
                    {games.filter(game => game.status === 'status.ready_to_play').map((game) => (
                      <Link
                        key={game.id}
                        to={`/game/${game.id}`}
                        className="text-base text-muted-foreground hover:text-primary hover:bg-accent rounded-md px-3 py-3 min-h-[44px] flex items-center"
                      >
                        <span className="mr-3 text-xl">{game.icon}</span>
                        {t(game.name, { ns: 'games' })}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right-aligned utilities: Theme Switcher and Language Selector */}
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="min-w-[44px] min-h-[44px]" aria-label={t('change_language_aria_label')}>
                <Languages className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem onClick={() => changeLanguage('en')} className="min-h-[44px]">
                <span className="mr-3 text-lg">🇬🇧</span> {t('language.english', { ns: 'common' })}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('es')} className="min-h-[44px]">
                <span className="mr-3 text-lg">🇪🇸</span> {t('language.spanish', { ns: 'common' })}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')} className="min-h-[44px]">
                <span className="mr-3 text-lg">🇫🇷</span> {t('language.french', { ns: 'common' })}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('it')} className="min-h-[44px]">
                <span className="mr-3 text-lg">🇮🇹</span> {t('language.italian', { ns: 'common' })}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
