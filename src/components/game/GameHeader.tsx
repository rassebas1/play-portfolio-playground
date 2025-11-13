import React from 'react';

/**
 * Props for the GameHeader component.
 * @interface GameHeaderProps
 * @property {string} title - The main title of the game.
 * @property {React.ReactNode} description - A description or subtitle for the game, can be a string or JSX.
 */
interface GameHeaderProps {
  title: string;
  description: React.ReactNode;
}

/**
 * GameHeader component.
 * Displays the title and a brief description for a game.
 * It uses gradient text for the title and muted foreground for the description.
 *
 * @param {GameHeaderProps} { title, description } - Props passed to the component.
 * @returns {JSX.Element} The rendered game header.
 */
export const GameHeader: React.FC<GameHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-8">
      {/* Game Title: Large, bold, with a gradient text effect */}
      <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
        {title}
      </h1>
      {/* Game Description: Muted foreground text for a subtle look */}
      <p className="text-muted-foreground text-lg">
        {description}
      </p>
    </div>
  );
};