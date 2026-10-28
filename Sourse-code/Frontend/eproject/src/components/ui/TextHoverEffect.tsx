import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TextHoverEffectProps {
  text: string;
  className?: string;
  effect?: 'wave' | 'glow' | 'stagger-reveal' | 'magnetic';
  highlightColor?: string;
}

export const TextHoverEffect: React.FC<TextHoverEffectProps> = ({
  text,
  className = '',
  effect = 'wave',
  highlightColor = 'var(--color-primary)',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const words = text.split(' ');

  if (effect === 'glow') {
    return (
      <motion.span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`inline-block relative cursor-pointer transition-all duration-300 ${className}`}
        style={{
          textShadow: isHovered
            ? `0 0 20px ${highlightColor}, 0 0 40px ${highlightColor}`
            : 'none',
        }}
      >
        <span className="relative z-10">{text}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full origin-left pointer-events-none"
          style={{ backgroundColor: highlightColor }}
        />
      </motion.span>
    );
  }

  if (effect === 'stagger-reveal') {
    return (
      <motion.span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`inline-flex flex-wrap items-baseline gap-x-[0.3em] cursor-pointer ${className}`}
      >
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-flex overflow-hidden">
            {word.split('').map((char, charIdx) => (
              <motion.span
                key={charIdx}
                animate={
                  isHovered
                    ? {
                        y: [0, -6, 0],
                        color: highlightColor,
                      }
                    : { y: 0 }
                }
                transition={{
                  duration: 0.4,
                  delay: (wordIdx * 4 + charIdx) * 0.02,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    );
  }

  // Default 'wave' effect: characters spring upward on hover
  return (
    <motion.span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex flex-wrap items-baseline gap-x-[0.28em] cursor-pointer select-none ${className}`}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex">
          {word.split('').map((char, cIdx) => (
            <motion.span
              key={cIdx}
              animate={
                isHovered
                  ? {
                      y: -4,
                      scale: 1.08,
                      rotate: (cIdx % 2 === 0 ? 1 : -1) * 2,
                    }
                  : { y: 0, scale: 1, rotate: 0 }
              }
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 15,
                delay: (wIdx * 3 + cIdx) * 0.015,
              }}
              className="inline-block transition-colors duration-200"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};

export default TextHoverEffect;
