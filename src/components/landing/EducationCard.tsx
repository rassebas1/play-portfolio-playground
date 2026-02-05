
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

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

export const EducationCard: React.FC<EducationCardProps> = ({
  degree,
  university,
  years,
  logo,
  hook,
  skills = [],
  courses = [],
  project,
}) => {
  const ref = React.useRef(null);
  const { t } = useTranslation();
  const isInView = useInView(ref, { amount: 0.5 });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0.5, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative pl-10"
    >
      {/* Timeline line and node */}
      <div className="absolute left-0 top-0 h-full w-px bg-border"></div>
      <motion.div
        className="absolute left-[-8px] top-4 h-4 w-4 rounded-full bg-primary border-2 border-background"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      ></motion.div>

      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-transparent -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      ></motion.div>

      <Card className="w-full overflow-hidden border-transparent bg-transparent shadow-none">
        <CardHeader className="flex flex-row items-start gap-4">
          <motion.div variants={itemVariants}>
            <Avatar className="h-12 w-12">
              <AvatarImage src={logo} alt={`${university} logo`} />
              <AvatarFallback>{university.charAt(0)}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-grow">
            <motion.h3 variants={itemVariants} className="text-xl font-bold">{degree}</motion.h3>
            <motion.p variants={itemVariants} className="text-muted-foreground">{university}</motion.p>
            <motion.p variants={itemVariants} className="text-sm text-muted-foreground">{years}</motion.p>
            <motion.p variants={itemVariants} className="mt-2 text-primary">{hook}</motion.p>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="mt-4 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div>
              <motion.h4 variants={itemVariants} className="font-semibold">{t('key_courses')}</motion.h4>
              <motion.ul variants={itemVariants} className="mt-2 list-disc list-inside text-muted-foreground">
                {courses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </motion.ul>
            </div>
            <div>
              <motion.h4 variants={itemVariants} className="font-semibold">{t('signature_project')}</motion.h4>
              <motion.div variants={itemVariants} className="mt-2 flex items-center gap-4">
                <img src={project.thumbnail} alt={project.title} className="h-16 w-16 rounded-md object-cover" />
                <p className="font-medium">{project.title}</p>
              </motion.div>
            </div>
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
