import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

interface HighlightedProject {
  id: string;
  title: string;
  image: string;
  link: string;
}

interface HeroShowcaseProps {
  highlightedProjects: HighlightedProject[];
}

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({ highlightedProjects }) => {
  return (
    <div data-testid="hero-showcase">
      Hero Showcase
      {highlightedProjects.map(project => (
        <Link key={project.id} to={project.link}> {/* Use Link component */}
          {project.title}
        </Link>
      ))}
    </div>
  );
};
