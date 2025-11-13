import { render, screen } from '@testing-library/react';
import { Scoreboard } from './Scoreboard';
import { describe, it, expect } from 'vitest';

describe('Scoreboard', () => {
  it('renders the score and best score', () => {
    render(<Scoreboard score={100} bestScore={500} />);
    
    const scoreElement = screen.getByText('100');
    const bestScoreElement = screen.getByText('500');
    
    expect(scoreElement).toBeInTheDocument();
    expect(bestScoreElement).toBeInTheDocument();
  });

  it('formats the score and best score', () => {
    render(<Scoreboard score={1000} bestScore={5000} />);
    
    const scoreElement = screen.getByText(/1(,|.)000/);
    const bestScoreElement = screen.getByText(/5(,|.)000/);
    
    expect(scoreElement).toBeInTheDocument();
    expect(bestScoreElement).toBeInTheDocument();
  });

  it('renders the titles "Score" and "Best"', () => {
    render(<Scoreboard score={0} bestScore={0} />);
    
    const scoreTitle = screen.getByText('Score');
    const bestTitle = screen.getByText('Best');
    
    expect(scoreTitle).toBeInTheDocument();
    expect(bestTitle).toBeInTheDocument();
  });
});
