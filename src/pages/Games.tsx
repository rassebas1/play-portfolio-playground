import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GameInfo } from '@/types/global';

/**
 * Array of game information objects.
 * Each object describes a game available in the portfolio, including its ID, name,
 * description, difficulty, category, icon, color theme, and current status.
 * @type {GameInfo[]}
 */
export const games: GameInfo[] = [
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic strategy game for two players. First to get three in a row wins!',
    difficulty: 'Easy',
    category: 'Strategy',
    icon: '🎯',
    color: 'hsl(var(--game-info))',
    status: 'Ready to Play',
  },
  {
    id: '2048',
    name: '2048',
    description: 'Slide numbered tiles to combine them and reach the 2048 tile.',
    difficulty: 'Medium',
    category: 'Puzzle',
    icon: '🔢',
    color: 'hsl(var(--game-warning))',
    status: 'Ready to Play',
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: 'Navigate through pipes by tapping to keep the bird flying.',
    difficulty: 'Hard',
    category: 'Arcade',
    icon: '🐦',
    color: 'hsl(var(--game-winner))',
    status: 'Ready to Play',
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Control a growing snake to eat food while avoiding walls and yourself.',
    difficulty: 'Medium',
    category: 'Arcade',
    icon: '🐍',
    color: 'hsl(var(--primary))',
    status: 'Ready to Play',
  },
  {
    id: 'memory-game',
    name: 'Memory Game',
    description: 'Test your memory by matching pairs of hidden cards.',
    difficulty: 'Easy',
    category: 'Puzzle',
    icon: '🧩',
    color: 'hsl(var(--game-danger))',
    status: 'Ready to Play',
  },
  {
    id: 'brick-breaker',
    name: 'Brick Breaker',
    description: 'Destroy bricks with a ball and paddle. Break all bricks to clear the level!',
    difficulty: 'Medium',
    category: 'Arcade',
    icon: '🧱',
    color: 'hsl(var(--game-info))',
    status: 'Ready to Play',
  },
];

/**
 * Games component.
 * Displays a list of available games in a grid format. Each game is presented
 * as a card with its details, and a button to play or a "Coming Soon" message.
 *
 * @returns {JSX.Element} The rendered games listing page.
 */
const Games: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Game Zone
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Explore a collection of classic and modern games.
        </p>
      </div>
      {/* Games Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map through the `games` array to render each game card */}
        {games.map((game) => (
          <Card
            key={game.id} // Unique key for list rendering
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <CardHeader className="text-center p-6">
              {/* Game Icon with hover animation */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {game.icon}
              </div>
              {/* Game Name */}
              <CardTitle className="text-2xl mb-2">{game.name}</CardTitle>
              {/* Game Difficulty and Category Badges */}
              <div className="flex justify-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="text-xs font-semibold"
                  style={{ borderColor: game.color, color: game.color }} // Dynamic color based on game theme
                >
                  {game.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs font-semibold">
                  {game.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Game Description */}
              <CardDescription className="text-center mb-6">
                {game.description}
              </CardDescription>
              {/* Conditional rendering for "Coming Soon" or "Play Game" button */}
              {game.status === 'Coming Soon' ? (
                <Button
                  className="w-full"
                  size="lg"
                  disabled // Disable button for coming soon games
                >
                  Coming Soon
                </Button>
              ) : (
                // Link to the game page if it's ready to play
                <Link to={`/game/${game.id}`} className="block">
                  <Button
                    className="w-full bg-primary hover:bg-primary-glow transition-colors"
                    size="lg"
                  >
                    Play Game
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Games;