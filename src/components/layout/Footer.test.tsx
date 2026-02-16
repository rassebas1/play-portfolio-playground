import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { describe, it, expect, vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations: Record<string, string> = {
        'footer.copyright': 'All rights reserved.',
        'footer.github_aria_label': 'GitHub profile',
        'footer.linkedin_aria_label': 'LinkedIn profile',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
    },
  }),
}));

describe('Footer', () => {
  it('renders the copyright notice with the current year', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Sebastián Espitia Londoño. All rights reserved.`)).toBeInTheDocument();
  });

  it('renders the GitHub link', () => {
    render(<Footer />);
    
    const githubLink = screen.getByLabelText('GitHub profile');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/rassebas1');
  });

  it('renders the LinkedIn link', () => {
    render(<Footer />);
    
    const linkedinLink = screen.getByLabelText('LinkedIn profile');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/sespitial');
  });
});
