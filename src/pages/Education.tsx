import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, useScroll, useSpring } from 'framer-motion';
import { education } from '@/utils/education_consts';
import { EducationCard } from '@/components/landing/EducationCard';

/**
 * Education component.
 * Displays the user's educational background using a timeline-like layout.
 * It features internationalization, a loading state with skeleton placeholders,
 * and scroll-based animations for the timeline progress.
 *
 * @returns {JSX.Element} The rendered education page.
 */
const Education: React.FC = () => {
  // Hook for internationalization, providing translation function `t` and i18n instance.
  const { t, i18n } = useTranslation();
  // State to manage loading status, showing skeletons while true.
  const [loading, setLoading] = useState(true);
  // Ref to the container element for scroll tracking.
  const containerRef = useRef(null);
  // `useScroll` hook from Framer Motion to track scroll progress relative to `containerRef`.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Track scroll from start of container to end of container.
  });
  // `useSpring` hook to create a smooth, spring-animated value for the scroll progress.
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const currentLanguage = i18n.language.split('-')[0] as 'en' | 'es' | 'fr';

  // Effect to simulate a loading delay and then set loading to false.
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); // Simulate a 400ms loading time.

    // Cleanup function to clear the timeout if the component unmounts.
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this effect runs once on mount.

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t('education_heading')} {/* Translated heading */}
        </h1>
      </div>
      {/* Main content area with timeline */}
      <div ref={containerRef} className="max-w-3xl mx-auto relative">
        {/* Timeline vertical line with scroll-based progress indicator */}
        <div className="absolute left-4 top-0 h-full w-1 bg-border -z-10">
          <motion.div className="h-full w-full bg-primary origin-top" style={{ scaleY }} />
        </div>
        {/* Conditional rendering: show skeletons while loading, otherwise show actual content */}
        {loading ? (
          <div className="space-y-12">
            {/* Render skeleton placeholders for each education entry */}
            {Array.from({ length: education.length }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" /> {/* Placeholder for logo */}
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-6 w-3/4" /> {/* Placeholder for degree */}
                  <Skeleton className="h-4 w-1/2" /> {/* Placeholder for university */}
                  <Skeleton className="h-4 w-1/4" /> {/* Placeholder for years */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Map through education data and render an EducationCard for each entry */}
            {education.map((edu) => (
              <EducationCard
                key={edu.degree.en} // Unique key for list rendering
                degree={edu.degree[currentLanguage]} // Translated degree
                university={edu.university}
                years={edu.years}
                logo={edu.logo}
                hook={edu.hook[currentLanguage]} // Translated hook/description
                skills={edu.skills}
                courses={edu.courses[currentLanguage]} // Translated courses
                project={{
                  title: edu.project.title[currentLanguage], // Translated project title
                  thumbnail: edu.project.thumbnail,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;
