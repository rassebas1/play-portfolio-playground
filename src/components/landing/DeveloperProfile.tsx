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
  // `useTranslation` hook provides access to the translation function `t`.
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="text-center">
        {/* Developer Avatar */}
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src="https://github.com/rassebas1.png" alt="Sebastián Espitia Londoño" />
          <AvatarFallback>SEL</AvatarFallback> {/* Fallback text if image fails to load */}
        </Avatar>
        {/* Developer's Name */}
        <CardTitle className="text-2xl">Sebastián Espitia Londoño</CardTitle>
        {/* Developer's Title (translated) */}
        <p className="text-muted-foreground">{t('developer_title')}</p>
      </CardHeader>
      <CardContent>
        {/* Developer's Description (translated) */}
        <p className="text-center text-muted-foreground">
          {t('developer_description')}
        </p>
      </CardContent>
    </Card>
  );
};