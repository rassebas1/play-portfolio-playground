import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react'; // For custom bullet points

/**
 * Props for the ExperienceCard component.
 * @interface ExperienceCardProps
 * @property {string} company - The name of the company.
 * @property {string} title - The job title.
 * @property {string} date - The duration of the employment (e.g., "Jan. 2023 – Sept. 2024").
 * @property {string[]} activities - An array of key responsibilities and achievements.
 */
interface ExperienceCardProps {
  company: string;
  title: string;
  date: string;
  activities: string[];
}

/**
 * ExperienceCard component.
 * Renders a single work experience entry, displaying the company name, job title,
 * employment dates, and a list of key activities/achievements.
 * It uses a `Card` component for styling and `CheckCircle` icons for bullet points.
 *
 * @param {ExperienceCardProps} { company, title, date, activities } - Props passed to the component.
 * @returns {JSX.Element} The rendered experience card.
 */
export const ExperienceCard: React.FC<ExperienceCardProps> = ({ company, title, date, activities }) => {
  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            {/* Company Name */}
            <CardTitle className="text-xl font-semibold text-primary">{company}</CardTitle>
            {/* Job Title */}
            <p className="text-muted-foreground text-base">{title}</p>
          </div>
          {/* Employment Dates */}
          <p className="text-muted-foreground text-sm whitespace-nowrap">{date}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* List of Activities/Achievements */}
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start text-muted-foreground">
              {/* Custom bullet point icon */}
              <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-green-500" />
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};