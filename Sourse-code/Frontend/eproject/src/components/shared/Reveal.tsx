import React from 'react';
import { motion } from 'framer-motion';

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className = '',
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 24, opacity: 0 };
      case 'down':
        return { y: -24, opacity: 0 };
      case 'left':
        return { x: 24, opacity: 0 };
      case 'right':
        return { x: -24, opacity: 0 };
      case 'none':
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
