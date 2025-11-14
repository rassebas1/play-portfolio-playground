import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

/**
 * Props for the EducationCard component.
 * @interface EducationCardProps
 * @property {string} degree - The degree obtained (e.g., "Master of Science in Big Data").
 * @property {string} university - The name and location of the university.
 * @property {string} years - The period of study (e.g., "2025-2026").
 * @property {string} logo - URL or path to the university's logo.
 * @property {string} hook - A brief, catchy description or focus of the study.
 * @property {string[]} skills - An array of relevant skills acquired.
 * @property {string[]} courses - An array of key courses taken.
 * @property {object} project - Details about a signature project.
 * @property {string} project.title - The title of the project.
 * @property {string} project.thumbnail - URL or path to the project's thumbnail image.
 */
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
}

/**
 * EducationCard component.
 * Renders a single educational entry with details such as degree, university,
 * years, logo, key courses, skills, and a signature project.
 * It uses `framer-motion` for scroll-triggered animations to reveal content.
 *
 * @param {EducationCardProps} props - Props passed to the component.
 * @returns {JSX.Element} The rendered education card.
 */
export const EducationCard: React.FC<EducationCardProps> = ({
  degree,
  university,
  years,
  logo,
  hook,
  skills,
  courses,
  project,
}) => {
  // Ref to attach to the main div for `useInView` to track visibility.
  const ref = React.useRef(null);
  // `useTranslation` hook for internationalized labels.
  const { t } = useTranslation();
  // `useInView` hook from Framer Motion to detect when the component is in the viewport.
  const isInView = useInView(ref, { amount: 0.5 }); // Trigger when 50% of the component is visible.

  // Variants for Framer Motion animations (though not directly used with `variants` prop here,
  // the `animate` prop uses similar logic).
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref} // Attach ref for scroll-triggered animations.
      initial={{ opacity: 0, y: 50 }} // Initial state for animation.
      // Animate based on `isInView` status.
      animate={{ opacity: isInView ? 1 : 0.5, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }} // Animation properties.
      className="relative pl-10" // Padding for timeline line.
    >
      {/* Timeline vertical line (background) */}
      <div className="absolute left-0 top-0 h-full w-px bg-border"></div>
      {/* Timeline node (animated circle) */}
      <motion.div
        className="absolute left-[-8px] top-4 h-4 w-4 rounded-full bg-primary border-2 border-background"
        initial={{ scale: 0 }} // Initial scale for node animation.
        animate={isInView ? { scale: 1 } : { scale: 0 }} // Animate scale based on visibility.
        transition={{ delay: 0.2, duration: 0.4 }} // Animation properties.
      ></motion.div>

      {/* Animated background gradient for the card */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-transparent -z-10"
        initial={{ opacity: 0 }} // Initial opacity for gradient animation.
        animate={{ opacity: isInView ? 1 : 0 }} // Animate opacity based on visibility.
        transition={{ duration: 0.5 }} // Animation properties.
      ></motion.div>

      <Card className="w-full overflow-hidden border-transparent bg-transparent shadow-none">
        <CardHeader className="flex flex-row items-start gap-4">
          {/* University Logo/Avatar */}
          <motion.div variants={itemVariants}>
            <Avatar className="h-12 w-12">
              <AvatarImage src={logo} alt={`${university} logo`} />
              <AvatarFallback>{university.charAt(0)}</AvatarFallback>
            </Avatar>
          </motion.div>
          {/* Degree, University, Years, and Hook */}
          <div className="flex-grow">
            <motion.h3 variants={itemVariants} className="text-xl font-bold">{degree}</motion.h3>
            <motion.p variants={itemVariants} className="text-muted-foreground">{university}</motion.p>
            <motion.p variants={itemVariants} className="text-sm text-muted-foreground">{years}</motion.p>
            <motion.p variants={itemVariants} className="mt-2 text-primary">{hook}</motion.p>
          </div>
        </CardHeader>
        <CardContent>
          {/* Animated content section */}
          <motion.div
            className="mt-4 space-y-4"
            initial={{ opacity: 0, y: 20 }} // Initial state for content animation.
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }} // Animate based on visibility.
            transition={{ delay: 0.2, duration: 0.4 }} // Animation properties.
          >
            {/* Key Courses Section */}
            <div>
              <motion.h4 variants={itemVariants} className="font-semibold">{t('key_courses')}</motion.h4>
              <motion.ul variants={itemVariants} className="mt-2 list-disc list-inside text-muted-foreground">
                {courses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </motion.ul>
            </div>
            {/* Signature Project Section */}
            <div>
              <motion.h4 variants={itemVariants} className="font-semibold">{t('signature_project')}</motion.h4>
              <motion.div variants={itemVariants} className="mt-2 flex items-center gap-4">
                <img src={project.thumbnail} alt={project.title} className="h-16 w-16 rounded-md object-cover" />
                <p className="font-medium">{project.title}</p>
              </motion.div>
            </div>
            {/* Skills Section */}
            <div>
              <motion.h4 variants={itemVariants} className="font-semibold">{t('Skills')}</motion.h4>
              <motion.div variants={itemVariants} className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
