import React from 'react';

interface GameHeaderProps {
  title: string;
  description: React.ReactNode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
        {title}
      </h1>
      <p className="text-muted-foreground text-lg">
        {description}
      </p>
    </div>
  );
};