import React, { useState, useEffect } from 'react';
import { Skills } from '@/components/landing/Skills';
import { ExperienceCard } from '@/components/landing/ExperienceCard';
import { experiences } from '@/utils/experience_consts';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const Experience: React.FC = () => {
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingExperiences, setLoadingExperiences] = useState(true);

  useEffect(() => {
    // Simulate loading for Skills section (faster)
    const skillsTimer = setTimeout(() => {
      setLoadingSkills(false);
    }, 200); // Skills load after 0.5 seconds

    // Simulate loading for Experiences section after skills have loaded
    const experiencesTimer = setTimeout(() => {
      setLoadingExperiences(false);
    }, 400); // Experiences load 0.5 seconds after skills (500 + 500 = 1000 total)

    return () => {
      clearTimeout(skillsTimer);
      clearTimeout(experiencesTimer);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Experience & Skills
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loadingSkills ? 0 : 1, y: loadingSkills ? 20 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {loadingSkills ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, categoryIndex) => (
                <div key={categoryIndex} className="space-y-2">
                  <Skeleton className="h-6 w-2/3" /> {/* Category title */}
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-8 w-1/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Skills />
          )}
        </motion.div>
        <div 
          className="lg:col-span-2 space-y-8"
        >
          {loadingExperiences ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            experiences.map((exp, index) => (
              <div
                key={exp.company + exp.title}
                className="animate-fade-in opacity-0"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <ExperienceCard 
                  company={exp.company}
                  title={exp.title}
                  date={exp.date}
                  activities={exp.activities}
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