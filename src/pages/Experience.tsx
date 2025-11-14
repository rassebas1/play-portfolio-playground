import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Skills } from '@/components/landing/Skills';
import { ExperienceCard } from '@/components/landing/ExperienceCard';
import { experiences } from '@/utils/experience_consts';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

/**
 * Experience component.
 * Displays the user's professional experience and skills.
 * It features internationalization, separate loading states with skeleton placeholders
 * for skills and experience entries, and animations using Framer Motion.
 *
 * @returns {JSX.Element} The rendered experience page.
 */
const Experience: React.FC = () => {
  // Hook for internationalization, providing translation function `t` and i18n instance.
  const { t, i18n } = useTranslation();
  // State to manage loading status for the Skills section.
  const [loadingSkills, setLoadingSkills] = useState(true);
  // State to manage loading status for the Experience section.
  const [loadingExperiences, setLoadingExperiences] = useState(true);

  // Get the current language from i18n instance for dynamic content selection.
  const currentLanguage = i18n.language as 'en' | 'es' | 'fr';

  // Effect to simulate loading delays for different sections.
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
            experiences.map((exp, index) => (
              <div
                key={exp.company + exp.title.en} // Unique key for list rendering
                className="animate-fade-in opacity-0" // Apply fade-in animation
                style={{
                  animationDelay: `${index * 150}ms`, // Stagger animation for each card
                  animationFillMode: 'forwards' // Keep the end state of the animation
                }}
              >
                <ExperienceCard 
                  company={exp.company}
                  title={exp.title[currentLanguage]} // Translated job title
                  date={exp.date}
                  activities={exp.activities[currentLanguage]} // Translated activities
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