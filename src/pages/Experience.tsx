import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Skills } from '@/components/landing/Skills';
import { ExperienceCard } from '@/components/landing/ExperienceCard';
import { Skeleton } from '@/components/ui/skeleton';
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
 * It features internationalization, separate loading states with skeleton placeholders
 * for skills and experience entries, and animations using Framer Motion.
 *
 * @returns {JSX.Element} The rendered experience page.
 */
const Experience: React.FC = () => {
  const { t } = useTranslation(['experience', 'common']);
  const [loadingSkills, setLoadingSkills] = useState(true);
  // State to manage loading status for the Experience section.
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  console.log('Experience component rendered. Loading states - Skills:', loadingSkills, 'Experiences:', loadingExperiences);
  console.log('Experience data:', experienceData);
  useEffect(() => {
    // Simulate loading for Skills section (faster load).
    const skillsTimer = setTimeout(() => {
      setLoadingSkills(false);
    }, 200); // Skills load after 200ms.

    // Simulate loading for Experiences section after skills have loaded.
    const experiencesTimer = setTimeout(() => {
      setLoadingExperiences(false);
    }, 400); // Experiences load 400ms after skills (total 600ms from component mount).

    // Cleanup function to clear timeouts if the component unmounts.
    return () => {
      clearTimeout(skillsTimer);
      clearTimeout(experiencesTimer);
    };
  }, []); // Empty dependency array means this effect runs once on mount.

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t('experience_heading')} {/* Translated heading */}
        </h1>
      </div>
      {/* Main content area, divided into skills and experience sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skills Section */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }} // Initial animation state
          // Animate to full opacity and original position once skills are loaded
          animate={{ opacity: loadingSkills ? 0 : 1, y: loadingSkills ? 20 : 0 }}
          transition={{ duration: 0.5 }} // Animation duration
        >
          {loadingSkills ? (
            // Render skeleton placeholders for the Skills section while loading
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, categoryIndex) => (
                <div key={categoryIndex} className="space-y-2">
                  <Skeleton className="h-6 w-2/3" /> {/* Placeholder for category title */}
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-1/4" /> {/* Placeholder for skill badges */}
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-8 w-1/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Render the actual Skills component once loaded
            <Skills />
          )}
        </motion.div>
        {/* Experience Cards Section */}
        <div 
          className="lg:col-span-2 space-y-8"
        >
          {loadingExperiences ? (
            // Render skeleton placeholders for experience cards while loading
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-6 w-1/2" /> {/* Placeholder for company/title */}
                <Skeleton className="h-4 w-3/4" /> {/* Placeholder for date */}
                <Skeleton className="h-4 w-full" /> {/* Placeholder for activity lines */}
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            // Map through experience data and render an ExperienceCard for each entry
            experienceData.map((exp, index) => (
              <div
                key={exp.company + exp.title} // Unique key for list rendering
                className="animate-fade-in opacity-0" // Apply fade-in animation
                style={{
                  animationDelay: `${index * 150}ms`, // Stagger animation for each card
                  animationFillMode: 'forwards' // Keep the end state of the animation
                }}
              >
                <ExperienceCard 
                  company={exp.company}
                  title={t(exp.title)} // Translated job title
                  date={exp.date}
                  activities={exp.activities.map(activity => t(activity))} // Translated activities
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Experience;