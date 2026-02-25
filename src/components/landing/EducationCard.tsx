import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { BookOpen, Award, Sparkles, School } from 'lucide-react';

interface EducationCardProps {
  degree: string;
  university: string;
  years: string;
  logo: string;
  hook: string;
  skills: string[];
  courses: string[];
  project: {
    title: string;
    thumbnail: string;
  };
  align?: 'left' | 'right';
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, x: 0 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.2,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.5,
    },
  }),
};

export const EducationCard: React.FC<EducationCardProps> = ({
  degree,
  university,
  years,
  logo,
  hook,
  skills = [],
  courses = [],
  project,
  align = 'left',
  index = 0,
}) => {
  const ref = React.useRef(null);
  const { t } = useTranslation('common');
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isLeft = align === 'left';

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
    >
      {/* Timeline node */}
      <motion.div 
        className="absolute left-1/2 top-8 -translate-x-1/2 z-20"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: 0.2 + index * 0.2, duration: 0.4, type: "spring" }}
      >
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_rgba(142,76,36,0.6)]" />
          <motion.div 
            className="absolute inset-0 rounded-full bg-primary"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Card */}
      <div className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}>
        <motion.div
          className="group relative glass-card rounded-2xl overflow-hidden"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Ambient glow on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
          </div>

          {/* Content */}
          <div className="relative p-6 sm:p-8">
            {/* Header with logo and year */}
            <motion.div 
              className="flex items-start justify-between gap-4 mb-6"
              custom={0}
              variants={itemVariants}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-border">
                    <img 
                      src={logo} 
                      alt={`${university} logo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('span');
                        fallback.className = 'text-muted-foreground font-bold text-xl';
                        fallback.textContent = university.charAt(0);
                        target.parentElement?.appendChild(fallback);
                      }}
                    />
                  </div>
                  <motion.div 
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                  >
                    <School className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                </div>
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                    {years}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Degree and hook */}
            <motion.div custom={1} variants={itemVariants}>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {degree}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">{university}</p>
              <div className="flex items-center gap-2 text-primary/80">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">{hook}</span>
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div 
              className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-6"
              custom={2}
              variants={itemVariants}
            />

            {/* Skills */}
            <motion.div custom={3} variants={itemVariants}>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{t('Skills', { ns: 'common' })}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6 + index * 0.2 + i * 0.05 }}
                  >
                    <Badge 
                      variant="secondary"
                      className="group-hover:bg-primary/20 group-hover:text-primary transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Key Courses */}
            <motion.div custom={4} variants={itemVariants} className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{t('key_courses', { ns: 'common' })}</span>
              </div>
              <ul className="space-y-2">
                {courses.slice(0, 3).map((course, i) => (
                  <motion.li 
                    key={course}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.7 + index * 0.2 + i * 0.1 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
                    <span>{course}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Project */}
            <motion.div custom={5} variants={itemVariants} className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{t('signature_project', { ns: 'common' })}</span>
              </div>
              <motion.div 
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 group-hover:bg-muted/80 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <p className="text-sm font-medium text-foreground">{project.title}</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
