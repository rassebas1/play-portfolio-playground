import React from 'react';
import { DeveloperProfile } from '@/components/landing/DeveloperProfile';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Sebastián Espitia Londoño
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Lead Full-Stack Engineer with a passion for building modern web applications and games.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <DeveloperProfile />
      </div>
    </div>
  );
};

export default Home;