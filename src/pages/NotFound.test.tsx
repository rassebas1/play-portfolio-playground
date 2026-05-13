import { renderWithProviders, screen } from '@/tests/utils/render';
import NotFound from './NotFound';

describe('NotFound', () => {
  it('renders 404 heading', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('displays not found message from translations', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('not_found.message')).toBeInTheDocument();
  });

  it('shows return home link', () => {
    renderWithProviders(<NotFound />);
    const link = screen.getByRole('link', { name: 'not_found.return_home' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('return home link has correct styling classes', () => {
    renderWithProviders(<NotFound />);
    const link = screen.getByRole('link', { name: 'not_found.return_home' });
    expect(link).toHaveClass('text-blue-500');
    expect(link).toHaveClass('hover:text-blue-700');
    expect(link).toHaveClass('underline');
  });

  it('renders in a centered layout', () => {
    renderWithProviders(<NotFound />);
    const outerContainer = screen.getByText('404').parentElement?.parentElement;
    expect(outerContainer?.className).toContain('flex');
    expect(outerContainer?.className).toContain('items-center');
    expect(outerContainer?.className).toContain('justify-center');
    expect(outerContainer?.className).toContain('min-h-screen');
    expect(outerContainer?.className).toContain('bg-gray-100');
  });

  it('has semantic heading with correct size', () => {
    renderWithProviders(<NotFound />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('404');
    expect(heading.className).toContain('text-4xl');
    expect(heading.className).toContain('font-bold');
  });

  it('logs 404 error to console on mount', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(<NotFound />);
    expect(consoleSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/'
    );
    consoleSpy.mockRestore();
  });
});