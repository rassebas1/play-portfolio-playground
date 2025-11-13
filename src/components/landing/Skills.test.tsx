import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';
import { describe, it, expect, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children }) => <div>{children}</div>,
    },
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'en',
    },
  }),
}));

// Mock skills_consts
vi.mock('@/utils/skills_consts', () => ({
  skillCategories: {
    frontend: { en: 'Frontend', es: 'Frontend', fr: 'Frontend' },
    backend: { en: 'Backend', es: 'Backend', fr: 'Backend' },
  },
  skills: {
    frontend: ['React', 'TypeScript'],
    backend: ['Node.js', 'Express'],
  },
}));

describe('Skills', () => {
  it('renders the skills categories and skills', () => {
    render(<Skills />);
    
    // Check for categories
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    
    // Check for skills
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Express')).toBeInTheDocument();
  });

  it('renders the main title', () => {
    render(<Skills />);
    
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });
});
