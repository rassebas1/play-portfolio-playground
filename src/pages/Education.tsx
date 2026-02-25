import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
 * Features internationalization and scroll-based animations for the timeline progress.
 *
 * @returns {JSX.Element} The rendered education page.
 */
const Education: React.FC = () => {
  const { t } = useTranslation(['education', 'common']);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20 pt-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t('education_heading')}
        </h1>
      </div>
      <div ref={containerRef} className="max-w-3xl mx-auto relative">
        <div className="absolute left-4 top-0 h-full w-1 bg-border -z-10">
          <motion.div className="h-full w-full bg-primary origin-top" style={{ scaleY }} />
        </div>
        <div className="space-y-12">
          {educationData.map((edu) => (
            <EducationCard
              key={edu.degree}
              degree={t(edu.degree)}
              university={edu.university}
              years={edu.years}
              logo={edu.logo}
              hook={t(edu.hook)}
              skills={edu.skills}
              courses={edu.courses.map(course => t(course))}
              project={{
                title: t(edu.project.title),
                thumbnail: edu.project.thumbnail,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
