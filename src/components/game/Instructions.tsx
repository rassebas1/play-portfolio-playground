import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface InstructionsProps {
  children: React.ReactNode;
}

export const Instructions: React.FC<InstructionsProps> = ({ children }) => {
  return (
    <Card className="mb-6 bg-muted/30 border-primary/10">
      <CardContent className="pt-4">
        <div className="text-center space-y-2">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};