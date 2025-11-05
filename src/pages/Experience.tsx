import React from 'react';
import { Skills } from '@/components/landing/Skills';
import { ExperienceCard } from '@/components/landing/ExperienceCard';
import { experiences } from '@/utils/experience_consts';

const Experience: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Experience & Skills
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Skills />
        </div>
        <div className="lg:col-span-2 space-y-8">
          {experiences.map((exp, index) => (
            <ExperienceCard 
              key={index}
              company={exp.company}
              title={exp.title}
              date={exp.date}
              activities={exp.activities}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;