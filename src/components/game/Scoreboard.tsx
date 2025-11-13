import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

/**
 * Props for the Scoreboard component.
 * @interface ScoreboardProps
 * @property {number} score - The current score to display.
 * @property {number} bestScore - The best (high) score to display.
 */
interface ScoreboardProps {
  score: number;
  bestScore: number;
}

/**
 * Scoreboard component.
 * Displays the current game score and the best (high) score in a visually appealing card format.
 *
 * @param {ScoreboardProps} { score, bestScore } - Props passed to the component.
 * @returns {JSX.Element} The rendered scoreboard.
 */
export const Scoreboard: React.FC<ScoreboardProps> = ({ score, bestScore }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Card for displaying the current score */}
      <Card className="text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Score</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-primary">
            {score.toLocaleString()} {/* Format score for readability */}
          </div>
        </CardContent>
      </Card>

      {/* Card for displaying the best (high) score */}
      <Card className="text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4" /> {/* Trophy icon */}
            Best
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-accent">
            {bestScore.toLocaleString()} {/* Format best score for readability */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};