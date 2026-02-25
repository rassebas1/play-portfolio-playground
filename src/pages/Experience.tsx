import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skills } from '@/components/landing/Skills';
import { ExperienceCard } from '@/components/landing/ExperienceCard';
import { motion } from 'framer-motion';

const experienceData = [
  {
    company: 'Telefónica – NTT DATA',
    title: 'nttDataTelefonica.title',
    date: 'Oct. 2024 – Feb. 2025',
    activities: [
      'nttDataTelefonica.activities.0',
      'nttDataTelefonica.activities.1',
      'nttDataTelefonica.activities.2',
    ]
  },
  {
    company: 'Banco Popular – NTT DATA',
    title: 'nttDataBancoPopular.title',
    date: 'Jan. 2023 – Sept. 2024',
    activities: [
      'nttDataBancoPopular.activities.0',
      'nttDataBancoPopular.activities.1',
      'nttDataBancoPopular.activities.2',
      'nttDataBancoPopular.activities.3',
      'nttDataBancoPopular.activities.4',
    ]
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, IBM training program',
    title: 'nttDataIbm.title',
    date: 'Oct 2022 – Nov 2022',
    activities: [
      'nttDataIbm.activities.0'
    ]
  },
  {
    company: 'NTT DATA, Bogotá, Colombia, BBVA training program',
    title: 'nttDataBbva.title',
    date: 'Aug. 2022 - Sept. 2022',
    activities: [
      'nttDataBbva.activities.0'
    ]
  },
  {
    company: '4CODERS, Bogotá, Colombia',
    title: '4coders.title',
    date: 'Set. 2021- Mar. 2022',
    activities: [
      '4coders.activities.0',
      '4coders.activities.1',
      '4coders.activities.2'
    ]
  }
];

/**
 * Experience component.
 * Displays the user's professional experience and skills.
 * Features internationalization and animations using Framer Motion.
 *
 * @returns {JSX.Element} The rendered experience page.
 */
const Experience: React.FC = () => {
  const { t } = useTranslation(['experience', 'common']);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20 pt-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t('experience_heading')}
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Skills />
        </motion.div>
        <div className="lg:col-span-2 space-y-8">
          {experienceData.map((exp, index) => (
            <motion.div
              key={exp.company + exp.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ExperienceCard 
                company={exp.company}
                title={t(exp.title)}
                date={exp.date}
                activities={exp.activities.map(activity => t(activity))}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;