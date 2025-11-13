import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { describe, it, expect } from 'vitest';

describe('Footer', () => {
  it('renders the copyright notice with the current year', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Sebastián Espitia Londoño. All rights reserved.`)).toBeInTheDocument();
  });

  it('renders the GitHub link', () => {
    render(<Footer />);
    
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/rassebas1');
  });

  it('renders the LinkedIn link', () => {
    render(<Footer />);
    
    const linkedinLink = screen.getByLabelText('LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/sespitial');
  });
});
