import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Code2, Shield, Cloud, Brain } from 'lucide-react';
import { SkillCard } from './SkillCard';

export const BentoGrid: React.FC = () => {
  const { t } = useTranslation('common');

  const skillCategories = [
    {
      title: t('skills_bento_frontend_title'),
      description: t('skills_bento_frontend_desc'),
      icon: Code2,
      skills: ['Angular 18', 'React', 'Vue.js', 'TypeScript', 'Web Components'],
    },
    {
      title: t('skills_bento_backend_title'),
      description: t('skills_bento_backend_desc'),
      icon: Shield,
      skills: ['Node.js', 'DataPower', 'OAuth 2.0', 'JWT', 'REST/SOAP'],
    },
    {
      title: t('skills_bento_cloud_title'),
      description: t('skills_bento_cloud_desc'),
      icon: Cloud,
      skills: ['AWS', 'Azure AKS', 'Kubernetes', 'Docker', 'CI/CD'],
    },
    {
      title: t('skills_bento_data_title'),
      description: t('skills_bento_data_desc'),
      icon: Brain,
      skills: ['Spark', 'Hadoop', 'PyTorch', 'TensorFlow', 'Big Data'],
    },
  ];

  return (
    <section className="py-20">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {t('Skills')}
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('skills_bento_subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frontend - Large cell (spans full width on mobile, half on tablet, full on desktop) */}
        <div className="md:col-span-2 lg:col-span-2">
          <SkillCard
            {...skillCategories[0]}
            index={0}
            className="h-full"
          />
        </div>

        {/* Backend & Security */}
        <div className="md:col-span-1">
          <SkillCard
            {...skillCategories[1]}
            index={1}
            className="h-full"
          />
        </div>

        {/* Cloud & DevOps */}
        <div className="md:col-span-1">
          <SkillCard
            {...skillCategories[2]}
            index={2}
            className="h-full"
          />
        </div>

        {/* Big Data & AI - spans full width on mobile/tablet, half on desktop */}
        <div className="md:col-span-2 lg:col-span-2">
          <SkillCard
            {...skillCategories[3]}
            index={3}
            className="h-full"
          />
        </div>
      </div>
    </section>
  );
};
