import React from 'react';
import { useTranslation } from 'react-i18next';
import { DeveloperProfile } from '@/components/landing/DeveloperProfile';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t('main_heading')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          {t('intro_paragraph')}
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <DeveloperProfile />
      </div>
    </div>
  );
};

export default Home;