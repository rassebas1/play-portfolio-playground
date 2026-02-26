import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LabAI: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <motion.div
      key="lab-ai-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">🧪 Big Data & AI Lab</h1>
        <p className="text-xl text-muted-foreground">
          TinyML Bird Classifier - Coming Soon
        </p>
      </div>
    </motion.div>
  );
};

export default LabAI;
