import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react'; // For custom bullet points

interface ExperienceCardProps {
  company: string;
  title: string;
  date: string;
  activities: string[];
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ company, title, date, activities = [] }) => {
  console.log(activities)
  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">{company}</CardTitle>
            <p className="text-muted-foreground text-base">{title}</p>
          </div>
          <p className="text-muted-foreground text-sm whitespace-nowrap">{date}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-green-500" />
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};