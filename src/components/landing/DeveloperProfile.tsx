import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const DeveloperProfile: React.FC = () => {
  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src="https://github.com/rassebas1.png" alt="Sebastián Espitia Londoño" />
          <AvatarFallback>SEL</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl">Sebastián Espitia Londoño</CardTitle>
        <p className="text-muted-foreground">Lead Full-Stack Engineer</p>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Lead Full-Stack Engineer with a background in Electronics Engineering and current Big Data specialization. Expertise spans modern web architectures, secure integration platforms, and cloud-native solutions, with proven success in leading digital transformation for major financial and telecommunications clients.
        </p>
      </CardContent>
    </Card>
  );
};