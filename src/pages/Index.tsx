import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GameInfo } from '@/types/global';

/**
 * Available games in the portfolio
 */
const games: GameInfo[] = [
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic strategy game for two players. First to get three in a row wins!',
    difficulty: 'Easy',
    category: 'Strategy',
    icon: '🎯',
    color: 'hsl(var(--game-info))'
  },
  {
    id: '2048',
    name: '2048',
    description: 'Slide numbered tiles to combine them and reach the 2048 tile.',
    difficulty: 'Medium',
    category: 'Puzzle',
    icon: '🔢',
    color: 'hsl(var(--game-warning))'
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: 'Navigate through pipes by tapping to keep the bird flying.',
    difficulty: 'Hard',
    category: 'Arcade',
    icon: '🐦',
    color: 'hsl(var(--game-winner))'
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Control a growing snake to eat food while avoiding walls and yourself.',
    difficulty: 'Medium',
    category: 'Arcade',
    icon: '🐍',
    color: 'hsl(var(--primary))'
  },
  {
    id: 'memory',
    name: 'Memory Game',
    description: 'Test your memory by matching pairs of hidden cards.',
    difficulty: 'Easy',
    category: 'Puzzle',
    icon: '🧩',
    color: 'hsl(var(--game-danger))'
  }
];

/**
 * Main portfolio landing page component
 * Displays all available games in an organized grid layout
 */
const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Gaming Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Welcome to my interactive gaming portfolio! Explore these classic games built with React, 
            TypeScript, and modern web technologies to showcase my development skills.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm">React</Badge>
            <Badge variant="secondary" className="text-sm">TypeScript</Badge>
            <Badge variant="secondary" className="text-sm">Tailwind CSS</Badge>
            <Badge variant="secondary" className="text-sm">Custom Hooks</Badge>
            <Badge variant="secondary" className="text-sm">Clean Architecture</Badge>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted border-border"
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
                <CardTitle className="text-xl mb-2">{game.name}</CardTitle>
                <div className="flex justify-center gap-2 mb-3">
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ borderColor: game.color, color: game.color }}
                  >
                    {game.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {game.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-6 text-sm leading-relaxed">
                  {game.description}
                </CardDescription>
                <Link to={`/game/${game.id}`} className="block">
                  <Button 
                    className="w-full bg-primary hover:bg-primary-glow transition-colors"
                    size="lg"
                  >
                    Play Game
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Developer Info */}
        <div className="text-center">
          <div className="bg-card border border-border rounded-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">About This Portfolio</h2>
            <p className="text-muted-foreground leading-relaxed">
              This gaming portfolio demonstrates my expertise in modern web development, 
              featuring clean code architecture, TypeScript for type safety, custom React hooks 
              for game logic, and responsive design. Each game is built as a self-contained module 
              with its own components, hooks, and type definitions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;