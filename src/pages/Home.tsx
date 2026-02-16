import React from 'react';
import { useTranslation } from 'react-i18next';
import { DeveloperProfile } from '@/components/landing/DeveloperProfile';

/**
 * Home component.
 * This is the main landing page of the portfolio application.
 * It displays a personalized heading, an introductory paragraph,
 * and the `DeveloperProfile` component, all with internationalization support.
 *
 * @returns {JSX.Element} The rendered home page.
 */
const Home: React.FC = () => {
  // `useTranslation` hook provides access to the translation function `t`.
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Main heading and introduction paragraph */}
      <div className="text-center mb-20 pt-10">
        {/* Main Heading: Uses a gradient text effect and is translated */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t('main_heading')}
        </h1>
        {/* Introduction Paragraph: Translated and styled */}
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          {t('intro_paragraph')}
        </p>
      </div>
      {/* Developer Profile Section */}
      <div className="max-w-3xl mx-auto">
        <DeveloperProfile /> {/* Renders the developer's profile information */}
      </div>
    </div>
  );
};

export default Home;