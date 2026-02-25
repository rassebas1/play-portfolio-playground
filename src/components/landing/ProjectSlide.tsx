import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy } from 'lucide-react';

interface ProjectSlideProps {
  company: string;
  title: string;
  description: string;
  period: string;
  technologies: string[];
  achievement?: string;
  category: 'professional' | 'research';
  isActive: boolean;
}

export const ProjectSlide: React.FC<ProjectSlideProps> = ({
  company,
  title,
  description,
  period,
  technologies,
  achievement,
  category,
  isActive,
}) => {
  return (
    <motion.div
      className="flex-shrink-0 w-full px-4"
      initial={{ opacity: 0, x: 100 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        x: isActive ? 0 : 100 
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="glass-card rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                category === 'research' 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {company}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-primary mt-1">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{period}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs rounded-full bg-secondary/50 text-secondary-foreground/80"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Achievement */}
        {achievement && (
          <div className="flex items-center gap-2 text-primary font-medium">
            <Trophy className="w-5 h-5" />
            <span>{achievement}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
