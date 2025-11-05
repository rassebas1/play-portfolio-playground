import { ThemeSwitcher } from './theme-switcher';
import { Link } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="p-4 flex justify-between items-center">
        <nav>
          <ul className="flex gap-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/games">Games</Link></li>
            <li><Link to="/experience">Experience</Link></li>
          </ul>
        </nav>
        <ThemeSwitcher />
      </header>
      <main>{children}</main>
    </div>
  );
}