import { render, screen } from '@testing-library/react';
import { EducationCard } from './EducationCard';
import { describe, it, expect, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children }) => <div>{children}</div>,
      h3: ({ children }) => <h3>{children}</h3>,
      p: ({ children }) => <p>{children}</p>,
      ul: ({ children }) => <ul>{children}</ul>,
      h4: ({ children }) => <h4>{children}</h4>,
    },
    useInView: () => true,
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock('@/components/ui/avatar', async () => {
  const actual = await vi.importActual('@/components/ui/avatar');
  return {
    ...actual,
    AvatarImage: (props) => <img {...props} />,
  };
});

const mockEducation = {
  degree: 'Software Engineer',
  university: 'Universidad Central',
  years: '2019 - 2024',
  logo: 'logo.png',
  hook: 'A great student.',
  skills: ['React', 'TypeScript', 'Node.js'],
  courses: ['Data Structures', 'Algorithms', 'Databases'],
  project: {
    title: 'My Awesome Project',
    thumbnail: 'thumbnail.png',
  },
};

describe('EducationCard', () => {
  it('renders the education details', () => {
    render(<EducationCard {...mockEducation} />);
    
    expect(screen.getByText(mockEducation.degree)).toBeInTheDocument();
    expect(screen.getByText(mockEducation.university)).toBeInTheDocument();
    expect(screen.getByText(mockEducation.years)).toBeInTheDocument();
    expect(screen.getByText(mockEducation.hook)).toBeInTheDocument();
  });

  it('renders the skills', () => {
    render(<EducationCard {...mockEducation} />);
    
    mockEducation.skills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('renders the key courses', () => {
    render(<EducationCard {...mockEducation} />);
    
    expect(screen.getByText('key_courses')).toBeInTheDocument();
    mockEducation.courses.forEach(course => {
      expect(screen.getByText(course)).toBeInTheDocument();
    });
  });

  it('renders the signature project', () => {
    render(<EducationCard {...mockEducation} />);
    
    expect(screen.getByText('signature_project')).toBeInTheDocument();
    expect(screen.getByText(mockEducation.project.title)).toBeInTheDocument();
    const thumbnail = screen.getByAltText(mockEducation.project.title);
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute('src', mockEducation.project.thumbnail);
  });

  it('renders the university logo', () => {
    render(<EducationCard {...mockEducation} />);
    
    const logo = screen.getByAltText(`${mockEducation.university} logo`);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', mockEducation.logo);
  });
});
