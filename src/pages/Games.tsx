import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GameInfo } from '@/types/global';

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
    id: 'memory',
    name: 'Memory Game',
    description: 'Test your memory by matching pairs of hidden cards.',
    difficulty: 'Easy',
    category: 'Puzzle',
    icon: '🧩',
    color: 'hsl(var(--game-danger))',
    status: 'Coming Soon',
  },
];

const Games: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Game Zone
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Explore a collection of classic and modern games.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <Card
            key={game.id}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <CardHeader className="text-center p-6">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {game.icon}
              </div>
              <CardTitle className="text-2xl mb-2">{game.name}</CardTitle>
              <div className="flex justify-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="text-xs font-semibold"
                  style={{ borderColor: game.color, color: game.color }}
                >
                  {game.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs font-semibold">
                  {game.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardDescription className="text-center mb-6">
                {game.description}
              </CardDescription>
              {game.status === 'Coming Soon' ? (
                <Button
                  className="w-full"
                  size="lg"
                  disabled
                >
                  Coming Soon
                </Button>
              ) : (
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