import { render, screen } from '@testing-library/react';
import { ExperienceCard } from './ExperienceCard';
import { describe, it, expect } from 'vitest';

const mockExperience = {
  company: 'Awesome Inc.',
  title: 'Software Engineer',
  date: '2022 - Present',
  activities: [
    'Developed cool features.',
    'Fixed some bugs.',
    'Drank a lot of coffee.',
  ],
};

describe('ExperienceCard', () => {
  it('renders the experience details', () => {
    render(<ExperienceCard {...mockExperience} />);
    
    expect(screen.getByText(mockExperience.company)).toBeInTheDocument();
    expect(screen.getByText(mockExperience.title)).toBeInTheDocument();
    expect(screen.getByText(mockExperience.date)).toBeInTheDocument();
  });

  it('renders the list of activities', () => {
    render(<ExperienceCard {...mockExperience} />);
    
    mockExperience.activities.forEach(activity => {
      expect(screen.getByText(activity)).toBeInTheDocument();
    });
  });
});
