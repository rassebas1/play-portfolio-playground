import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Github, Linkedin, Gamepad2, ArrowDown, FileDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getOrCreateSessionId(): string {
  const STORAGE_KEY = 'portfolio_session_id'
  const existing = localStorage.getItem(STORAGE_KEY)
  if (existing) return existing
  
  const newId = crypto.randomUUID()
  localStorage.setItem(STORAGE_KEY, newId)
  return newId
}

async function trackEvent(event: string, game?: string) {
  try {
    const sessionId = getOrCreateSessionId()
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, sessionId, game })
    })
  } catch (err) {
    console.error('Failed to track event:', err)
  }
}

export const HeroCTA: React.FC = () => {
  const { t } = useTranslation('common');

  const handleCvDownload = useCallback(async () => {
    await trackEvent('cv_download')
    // El redirect real se maneja con el href del link
    window.open(`${import.meta.env.BASE_URL}CV.pdf`, '_blank')
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-wrap gap-4 justify-center items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <a
          href="https://github.com/rassebas1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 group"
        >
          <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">{t('hero_cta_github')}</span>
        </a>
      </motion.div>

      <motion.div variants={itemVariants}>
        <a
          href="https://linkedin.com/in/sespitial"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 group"
        >
          <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">{t('hero_cta_linkedin')}</span>
        </a>
      </motion.div>

      <motion.div variants={itemVariants}>
        <button
          onClick={handleCvDownload}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 group"
        >
          <FileDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">{t('hero_cta_cv')}</span>
        </button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <a
          href="mailto:sebas.espitia@gmail.com"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 group"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">{t('hero_cta_lets_talk')}</span>
        </a>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link to="/game/2048">
          <Button
            size="lg"
            className="gap-2 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>{t('hero_cta_games')}</span>
          </Button>
        </Link>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="w-full flex justify-center mt-8"
      >
        <button
          onClick={() => {
            const element = document.getElementById('featured-projects');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-2 rounded-full hover:bg-primary/10 transition-colors"
          aria-label="Scroll to featured projects"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
};
