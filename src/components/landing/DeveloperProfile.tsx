import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * DeveloperProfile component.
 * Displays the developer's name, title, and a brief description,
 * along with an avatar, all within a card component.
 * It uses `useTranslation` for internationalization of the title and description.
 *
 * @returns {JSX.Element} The rendered developer profile card.
 */
export const DeveloperProfile: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      <div className="relative bg-card m-0.5 rounded-xl">
        <CardHeader className="text-center">
          {/* Developer Avatar with ring effect */}
          <div className="relative inline-block">
            <Avatar className="w-28 h-28 mx-auto mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 group-hover:scale-105">
              <AvatarImage src="https://github.com/rassebas1.png" alt="Sebastián Espitia Londoño" />
              <AvatarFallback className="text-xl">SEL</AvatarFallback>
            </Avatar>
            {/* Status indicator */}
            <span className="absolute bottom-4 right-1/2 translate-x-8 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
          </div>
          {/* Developer's Name */}
          <CardTitle className="text-2xl group-hover:text-primary transition-colors">Sebastián Espitia Londoño</CardTitle>
          {/* Developer's Title (translated) */}
          <p className="text-muted-foreground font-medium">{t('developer_title')}</p>
        </CardHeader>
        <CardContent>
          {/* Developer's Description (translated) */}
          <p className="text-center text-muted-foreground leading-relaxed">
            {t('developer_description')}
          </p>
        </CardContent>
      </div>
    </Card>
  );
};