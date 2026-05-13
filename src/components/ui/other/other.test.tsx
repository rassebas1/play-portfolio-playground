import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from './scroll-area';
import { Slider } from './slider';
import { ThemeSwitcher } from './theme-switcher';

describe('ScrollArea', () => {
  it('renders children', () => {
    render(<ScrollArea><div>scrollable content</div></ScrollArea>);
    expect(screen.getByText('scrollable content')).toBeInTheDocument();
  });
});

describe('Slider', () => {
  it('renders without crashing', () => {
    const { container } = render(<Slider defaultValue={[50]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('ThemeSwitcher', () => {
  it('renders without crashing', () => {
    const { container } = render(<ThemeSwitcher />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
