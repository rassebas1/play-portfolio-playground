import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { games } from '@/pages/Games'; // Import games list
import { useTranslation } from 'react-i18next';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Experience', href: '/experience' },
  { name: 'Education', href: '/education' },
];

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold inline-block">Portfolio</span>
            </Link>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                }
              >
                {t(item.name)}
              </NavLink>
            ))}

            {/* Games Dropdown for Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium transition-colors hover:text-primary data-[state=open]:text-primary"
                >
                  {t('Games')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" forceMount>
                {games.filter(game => game.status === 'Ready to Play').map((game) => (
                  <DropdownMenuItem key={game.id} asChild>
                    <Link to={`/game/${game.id}`}>
                      {game.icon} {game.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <nav className="flex flex-col gap-4 pt-6">
                <Link to="/" className="mb-4 flex items-center space-x-2">
                  <span className="font-bold">Portfolio</span>
                </Link>
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `text-lg font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-foreground'}`
                    }
                  >
                    {t(item.name)}
                  </NavLink>
                ))}

                {/* Games Section for Mobile */}
                <div className="mt-4">
                  <h4 className="mb-2 text-lg font-semibold">{t('Games')}</h4>
                  <div className="flex flex-col gap-2 pl-4">
                    {games.filter(game => game.status === 'Ready to Play').map((game) => (
                      <Link
                        key={game.id}
                        to={`/game/${game.id}`}
                        className="text-base text-muted-foreground hover:text-primary"
                      >
                        {game.icon} {game.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center">
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                <span className="mr-2">🇬🇧</span> English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('es')}>
                <span className="mr-2">🇪🇸</span> Español
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')}>
                <span className="mr-2">🇫🇷</span> Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
