import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectSlide } from './ProjectSlide';

export const ProjectsCarousel: React.FC = () => {
  const { t } = useTranslation('common');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const projects = [
    {
      company: t('project_telefonica_company'),
      title: t('project_telefonica_title'),
      description: t('project_telefonica_desc'),
      period: 'Oct 2024 – Feb 2025',
      technologies: ['Angular 18', 'NgRx', 'PrimeNG', 'JWT', 'MFA', 'Azure AKS', 'Figma'],
      achievement: t('project_telefonica_achievement'),
      category: 'professional' as const,
    },
    {
      company: t('project_banco_company'),
      title: t('project_banco_title'),
      description: t('project_banco_desc'),
      period: 'Jan 2023 – Sept 2024',
      technologies: ['Angular 15', 'DataPower', 'AWS', 'CloudFront', 'OAuth 2.0', 'WSDL', 'Java 8'],
      achievement: t('project_banco_achievement'),
      category: 'professional' as const,
    },
    {
      company: t('project_biodcase_company'),
      title: t('project_biodcase_title'),
      description: t('project_biodcase_desc'),
      period: '2025',
      technologies: ['TinyML', 'Python', 'PyTorch', 'TensorFlow', 'Embedded C'],
      achievement: t('project_biodcase_achievement'),
      category: 'research' as const,
    },
  ];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  return (
    <section 
      className="py-16 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {t('projects_title')}
          </span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t('projects_subtitle')}
        </p>
      </motion.div>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group"
          aria-label="Next project"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        {/* Slides Container */}
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out">
            <AnimatePresence mode="wait">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full"
                  style={{ display: index === currentIndex ? 'block' : 'none' }}
                >
                  <ProjectSlide
                    {...project}
                    isActive={index === currentIndex}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-primary rounded-full'
                  : 'w-2 h-2 bg-muted-foreground/30 rounded-full hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
