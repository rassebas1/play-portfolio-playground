import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Briefcase } from 'lucide-react';

interface ExperienceCardProps {
  company: string;
  title: string;
  date: string;
  activities: string[];
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ company, title, date, activities }) => {
  return (
    <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-primary">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="h-4 w-4 text-primary" />
              <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">{company}</CardTitle>
            </div>
            <p className="text-muted-foreground text-base">{title}</p>
          </div>
          <p className="text-sm text-muted-foreground whitespace-nowrap bg-muted px-3 py-1 rounded-full text-xs font-medium">
            {date}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start text-muted-foreground group/item">
              <CheckCircle className="h-4 w-4 mr-3 mt-1 flex-shrink-0 text-green-500 group-hover/item:text-green-400 transition-colors" />
              <span className="leading-relaxed">{activity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};