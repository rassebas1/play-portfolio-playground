import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const categoryColors: Record<string, string> = {
  Languages: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800',
  Frontend: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800',
  'Backend & APIs': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800',
  'Cloud & DevOps': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 border-orange-200 dark:border-orange-800',
  'Tools & Platforms': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100 border-pink-200 dark:border-pink-800',
  Methodologies: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100 border-cyan-200 dark:border-cyan-800',
};

const skillCategoriesData = {
  Languages: 'category.languages',
  Frontend: 'category.frontend',
  'Backend & APIs': 'category.backend_apis',
  'Cloud & DevOps': 'category.cloud_devops',
  'Tools & Platforms': 'category.tools_platforms',
  Methodologies: 'category.methodologies',
};

const skillsData = {
  Languages: [
    'language.typescript',
    'language.javascript',
    'language.python',
    'language.java',
    'language.sql',
    'language.html_css',
    'language.c_cpp',
  ],
  Frontend: [
    'frontend.react',
    'frontend.vue',
    'frontend.angular',
    'frontend.lit_elements',
    'frontend.web_components',
    'frontend.jsx',
  ],
  'Backend & APIs': [
    'backend_apis.nodejs',
    'backend_apis.rest',
    'backend_apis.soap',
    'backend_apis.protobuf',
    'backend_apis.wsdl',
    'backend_apis.swagger_openapi_yaml',
  ],
  'Cloud & DevOps': [
    'cloud_devops.azure',
    'cloud_devops.aws',
    'cloud_devops.kubernetes',
    'cloud_devops.docker',
    'cloud_devops.git',
    'cloud_devops.svn',
  ],
  'Tools & Platforms': [
    'tools_platforms.ibm_datapower',
    'tools_platforms.weblogic',
    'tools_platforms.jmeter',
    'tools_platforms.vite',
    'tools_platforms.webpack',
    'tools_platforms.rollup',
    'tools_platforms.figma',
  ],
  Methodologies: [
    'methodologies.agile_scrum',
    'methodologies.ci_cd',
    'methodologies.micro_frontends',
    'methodologies.system_architecture',
  ],
};

/**
 * Skills component.
 * Displays a categorized list of the user's skills and technologies.
 * It uses `useTranslation` for internationalization of category titles
 * and `framer-motion` for staggered entry animations of categories and individual skills.
 *
 * @returns {JSX.Element} The rendered skills card.
 */
export const Skills: React.FC = () => {
  const { t } = useTranslation(['skills', 'common']);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1, x: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <Card className="overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <CardHeader>
        <CardTitle className="group-hover:text-primary transition-colors">{t('Skills')}</CardTitle>
      </CardHeader>
      <motion.div 
        className="space-y-4 p-6 pt-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Object.entries(skillCategoriesData).map(([categoryKey, categoryNameKey]) => (
          <motion.div key={categoryKey} variants={categoryVariants}>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${categoryColors[categoryKey]?.split(' ')[0]} bg-current`} />
              {t(categoryNameKey)}
            </h3>
            <motion.div className="flex flex-wrap gap-2">
              {skillsData[categoryKey as keyof typeof skillsData].map(skillKey => (
                <motion.div key={skillKey} variants={itemVariants}>
                  <Badge 
                    className={`${categoryColors[categoryKey]} border hover:scale-105 transition-transform cursor-default`}
                  >
                    {t(skillKey)}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};