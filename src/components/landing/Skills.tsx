import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { skillCategories, skills } from '@/utils/skills_consts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * Skills component.
 * Displays a categorized list of the user's skills and technologies.
 * It uses `useTranslation` for internationalization of category titles
 * and `framer-motion` for staggered entry animations of categories and individual skills.
 *
 * @returns {JSX.Element} The rendered skills card.
 */
export const Skills: React.FC = () => {
  // `useTranslation` hook for internationalized category titles.
  const { t } = useTranslation(['common', 'skills']);
  // Get the current language from i18n instance for dynamic content selection.


  // Framer Motion variants for the main container.
  const containerVariants = {
    hidden: { opacity: 0 }, // Initial state: invisible.
    visible: {
      opacity: 1, // Final state: fully visible.
      transition: {
        staggerChildren: 0.1, // Stagger the animation of child elements (categories).
        delayChildren: 0.1, // Delay before the first child starts animating.
      },
    },
  };

  // Framer Motion variants for each skill category.
  const categoryVariants = {
    hidden: { opacity: 0, x: 50 }, // Initial state: invisible and shifted right.
    visible: {
      opacity: 1, x: 0, // Final state: fully visible and at original position.
      transition: {
        duration: 0.4, // Animation duration for the category itself.
        staggerChildren: 0.05, // Stagger the animation of child elements (individual skills).
        delayChildren: 0.1, // Delay before the first skill in the category starts animating.
      },
    },
  };

  // Framer Motion variants for each individual skill badge.
  const itemVariants = {
    hidden: { opacity: 0, x: 20 }, // Initial state: invisible and shifted right.
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }, // Final state: fully visible and at original position.
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Skills')}</CardTitle> {/* Translated "Skills" title */}
      </CardHeader>
      {/* Main container for all skill categories, with staggered animation */}
      <motion.div 
        className="space-y-4 p-6 pt-0"
        variants={containerVariants} // Apply container animation variants.
        initial="hidden" // Start from the 'hidden' state.
        animate="visible" // Animate to the 'visible' state.
      >
        {/* Iterate through skill categories defined in `skillCategories` */}
        {Object.entries(skillCategories).map(([categoryKey, categoryNameKey]) => (
          <motion.div key={categoryKey} variants={categoryVariants}>
            {/* Category Title (translated) */}
            <h3 className="text-lg font-semibold mb-2">{t(categoryNameKey)}</h3>
            {/* Container for skill badges within the category */}
            <motion.div className="flex flex-wrap gap-2">
              {/* Iterate through skills for the current category */}
              {skills[categoryKey as keyof typeof skills].map(skillKey => (
                <motion.div key={skillKey} variants={itemVariants}>
                  <Badge variant="secondary">{t(skillKey)}</Badge> {/* Render each skill as a badge */}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};