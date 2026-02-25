import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TypingEffect } from '@/components/landing/TypingEffect';
import { HeroCTA } from '@/components/landing/HeroCTA';
import { BentoGrid } from '@/components/landing/BentoGrid';

const Home: React.FC = () => {
  const { t } = useTranslation('common');

  const roles = ['hero_role_1', 'hero_role_2', 'hero_role_3'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-50" />
        <div className="absolute inset-0 bg-radial-glow" />
        
        {/* Content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar with animated ring */}
          <motion.div
            className="relative inline-block mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 ring-4 ring-primary/30 group-hover:ring-primary/50 transition-all duration-300">
                <AvatarImage src="https://github.com/rassebas1.png" alt="Sebastián Espitia Londoño" />
                <AvatarFallback className="text-2xl">SEL</AvatarFallback>
              </Avatar>
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" style={{ animationDuration: '3s' }} />
            </div>
            {/* Status indicator */}
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-background" />
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary-glow bg-clip-text text-transparent"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('main_heading')}
          </motion.h1>

          {/* Typing Effect */}
          <motion.div
            className="mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TypingEffect roles={roles} />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('hero_tagline')}
          </motion.p>

          {/* CTA Buttons */}
          <HeroCTA />
        </motion.div>
      </section>

      {/* Bento Grid Skills Section */}
      <section className="container mx-auto px-4 pb-20">
        <BentoGrid />
      </section>
    </div>
  );
};

export default Home;
