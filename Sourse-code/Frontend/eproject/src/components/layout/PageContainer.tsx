import React from 'react';
import { motion } from 'framer-motion';

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  className?: string;
  animate?: boolean;
}

const maxWClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '4xl': 'max-w-5xl',
  '5xl': 'max-w-6xl',
  '6xl': 'max-w-7xl',
  '7xl': 'max-w-[1720px]',
  full: 'max-w-full',
};

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = '7xl',
  className = '',
  animate = true,
}) => {
  const containerClasses = `w-full mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-14 2xl:px-18 py-5 sm:py-10 ${maxWClasses[maxWidth]} ${className}`;

  if (!animate) {
    return <div className={containerClasses}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -14, filter: 'blur(3px)' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={containerClasses}
    >
      {children}
    </motion.div>
  );
};
