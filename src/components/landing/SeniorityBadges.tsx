import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Beaker, FlaskConical, Palette, Clipboard, Zap, GitBranch } from 'lucide-react';
import { BadgeItem } from './BadgeItem';

export const SeniorityBadges: React.FC = () => {
  const { t } = useTranslation('common');

  const badges = [
    {
      title: t('badge_owasp_title'),
      description: t('badge_owasp_desc'),
      icon: Shield,
      category: 'security' as const,
    },
    {
      title: t('badge_mfa_title'),
      description: t('badge_mfa_desc'),
      icon: Lock,
      category: 'security' as const,
    },
    {
      title: t('badge_eslint_title'),
      description: t('badge_eslint_desc'),
      icon: CheckCircle,
      category: 'quality' as const,
    },
    {
      title: t('badge_unit_testing_title'),
      description: t('badge_unit_testing_desc'),
      icon: Beaker,
      category: 'quality' as const,
    },
    {
      title: t('badge_integration_testing_title'),
      description: t('badge_integration_testing_desc'),
      icon: FlaskConical,
      category: 'quality' as const,
    },
    {
      title: t('badge_figma_title'),
      description: t('badge_figma_desc'),
      icon: Palette,
      category: 'tools' as const,
    },
    {
      title: t('badge_jira_title'),
      description: t('badge_jira_desc'),
      icon: Clipboard,
      category: 'tools' as const,
    },
    {
      title: t('badge_cicd_title'),
      description: t('badge_cicd_desc'),
      icon: Zap,
      category: 'tools' as const,
    },
    {
      title: t('badge_git_title'),
      description: t('badge_git_desc'),
      icon: GitBranch,
      category: 'tools' as const,
    },
  ];

  return (
    <section className="py-16">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {t('badges_title')}
          </span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t('badges_subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
        {badges.map((badge, index) => (
          <BadgeItem
            key={badge.title}
            {...badge}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};
