import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const GameRules: React.FC = () => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">How to Play</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 text-primary">Rules:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Players take turns placing X or O</li>
              <li>• First player to get 3 in a row wins</li>
              <li>• Rows, columns, or diagonals count</li>
              <li>• If all cells are filled, it&apos;s a draw</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-primary">Strategy Tips:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Control the center when possible</li>
              <li>• Block opponent&apos;s winning moves</li>
              <li>• Create multiple winning opportunities</li>
              <li>• Think ahead and plan your moves</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};