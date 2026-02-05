
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, useScroll, useSpring } from 'framer-motion';
import { education } from '@/utils/education_consts';
import { EducationCard } from '@/components/landing/EducationCard';

const Education: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
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

  const currentLanguage = i18n.language.split('-')[0] as 'en' | 'es' | 'fr';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          {t('education_heading')}
        </h1>
      </div>
      <div ref={containerRef} className="max-w-3xl mx-auto relative">
        {/* Timeline with progress */}
        <div className="absolute left-4 top-0 h-full w-1 bg-border -z-10">
          <motion.div className="h-full w-full bg-primary origin-top" style={{ scaleY }} />
        </div>
        {loading ? (
          <div className="space-y-12">
            {Array.from({ length: education.length }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {education.map((edu) => (
              <EducationCard
                key={edu.degree.en}
                degree={edu.degree[currentLanguage]}
                university={edu.university}
                years={edu.years}
                logo={edu.logo}
                hook={edu.hook[currentLanguage]}
                skills={edu.skills}
                courses={edu.courses[currentLanguage]}
                project={{
                  title: edu.project.title[currentLanguage],
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
