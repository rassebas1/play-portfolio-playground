import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/interactive/collapsible';
import { Toaster } from '@/components/ui/feedback/sonner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/interactive/toggle-group';
import { Calendar } from '@/components/ui/other/calendar';

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('Collapsible', () => {
  it('renders trigger and content', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });

  it('toggles open/close on click', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByText('Toggle');
    await user.click(trigger);
    expect(screen.getByText('Content')).toBeVisible();
  });
});

describe('Sonner', () => {
  it('renders Toaster component without crashing', () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });
});

describe('ToggleGroup', () => {
  it('renders items', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    const itemA = screen.getByText('A');
    await user.click(itemA);
    expect(itemA).toHaveAttribute('data-state', 'on');
  });

  it('only one can be selected', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single" defaultValue="a">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );
    const itemA = screen.getByText('A');
    const itemB = screen.getByText('B');

    expect(itemA).toHaveAttribute('data-state', 'on');
    expect(itemB).toHaveAttribute('data-state', 'off');

    await user.click(itemB);
    expect(itemB).toHaveAttribute('data-state', 'on');
    expect(itemA).toHaveAttribute('data-state', 'off');
  });
});

describe('Calendar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Calendar />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
