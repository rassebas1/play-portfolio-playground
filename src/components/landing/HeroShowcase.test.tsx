import { render, screen } from '@testing-library/react';
import { HeroShowcase } from './HeroShowcase';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router

interface HighlightedProject {
  id: string;
  title: string;
  image: string;
  link: string;
}

describe('HeroShowcase', () => {
  const mockProjects: HighlightedProject[] = [
    { id: '1', title: 'LabAI Project', image: '/labai.jpg', link: '/lab-ai' },
    { id: '2', title: 'Tower Defense', image: '/tower-defense.jpg', link: '/game/tower-defense' },
  ];

  it('renders without crashing', () => {
    render(<Router><HeroShowcase highlightedProjects={mockProjects} /></Router>); // Wrap with Router
    expect(screen.getByTestId('hero-showcase')).toBeInTheDocument();
  });

  it('renders project titles from props', () => {
    render(<Router><HeroShowcase highlightedProjects={mockProjects} /></Router>); // Wrap with Router
    expect(screen.getByText('LabAI Project')).toBeInTheDocument();
    expect(screen.getByText('Tower Defense')).toBeInTheDocument();
  });

  it('renders project links from props', () => {
    render(<Router><HeroShowcase highlightedProjects={mockProjects} /></Router>); // Wrap with Router
    expect(screen.getByRole('link', { name: 'LabAI Project' })).toHaveAttribute('href', '/lab-ai');
    expect(screen.getByRole('link', { name: 'Tower Defense' })).toHaveAttribute('href', '/game/tower-defense');
  });
});
