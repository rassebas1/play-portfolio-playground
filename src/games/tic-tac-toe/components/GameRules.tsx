import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

/**
 * GameRules component for Tic Tac Toe.
 * Displays the rules and strategy tips for playing the game.
 *
 * @returns {JSX.Element} The rendered game rules card.
 */
export const GameRules: React.FC = () => {
  const { t } = useTranslation('games/tic-tac-toe');
  const { t: tCommon } = useTranslation('common');

  // Get rules and strategy tips as arrays
  const rules = t('rules.items', { returnObjects: true }) as string[];
  const strategyTips = t('strategy.items', { returnObjects: true }) as string[];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">{tCommon('how_to_play')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 text-primary">{t('rules.title')}:</h4>
            <ul className="space-y-1 text-muted-foreground">
              {rules.map((rule, index) => (
                <li key={index}>• {rule}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-primary">{t('strategy.title')}:</h4>
            <ul className="space-y-1 text-muted-foreground">
              {strategyTips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameRules;
