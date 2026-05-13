import * as React from 'react';
import { fireEvent, renderWithProviders, screen } from '@/tests/utils/render';
import { Button } from './button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      renderWithProviders(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders custom elements passed as children', () => {
      renderWithProviders(
        <Button>
          <span>Custom content</span>
        </Button>
      );
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });
  });

  describe('Default variant', () => {
    it('applies default variant classes when variant is not specified', () => {
      renderWithProviders(<Button>Default</Button>);
      const button = screen.getByRole('button', { name: /default/i }) as HTMLButtonElement;
      expect(button).toHaveClass('bg-primary');
      expect(button).toHaveClass('text-primary-foreground');
      expect(button).toHaveClass('hover:bg-primary/90');
    });

    it('applies default size classes when size is not specified', () => {
      renderWithProviders(<Button>Default</Button>);
      const button = screen.getByRole('button', { name: /default/i }) as HTMLButtonElement;
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
    });
  });

  describe('Variants', () => {
    it('applies secondary variant classes', () => {
      renderWithProviders(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button', { name: /secondary/i }) as HTMLButtonElement;
      expect(button).toHaveClass('bg-secondary');
      expect(button).toHaveClass('text-secondary-foreground');
      expect(button).toHaveClass('hover:bg-secondary/80');
    });

    it('applies outline variant classes', () => {
      renderWithProviders(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button', { name: /outline/i }) as HTMLButtonElement;
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-input');
      expect(button).toHaveClass('bg-background');
      expect(button).toHaveClass('hover:bg-accent');
    });

    it('applies ghost variant classes', () => {
      renderWithProviders(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button', { name: /ghost/i }) as HTMLButtonElement;
      expect(button).toHaveClass('hover:bg-accent');
      expect(button).toHaveClass('hover:text-accent-foreground');
    });

    it('applies destructive variant classes', () => {
      renderWithProviders(<Button variant="destructive">Destructive</Button>);
      const button = screen.getByRole('button', { name: /destructive/i }) as HTMLButtonElement;
      expect(button).toHaveClass('bg-destructive');
      expect(button).toHaveClass('text-destructive-foreground');
      expect(button).toHaveClass('hover:bg-destructive/90');
    });

    it('applies link variant classes', () => {
      renderWithProviders(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button', { name: /link/i }) as HTMLButtonElement;
      expect(button).toHaveClass('text-primary');
      expect(button).toHaveClass('underline-offset-4');
    });
  });

  describe('Sizes', () => {
    it('applies sm size classes', () => {
      renderWithProviders(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button', { name: /small/i }) as HTMLButtonElement;
      expect(button).toHaveClass('h-9');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('min-w-[36px]');
    });

    it('applies lg size classes', () => {
      renderWithProviders(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button', { name: /large/i }) as HTMLButtonElement;
      expect(button).toHaveClass('h-12');
      expect(button).toHaveClass('px-8');
      expect(button).toHaveClass('text-base');
    });

    it('applies icon size classes', () => {
      renderWithProviders(<Button size="icon">Icon</Button>);
      const button = screen.getByRole('button', { name: /icon/i }) as HTMLButtonElement;
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('w-10');
    });

    it('applies iconSm size classes', () => {
      renderWithProviders(<Button size="iconSm">Icon SM</Button>);
      const button = screen.getByRole('button', { name: /icon sm/i }) as HTMLButtonElement;
      expect(button).toHaveClass('h-8');
      expect(button).toHaveClass('w-8');
      expect(button).toHaveClass('min-w-[32px]');
    });
  });

  describe('Event handling', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      renderWithProviders(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole('button', { name: /click/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes through additional props like type and name', () => {
      renderWithProviders(
        <Button type="submit" name="submit-btn" value="go">
          Submit
        </Button>
      );
      const button = screen.getByRole('button', { name: /submit/i }) as HTMLButtonElement;
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'submit-btn');
      expect(button).toHaveAttribute('value', 'go');
    });

    it('handles keyboard events', () => {
      const handleKeyDown = vi.fn();
      renderWithProviders(
        <Button onKeyDown={handleKeyDown}>Keyboard</Button>
      );

      fireEvent.keyDown(screen.getByRole('button', { name: /keyboard/i }), {
        key: 'Enter',
        code: 'Enter',
      });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      renderWithProviders(<Button ref={ref}>Ref Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Ref Test');
    });
  });

  describe('Disabled state', () => {
    it('applies disabled classes when disabled', () => {
      renderWithProviders(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button', { name: /disabled/i }) as HTMLButtonElement;
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none');
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('does not trigger onClick when disabled', () => {
      const handleClick = vi.fn();
      renderWithProviders(
        <Button disabled onClick={handleClick}>
          Disabled Click
        </Button>
      );

      fireEvent.click(screen.getByRole('button', { name: /disabled click/i }));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('remains disabled with variant applied', () => {
      renderWithProviders(
        <Button variant="destructive" disabled>
          Disabled Destructive
        </Button>
      );
      const button = screen.getByRole('button', {
        name: /disabled destructive/i,
      }) as HTMLButtonElement;
      expect(button).toBeDisabled();
      expect(button).toHaveClass('bg-destructive');
    });
  });

  describe('ClassName merging', () => {
    it('merges custom className with variant classes', () => {
      renderWithProviders(
        <Button className="custom-class">Custom</Button>
      );
      const button = screen.getByRole('button', { name: /custom/i }) as HTMLButtonElement;
      expect(button).toHaveClass('bg-primary');
      expect(button).toHaveClass('custom-class');
    });

    it('merges custom className with outline variant', () => {
      renderWithProviders(
        <Button variant="outline" className="extra-style">
          Outline Custom
        </Button>
      );
      const button = screen.getByRole('button', { name: /outline custom/i }) as HTMLButtonElement;
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('extra-style');
    });

    it('handles className that overrides styles', () => {
      renderWithProviders(
        <Button className="!bg-red-500">Override</Button>
      );
      const button = screen.getByRole('button', { name: /override/i }) as HTMLButtonElement;
      expect(button).toHaveClass('!bg-red-500');
      expect(button).toHaveClass('bg-primary');
    });
  });
});
