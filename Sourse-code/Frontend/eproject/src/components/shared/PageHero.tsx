import React from 'react';
import { motion } from 'framer-motion';

export interface PageHeroProps {
  tag?: string;
  tagIcon?: React.ReactNode;
  tagVariant?: 'primary' | 'accent' | 'neutral';
  title: string;
  subtitle?: string;
  description?: React.ReactNode;
  children?: React.ReactNode; // for filter bars, actions, etc.
  className?: string;
  maxWidth?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  tag,
  tagIcon,
  tagVariant = 'accent',
  title,
  subtitle,
  description,
  children,
  className = '',
  maxWidth = '2xl',
}) => {
  const tagColors = {
    primary: 'text-[var(--color-primary)] border-[var(--color-border)]',
    accent: 'text-[var(--color-accent)] border-[var(--color-border)]',
    neutral: 'text-[var(--color-text-muted)] border-[var(--color-border)]',
  };

  return (
    <div className={`flex flex-col items-start text-left gap-3 sm:gap-4 mb-6 sm:mb-10 pb-6 sm:pb-8 border-b border-[var(--color-border)] ${className}`}>
      {tag && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-xs font-mono font-bold border ${tagColors[tagVariant]}`}
        >
          {tagIcon}
          <span>{tag}</span>
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)] break-words w-full"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-editorial-italic text-lg sm:text-xl text-[var(--color-accent)]"
        >
          {subtitle}
        </motion.p>
      )}

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={`text-sm sm:text-base text-[var(--color-text-muted)] max-w-${maxWidth} leading-relaxed`}
        >
          {description}
        </motion.p>
      )}

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};
