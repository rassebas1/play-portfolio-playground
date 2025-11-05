import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExperienceCardProps {
  company: string;
  title: string;
  date: string;
  activities: string[];
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ company, title, date, activities }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{company}</CardTitle>
            <p className="text-muted-foreground">{title}</p>
          </div>
          <p className="text-muted-foreground text-sm">{date}</p>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          {activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};