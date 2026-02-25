import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SkillCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  skills: string[];
  index: number;
  className?: string;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  title,
  description,
  icon: Icon,
  skills,
  index,
  className = '',
}) => {
  return (
    <motion.div
      className={`glass-card rounded-xl p-6 bento-cell corner-accent group hover:-translate-y-1 transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-125 transition-all" />
      </div>

      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="text-xs px-2.5 py-1 rounded-full bg-secondary/50 text-secondary-foreground/80 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
