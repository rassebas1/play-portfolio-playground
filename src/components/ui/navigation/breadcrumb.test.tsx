import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './breadcrumb';

vi.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe('Breadcrumb', () => {
  it('renders nav element with aria label', () => {
    render(<Breadcrumb data-testid="breadcrumb" />);
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('renders BreadcrumbList as ordered list', () => {
    render(<BreadcrumbList data-testid="list" />);
    const list = screen.getByTestId('list');
    expect(list.tagName).toBe('OL');
  });

  it('renders BreadcrumbItem', () => {
    render(<BreadcrumbItem data-testid="item" />);
    expect(screen.getByTestId('item')).toBeInTheDocument();
    expect(screen.getByTestId('item').tagName).toBe('LI');
  });

  it('renders BreadcrumbLink as anchor', () => {
    render(<BreadcrumbLink href="/test" data-testid="link">Home</BreadcrumbLink>);
    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveTextContent('Home');
  });

  it('renders BreadcrumbLink as Slot when asChild is true', () => {
    render(<BreadcrumbLink asChild data-testid="link">Child</BreadcrumbLink>);
    expect(screen.getByTestId('link')).toBeInTheDocument();
  });

  it('renders BreadcrumbPage as span with aria-current', () => {
    render(<BreadcrumbPage data-testid="page">Current</BreadcrumbPage>);
    const page = screen.getByTestId('page');
    expect(page).toHaveAttribute('aria-current', 'page');
    expect(page).toHaveTextContent('Current');
  });

  it('renders BreadcrumbSeparator with chevron', () => {
    render(<BreadcrumbSeparator data-testid="sep" />);
    expect(screen.getByTestId('sep')).toBeInTheDocument();
  });

  it('renders BreadcrumbEllipsis', () => {
    render(<BreadcrumbEllipsis data-testid="ellipsis" />);
    expect(screen.getByTestId('ellipsis')).toBeInTheDocument();
  });
});
