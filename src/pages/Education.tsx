import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
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

const Education: React.FC = () => {
  const { t } = useTranslation(['education', 'common']);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-radial-glow" />
      
      {/* Floating gradient orbs */}
      <motion.div 
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block text-sm font-medium text-primary/80 tracking-[0.3em] uppercase mb-4"
          >
            {t('academic_journey', { ns: 'common' })}
          </motion.span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary/60 bg-clip-text text-transparent">
              {t('education_heading')}
            </span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t('education_subtitle', { ns: 'common' })}
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <motion.div 
              className="h-full w-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"
              style={{ scaleY }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_20px_rgba(142,76,36,0.5)]" />
          </div>

          {/* Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-32"
          >
            {educationData.map((edu, index) => (
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
                align={index % 2 === 0 ? 'left' : 'right'}
                index={index}
              />
            ))}
          </motion.div>
        </div>

        {/* Decorative end element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center mt-32"
        >
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(142,76,36,0.8)]" />
        </motion.div>
      </div>
    </div>
  );
};

export default Education;
