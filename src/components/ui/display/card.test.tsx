import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';

describe('Card', () => {
  describe('Card', () => {
    it('renders children', () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<Card className="my-custom-class" />);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain('rounded-lg border bg-card text-card-foreground shadow-sm');
      expect(element.className).toContain('my-custom-class');
    });

    it('renders as a div element', () => {
      const { container } = render(<Card />);
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });

    it('passes ref and props through', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Card ref={ref} data-testid="card-test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(screen.getByTestId('card-test')).toBeInTheDocument();
    });
  });

  describe('CardHeader', () => {
    it('renders children', () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<CardHeader className="my-custom-class" />);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain('flex flex-col space-y-1.5 p-6');
      expect(element.className).toContain('my-custom-class');
    });

    it('renders as a div element', () => {
      const { container } = render(<CardHeader />);
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardTitle', () => {
    it('renders children', () => {
      render(<CardTitle>Title Text</CardTitle>);
      expect(screen.getByText('Title Text')).toBeInTheDocument();
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<CardTitle className="my-custom-class" />);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain('text-2xl font-semibold leading-none tracking-tight');
      expect(element.className).toContain('my-custom-class');
    });

    it('renders as an h3 element', () => {
      const { container } = render(<CardTitle />);
      expect(container.firstChild).toBeInstanceOf(HTMLHeadingElement);
      expect((container.firstChild as HTMLElement).tagName).toBe('H3');
    });
  });

  describe('CardDescription', () => {
    it('renders children', () => {
      render(<CardDescription>Description Text</CardDescription>);
      expect(screen.getByText('Description Text')).toBeInTheDocument();
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<CardDescription className="my-custom-class" />);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain('text-sm text-muted-foreground');
      expect(element.className).toContain('my-custom-class');
    });

    it('renders as a paragraph element', () => {
      const { container } = render(<CardDescription />);
      expect(container.firstChild).toBeInstanceOf(HTMLParagraphElement);
      expect((container.firstChild as HTMLElement).tagName).toBe('P');
    });
  });

  describe('CardContent', () => {
    it('renders children', () => {
      render(<CardContent>Content Text</CardContent>);
      expect(screen.getByText('Content Text')).toBeInTheDocument();
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<CardContent className="my-custom-class" />);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain('p-6 pt-0');
      expect(element.className).toContain('my-custom-class');
    });

    it('renders as a div element', () => {
      const { container } = render(<CardContent />);
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardFooter', () => {
    it('renders children', () => {
      render(<CardFooter>Footer Text</CardFooter>);
      expect(screen.getByText('Footer Text')).toBeInTheDocument();
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<CardFooter className="my-custom-class" />);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain('flex items-center p-6 pt-0');
      expect(element.className).toContain('my-custom-class');
    });

    it('renders as a div element', () => {
      const { container } = render(<CardFooter />);
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('compound rendering', () => {
    it('renders all sub-components together in semantic structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>My Card</CardTitle>
            <CardDescription>A card description</CardDescription>
          </CardHeader>
          <CardContent>Main content here</CardContent>
          <CardFooter>Footer actions</CardFooter>
        </Card>
      );

      expect(screen.getByText('My Card')).toBeInTheDocument();
      expect(screen.getByText('My Card').tagName).toBe('H3');
      expect(screen.getByText('A card description')).toBeInTheDocument();
      expect(screen.getByText('A card description').tagName).toBe('P');
      expect(screen.getByText('Main content here')).toBeInTheDocument();
      expect(screen.getByText('Footer actions')).toBeInTheDocument();
    });
  });
});
