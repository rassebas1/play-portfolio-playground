import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProjectCategory = 'all' | 'academic' | 'professional' | 'research';

const projectsData = [
  // Academic
  {
    id: 'mammography',
    titleKey: 'project_academic_mammography_title',
    descriptionKey: 'project_academic_mammography_desc',
    period: '2021-2022',
    techKey: 'project_academic_mammography_tech',
    achievementKey: 'project_academic_mammography_achievement',
    category: 'academic' as const,
    demoLink: '',
    repoLink: '',
  },
  {
    id: 'fingerprint',
    titleKey: 'project_academic_fingerprint_title',
    descriptionKey: 'project_academic_fingerprint_desc',
    period: '2021-2022',
    techKey: 'project_academic_fingerprint_tech',
    achievementKey: 'project_academic_fingerprint_achievement',
    category: 'academic' as const,
    demoLink: '',
    repoLink: '',
  },
  {
    id: 'linefollower',
    titleKey: 'project_academic_linefollower_title',
    descriptionKey: 'project_academic_linefollower_desc',
    period: '2021',
    techKey: 'project_academic_linefollower_tech',
    achievementKey: 'project_academic_linefollower_achievement',
    category: 'academic' as const,
    demoLink: '',
    repoLink: '',
  },
  {
    id: 'propeller',
    titleKey: 'project_academic_propeller_title',
    descriptionKey: 'project_academic_propeller_desc',
    period: '2020',
    techKey: 'project_academic_propeller_tech',
    achievementKey: '',
    category: 'academic' as const,
    demoLink: '',
    repoLink: '',
  },
  {
    id: 'voice',
    titleKey: 'project_academic_voice_title',
    descriptionKey: 'project_academic_voice_desc',
    period: '2022',
    techKey: 'project_academic_voice_tech',
    achievementKey: 'project_academic_voice_achievement',
    category: 'academic' as const,
    demoLink: '',
    repoLink: '',
  },
  {
    id: 'dssc',
    titleKey: 'project_academic_dssc_title',
    descriptionKey: 'project_academic_dssc_desc',
    period: '2022-2023',
    techKey: 'project_academic_dssc_tech',
    achievementKey: 'project_academic_dssc_achievement',
    category: 'academic' as const,
    demoLink: '',
    repoLink: '',
  },
  {
    id: 'secgle',
    titleKey: 'project_academic_secgle_title',
    descriptionKey: 'project_academic_secgle_desc',
    period: '2021',
    techKey: 'project_academic_secgle_tech',
    achievementKey: 'project_academic_secgle_achievement',
    category: 'academic' as const,
    demoLink: '',
    repoLink: '',
  },
  // Professional
  {
    id: 'telefonica',
    titleKey: 'project_telefonica_title',
    descriptionKey: 'project_telefonica_desc',
    period: 'Oct 2024 – Feb 2025',
    techKey: 'project_telefonica_tech',
    achievementKey: 'project_telefonica_achievement',
    category: 'professional' as const,
    demoLink: '',
    repoLink: '',
  },
  {
    id: 'banco',
    titleKey: 'project_banco_title',
    descriptionKey: 'project_banco_desc',
    period: 'Jan 2023 – Sept 2024',
    techKey: 'project_banco_tech',
    achievementKey: 'project_banco_achievement',
    category: 'professional' as const,
    demoLink: '',
    repoLink: '',
  },
  // Research
  {
    id: 'biodcase',
    titleKey: 'project_biodcase_title',
    descriptionKey: 'project_biodcase_desc',
    period: '2025',
    techKey: 'project_biodcase_tech',
    achievementKey: 'project_biodcase_achievement',
    category: 'research' as const,
    demoLink: '',
    repoLink: '',
  },
];

interface ProjectCardProps {
  project: typeof projectsData[0];
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { t } = useTranslation('common');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'research':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'academic':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'professional':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'research':
        return t('projects_category_research');
      case 'academic':
        return t('projects_category_academic');
      case 'professional':
      default:
        return t('projects_category_professional');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group"
    >
      {/* Category tag */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          'px-2 py-0.5 rounded text-xs font-medium border',
          getCategoryColor(project.category)
        )}>
          {getCategoryLabel(project.category)}
        </span>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Calendar className="w-3 h-3" />
          <span>{project.period}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors">
        {t(project.titleKey)}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {t(project.descriptionKey)}
      </p>

      {/* Achievement */}
      {project.achievementKey && t(project.achievementKey) && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-accent">
            {t(project.achievementKey)}
          </span>
        </div>
      )}

      {/* Technologies */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {t(project.techKey).split(', ').map((tech, i) => (
          <span
            key={i}
            className="px-2 py-0.5 bg-muted/50 rounded text-xs text-muted-foreground"
          >
            {tech.trim()}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3">
        {project.demoLink && (
          <a
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            {t('projects_view_demo')}
          </a>
        )}
        {project.repoLink && (
          <a
            href={project.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Github className="w-3 h-3" />
            {t('projects_view_code')}
          </a>
        )}
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const { t } = useTranslation('common');
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const filteredProjects = activeCategory === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === activeCategory);

  const categories: { key: ProjectCategory; label: string }[] = [
    { key: 'all', label: t('projects_category_all') },
    { key: 'academic', label: t('projects_category_academic') },
    { key: 'professional', label: t('projects_category_professional') },
    { key: 'research', label: t('projects_category_research') },
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-50" />
      <div className="absolute inset-0 bg-radial-glow" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {t('projects_page_title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('projects_page_subtitle')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeCategory === cat.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;