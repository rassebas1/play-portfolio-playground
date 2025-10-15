import React from 'react';

export const GameHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
        2048
      </h1>
      <p className="text-muted-foreground text-lg">
        Join the tiles, get to <span className="text-accent font-semibold">2048!</span>
      </p>
    </div>
  );
};