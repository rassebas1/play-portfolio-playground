import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface TypingEffectProps {
  roles: string[];
  className?: string;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ 
  roles, 
  className = '' 
}) => {
  const { t } = useTranslation('common');
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentRole = t(roles[roleIndex]);

  const handleTyping = useCallback(() => {
    if (!isDeleting) {
      if (displayText.length < currentRole.length) {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
      } else {
        setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }
  }, [displayText, currentRole, isDeleting, roles.length]);

  useEffect(() => {
    const timeout = setTimeout(handleTyping, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [handleTyping, isDeleting]);

  return (
    <motion.div 
      className={`text-xl md:text-2xl font-medium text-primary ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <span>{displayText}</span>
      <span className="typing-cursor" aria-hidden="true" />
    </motion.div>
  );
};
