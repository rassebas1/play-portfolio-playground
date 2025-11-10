import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { skillCategories, skills } from '@/utils/skills_consts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Skills: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'es' | 'fr';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger categories
        delayChildren: 0.1, // Delay before first category starts
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1, x: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05, // Stagger skills within category
        delayChildren: 0.1, // Delay before first skill starts
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Skills')}</CardTitle>
      </CardHeader>
      <motion.div 
        className="space-y-4 p-6 pt-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Object.entries(skillCategories).map(([categoryKey, categoryNames]) => (
          <motion.div key={categoryKey} variants={categoryVariants}>
            <h3 className="text-lg font-semibold mb-2">{categoryNames[currentLanguage]}</h3>
            <motion.div className="flex flex-wrap gap-2">
              {skills[categoryKey as keyof typeof skills].map(item => (
                <motion.div key={item} variants={itemVariants}>
                  <Badge variant="secondary">{item}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};