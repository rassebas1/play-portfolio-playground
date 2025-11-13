import { render, screen } from '@testing-library/react';
import { GameHeader } from './GameHeader';
import { describe, it, expect } from 'vitest';

describe('GameHeader', () => {
  it('renders the title and description', () => {
    const title = 'Test Game';
    const description = 'This is a test description.';
    render(<GameHeader title={title} description={description} />);
    
    const titleElement = screen.getByText(title);
    const descriptionElement = screen.getByText(description);
    
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders a React node as the description', () => {
    const title = 'Test Game';
    const description = <span>This is a <strong>test</strong> description.</span>;
    render(<GameHeader title={title} description={description} />);
    
    const descriptionElement = screen.getByText(/This is a/);
    const strongElement = screen.getByText('test');
    
    expect(descriptionElement).toBeInTheDocument();
    expect(strongElement).toBeInTheDocument();
    expect(strongElement.tagName).toBe('STRONG');
  });
});
