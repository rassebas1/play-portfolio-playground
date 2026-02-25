import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface BadgeItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'security' | 'quality' | 'tools';
  index: number;
}

const categoryColors = {
  security: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    hover: 'hover:border-green-500/40',
    icon: 'text-green-500',
    glow: 'hover:shadow-green-500/20',
  },
  quality: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    hover: 'hover:border-blue-500/40',
    icon: 'text-blue-500',
    glow: 'hover:shadow-blue-500/20',
  },
  tools: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    hover: 'hover:border-orange-500/40',
    icon: 'text-orange-500',
    glow: 'hover:shadow-orange-500/20',
  },
};

export const BadgeItem: React.FC<BadgeItemProps> = ({
  title,
  description,
  icon: Icon,
  category,
  index,
}) => {
  const colors = categoryColors[category];

  return (
    <motion.div
      className={`
        ${colors.bg} ${colors.border} ${colors.hover} ${colors.glow}
        group relative flex flex-col items-center justify-center
        p-4 rounded-xl border backdrop-blur-sm
        hover:-translate-y-1 transition-all duration-300
        hover:shadow-lg cursor-default
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <div className={`${colors.icon} mb-2 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-semibold text-foreground text-center">
        {title}
      </span>
      <span className="text-xs text-muted-foreground text-center mt-1 line-clamp-2">
        {description}
      </span>
    </motion.div>
  );
};
