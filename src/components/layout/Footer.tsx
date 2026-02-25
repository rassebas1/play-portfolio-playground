import React from 'react';
import { Github, Linkedin, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Footer component.
 * Provides a consistent footer across the application, displaying copyright information
 * and links to the developer's GitHub and LinkedIn profiles.
 *
 * @returns {JSX.Element} The rendered footer.
 */
export const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative mt-auto py-6 w-full">
      {/* Gradient border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        {/* Copyright Information */}
        <p className="text-sm text-muted-foreground text-center md:text-left flex items-center gap-1">
          <span>© {currentYear} Sebastián Espitia Londoño.</span>
          <span className="hidden sm:inline">{t('footer.copyright')}</span>
          <span className="flex items-center gap-1 text-primary">
            Built with <Heart className="h-3 w-3 animate-pulse" />
          </span>
        </p>
        {/* Social Media Links */}
        <div className="flex gap-3">
          {/* GitHub Link */}
          <a
            href="https://github.com/rassebas1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-primary/10"
            aria-label={t('footer.github_aria_label')}
          >
            <Github className="h-5 w-5" />
          </a>
          {/* LinkedIn Link */}
          <a
            href="https://linkedin.com/in/sespitial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-primary/10"
            aria-label={t('footer.linkedin_aria_label')}
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
