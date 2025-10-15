import { ThemeSwitcher } from './theme-switcher';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      {children}
    </div>
  );
}