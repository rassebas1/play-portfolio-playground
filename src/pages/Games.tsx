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
    name: 'tic_tac_toe.name',
    description: 'tic_tac_toe.description',
    difficulty: 'common.difficulty.easy',
    category: 'common.category.strategy',
    icon: '🎯',
    color: 'hsl(var(--game-info))',
    status: 'common.status.ready_to_play',
  },
  {
    id: '2048',
    name: 'game_2048.name',
    description: 'game_2048.description',
    difficulty: 'common.difficulty.medium',
    category: 'common.category.puzzle',
    icon: '🔢',
    color: 'hsl(var(--game-warning))',
    status: 'common.status.ready_to_play',
  },
  {
    id: 'flappy-bird',
    name: 'flappy_bird.name',
    description: 'flappy_bird.description',
    difficulty: 'common.difficulty.hard',
    category: 'common.category.arcade',
    icon: '🐦',
    color: 'hsl(var(--game-winner))',
    status: 'common.status.ready_to_play',
  },
  {
    id: 'snake',
    name: 'snake.name',
    description: 'snake.description',
    difficulty: 'common.difficulty.medium',
    category: 'common.category.arcade',
    icon: '🐍',
    color: 'hsl(var(--primary))',
    status: 'common.status.ready_to_play',
  },
  {
    id: 'memory-game',
    name: 'memory_game.name',
    description: 'memory_game.description',
    difficulty: 'common.difficulty.easy',
    category: 'common.category.puzzle',
    icon: '🧩',
    color: 'hsl(var(--game-danger))',
    status: 'common.status.ready_to_play',
  },
  {
    id: 'brick-breaker',
    name: 'brick_breaker.name',
    description: 'brick_breaker.description',
    difficulty: 'common.difficulty.medium',
    category: 'common.category.arcade',
    icon: '🧱',
    color: 'hsl(var(--game-info))',
    status: 'common.status.ready_to_play',
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
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t('game_zone_heading')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          {t('game_zone_intro')}
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
              <CardTitle className="text-2xl mb-2">{t(game.name, { ns: 'games' })}</CardTitle>
              {/* Game Difficulty and Category Badges */}
              <div className="flex justify-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="text-xs font-semibold"
                  style={{ borderColor: game.color, color: game.color }} // Dynamic color based on game theme
                >
                  {t(game.difficulty, { ns: 'common' })}
                </Badge>
                <Badge variant="secondary" className="text-xs font-semibold">
                  {t(game.category, { ns: 'common' })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Game Description */}
              <CardDescription className="text-center mb-6">
                {t(game.description, { ns: 'games' })}
              </CardDescription>
              {/* Conditional rendering for "Coming Soon" or "Play Game" button */}
              {game.status === 'Coming Soon' ? (
                <Button
                  className="w-full"
                  size="lg"
                  disabled // Disable button for coming soon games
                >
                  {t('common.status.coming_soon')}
                </Button>
              ) : (
                // Link to the game page if it's ready to play
                <Link to={`/game/${game.id}`} className="block">
                  <Button
                    className="w-full bg-primary hover:bg-primary-glow transition-colors"
                    size="lg"
                  >
                    {t('common.button.play_game')}
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