import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const DeveloperProfile: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src="https://github.com/rassebas1.png" alt="Sebastián Espitia Londoño" />
          <AvatarFallback>SEL</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl">Sebastián Espitia Londoño</CardTitle>
        <p className="text-muted-foreground">{t('developer_title')}</p>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          {t('developer_description')}
        </p>
      </CardContent>
    </Card>
  );
};