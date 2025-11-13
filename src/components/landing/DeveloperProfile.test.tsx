import { render, screen } from '@testing-library/react';
import { DeveloperProfile } from './DeveloperProfile';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'developer_title') {
        return 'Full-Stack Developer';
      }
      if (key === 'developer_description') {
        return 'A passionate developer who loves to create amazing things.';
      }
      return key;
    },
  }),
}));

vi.mock('@/components/ui/avatar', async () => {
  const actual = await vi.importActual('@/components/ui/avatar');
  return {
    ...actual,
    AvatarImage: (props) => <img {...props} />,
  };
});

describe('DeveloperProfile', () => {
  it('renders the developer\'s name and title', () => {
    render(<DeveloperProfile />);
    
    const nameElement = screen.getByText('Sebastián Espitia Londoño');
    const titleElement = screen.getByText('Full-Stack Developer');
    
    expect(nameElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the developer\'s description', () => {
    render(<DeveloperProfile />);
    
    const descriptionElement = screen.getByText('A passionate developer who loves to create amazing things.');
    
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the avatar with the correct image', () => {
    render(<DeveloperProfile />);
    
    const avatarImage = screen.getByAltText('Sebastián Espitia Londoño');
    
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'https://github.com/rassebas1.png');
  });
});
