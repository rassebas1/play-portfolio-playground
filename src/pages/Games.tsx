import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GameInfo } from '@/types/global';
import { useTranslation } from 'react-i18next';

/**
 * Array of game information objects.
 * Each object describes a game available in the portfolio, including its ID, name,
 * description, difficulty, category, icon, color theme, and current status.
 * @type {GameInfo[]}
 */
export const games: GameInfo[] = [
  {
    id: 'tic-tac-toe',
    name: 'ticTacToe.name',
    description: 'ticTacToe.description',
    difficulty: 'difficulty.easy',
    category: 'category.strategy',
    icon: '🎯',
    color: 'hsl(var(--game-info))',
    status: 'status.ready_to_play',
  },
  {
    id: '2048',
    name: 'game2048.name',
    description: 'game2048.description',
    difficulty: 'difficulty.medium',
    category: 'category.puzzle',
    icon: '🔢',
    color: 'hsl(var(--game-warning))',
    status: 'status.ready_to_play',
  },
  {
    id: 'flappy-bird',
    name: 'flappyBird.name',
    description: 'flappyBird.description',
    difficulty: 'difficulty.hard',
    category: 'category.arcade',
    icon: '🐦',
    color: 'hsl(var(--game-winner))',
    status: 'status.ready_to_play',
  },
  {
    id: 'snake',
    name: 'snake.name',
    description: 'snake.description',
    difficulty: 'difficulty.medium',
    category: 'category.arcade',
    icon: '🐍',
    color: 'hsl(var(--primary))',
    status: 'status.ready_to_play',
  },
  {
    id: 'memory-game',
    name: 'memoryGame.name',
    description: 'memoryGame.description',
    difficulty: 'difficulty.easy',
    category: 'category.puzzle',
    icon: '🧩',
    color: 'hsl(var(--game-danger))',
    status: 'status.ready_to_play',
  },
  {
    id: 'brick-breaker',
    name: 'brickBreaker.name',
    description: 'brickBreaker.description',
    difficulty: 'difficulty.medium',
    category: 'category.arcade',
    icon: '🧱',
    color: 'hsl(var(--game-info))',
    status: 'status.ready_to_play',
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
  const { t } = useTranslation(['games', 'common']);
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="text-center mb-20 pt-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t('game_zone_heading')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          {t('game_zone_intro', { ns: 'common' })}
        </p>
      </div>
      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map through the `games` array to render each game card */}
        {games.map((game, index) => (
          <Card
            key={game.id}
            className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <CardHeader className="text-center p-6 pb-2">
              {/* Game Icon with hover animation */}
              <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {game.icon}
              </div>
              {/* Game Name */}
              <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">{t(game.name, { ns: 'games' })}</CardTitle>
              {/* Game Difficulty and Category Badges */}
              <div className="flex justify-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-xs font-semibold"
                  style={{ borderColor: game.color, color: game.color }}
                >
                  {t(game.difficulty, { ns: 'common' })}
                </Badge>
                <Badge variant="secondary" className="text-xs font-semibold">
                  {t(game.category, { ns: 'common' })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {/* Game Description */}
              <CardDescription className="text-center mb-6 line-clamp-3">
                {t(game.description, { ns: 'games' })}
              </CardDescription>
              {/* Conditional rendering for "Coming Soon" or "Play Game" button */}
              {game.status === 'status.coming_soon' ? (
                <Button
                  className="w-full"
                  size="lg"
                  disabled
                >
                  {t('status.coming_soon', { ns: 'common' })}
                </Button>
              ) : (
                <Link to={`/game/${game.id}`} className="block">
                  <Button
                    className="w-full bg-primary hover:bg-primary-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    size="lg"
                  >
                    {t('button.play_game', { ns: 'common' })}
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