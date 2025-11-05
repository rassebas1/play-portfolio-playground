import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { skills } from '@/utils/skills_consts';


export const Skills: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map(item => (
                <Badge key={item} variant="secondary">{item}</Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};