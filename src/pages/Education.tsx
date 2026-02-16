import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, useScroll, useSpring } from 'framer-motion';
import { EducationCard } from '@/components/landing/EducationCard';

const educationData = [
  {
    degree: 'master.degree',
    university: 'Ramon Llull - La Salle University, Barcelona, Spain',
    years: '2025-2026',
    logo: '/LS_logo.jpg',
    hook: 'master.hook',
    skills: ['Python', 'Spark', 'Hadoop', 'Azure', 'AWS', 'GCP'],
    courses: [
        'master.courses.0',
        'master.courses.1',
        'master.courses.2',
        'master.courses.3'
    ],
    project: {
      title: 'master.project.title',
      thumbnail: '/biodcase_logo.png',
    },
    description: [
        'master.description.0',
        'master.description.1'
    ]
  },
  {
    degree: 'engineer.degree',
    university: 'Central University, Bogotá, Colombia',
    years: '2017-2022',
    logo: '/Logo_Ucentral.jpg',
    hook: 'engineer.hook',
    skills: ['C/C++', 'MATLAB', 'VHDL', 'STM32', 'PSoC'],
    courses: [
        'engineer.courses.0',
        'engineer.courses.1',
        'engineer.courses.2',
        'engineer.courses.3'
    ],
    project: {
      title: 'engineer.project.title',
      thumbnail: 'public/RateHeart.png',
    },
    description: [
        'engineer.description.0',
        'engineer.description.1'
    ]
  },
  {
    degree: 'bachelor.degree',
    university: "Lycée Français Louis Pasteur, Bogotá, Colombia",
    years: '1996-2012',
    logo: '/LF_logo.jpg',
    hook: 'bachelor.hook',
    skills: ['French', 'Physics', 'Chemistry', 'Mathematics'],
    courses: [
        'bachelor.courses.0',
        'bachelor.courses.1',
        'bachelor.courses.2',
        'bachelor.courses.3'
    ],
    project: {
      title: 'bachelor.project.title',
      thumbnail: '/placeholder.svg',
    },
    description: [
        'bachelor.description.0',
        'bachelor.description.1',
        'bachelor.description.2',
        'bachelor.description.3',
        'bachelor.description.4'
    ]
  },
];

/**
 * Education component.
 * Displays the user's educational background using a timeline-like layout.
 * It features internationalization, a loading state with skeleton placeholders,
 * and scroll-based animations for the timeline progress.
 *
 * @returns {JSX.Element} The rendered education page.
 */
const Education: React.FC = () => {
  const { t } = useTranslation(['education', 'common']);
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
            {Array.from({ length: educationData.length }).map((_, index) => (
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
            {educationData.map((edu) => (
              <EducationCard
                key={edu.degree} // Unique key for list rendering
                degree={t(edu.degree)} // Translated degree
                university={edu.university}
                years={edu.years}
                logo={edu.logo}
                hook={t(edu.hook)} // Translated hook/description
                skills={edu.skills}
                courses={edu.courses.map(course => t(course))} // Translated courses
                project={{
                  title: t(edu.project.title), // Translated project title
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
