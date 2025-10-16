import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface ScoreboardProps {
  score: number;
  bestScore: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ score, bestScore }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Score</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-primary">
            {score.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4" />
            Best
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-accent">
            {bestScore.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};