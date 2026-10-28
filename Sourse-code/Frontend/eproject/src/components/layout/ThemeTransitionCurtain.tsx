import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '@/store/uiStore';
import { Sparkles, ChefHat, Sun, Moon, Flame, Compass, Star } from 'lucide-react';

export const ThemeTransitionCurtain: React.FC = () => {
  const { isTransitioningTheme, isDarkMode } = useUiStore();

  // 5 Staggered Satin Ribbon Slices
  const ribbonColumns = [
    { delay: 0, fromColor: '#120B08', toColor: '#2A1710', accent: '#E2B35B' },
    { delay: 0.08, fromColor: '#1F110B', toColor: '#3B2015', accent: '#D4A045' },
    { delay: 0.16, fromColor: '#28150D', toColor: '#4A281A', accent: '#F0C975' },
    { delay: 0.24, fromColor: '#1F110B', toColor: '#3B2015', accent: '#D4A045' },
    { delay: 0.32, fromColor: '#120B08', toColor: '#2A1710', accent: '#E2B35B' },
  ];

  const ribbonColumnsLight = [
    { delay: 0, fromColor: '#FAF6F0', toColor: '#EDE4D8', accent: '#53131B' },
    { delay: 0.08, fromColor: '#F3ECE0', toColor: '#E2D5C3', accent: '#7A1C28' },
    { delay: 0.16, fromColor: '#EDE2D0', toColor: '#D8C7B0', accent: '#A67628' },
    { delay: 0.24, fromColor: '#F3ECE0', toColor: '#E2D5C3', accent: '#7A1C28' },
    { delay: 0.32, fromColor: '#FAF6F0', toColor: '#EDE4D8', accent: '#53131B' },
  ];

  const activeRibbons = isDarkMode ? ribbonColumns : ribbonColumnsLight;

  return (
    <AnimatePresence>
      {isTransitioningTheme && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none flex items-center justify-center">
          <div className="absolute inset-0 flex w-full h-full">
            {activeRibbons.map((ribbon, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0, originY: i % 2 === 0 ? 0 : 1 }}
                animate={{
                  scaleY: [0, 1, 1, 0],
                  originY: [i % 2 === 0 ? 0 : 1, i % 2 === 0 ? 0 : 1, i % 2 === 0 ? 1 : 0, i % 2 === 0 ? 1 : 0],
                }}
                transition={{
                  duration: 2.0,
                  times: [0, 0.35, 0.72, 1],
                  delay: ribbon.delay * 0.5,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{
                  background: `linear-gradient(180deg, ${ribbon.fromColor} 0%, ${ribbon.toColor} 100%)`,
                  borderLeft: `1px solid ${ribbon.accent}33`,
                  borderRight: `1px solid ${ribbon.accent}33`,
                }}
                className="flex-1 h-full relative"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.2, delay: ribbon.delay * 0.5 + 0.2 }}
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
                />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1.2, 1.5, 0],
              opacity: [0, 1, 0.9, 0],
            }}
            transition={{
              duration: 1.8,
              times: [0, 0.4, 0.75, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent shadow-[0_0_80px_30px_rgba(226,179,91,0.6)] pointer-events-none -z-0"
          />

          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{
              scale: [0.2, 1.3, 1.6, 2.2],
              opacity: [0, 0.85, 0.9, 0],
            }}
            transition={{
              duration: 2.0,
              times: [0, 0.4, 0.75, 1],
              ease: 'easeInOut',
            }}
            className="w-[90vw] h-[90vw] max-w-[700px] max-h-[700px] rounded-full bg-radial from-[var(--color-accent)]/25 via-[var(--color-primary)]/10 to-transparent blur-3xl pointer-events-none absolute"
          />
          <motion.div
            initial={{ scale: 0.5, rotateY: -70, opacity: 0 }}
            animate={{
              scale: [0.5, 1.08, 1, 0.85],
              rotateY: [-70, 0, 0, 70],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.0,
              times: [0, 0.35, 0.75, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-20 flex flex-col items-center gap-6 p-8 sm:p-12 rounded-[44px] bg-[var(--color-surface)]/90 border-2 border-[var(--color-accent)] shadow-[0_25px_60px_-15px_rgba(226,179,91,0.4)] backdrop-blur-2xl max-w-sm sm:max-w-md mx-4" >
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-[var(--color-accent)]/80 flex items-center justify-center"
              >
                <div className="absolute top-0 w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
                <div className="absolute bottom-0 w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
                <div className="absolute left-0 w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
                <div className="absolute right-0 w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
              </motion.div>

              <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[var(--color-primary)] via-[#3D1410] to-[var(--color-accent)] p-[2px] shadow-warm-xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[var(--color-surface)] flex items-center justify-center relative overflow-hidden">
                  <ChefHat className="w-9 h-9 sm:w-10 sm:h-10 text-[var(--color-primary)]" />

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[#FAD074] text-[var(--color-on-accent)] flex items-center justify-center shadow-warm-md border border-white/50"
                  >
                    {isDarkMode ? (
                      <Sun className="w-4 h-4 text-black animate-spin-slow" />
                    ) : (
                      <Moon className="w-4 h-4 text-[#53131B]" />
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ATMOSPHERIC REVEAL</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
                {isDarkMode ? 'Solar Radiance Atmosphere' : 'Obsidian Noir Dining Salon'}
              </h2>

              <p className="text-xs font-mono text-[var(--color-text-muted)]">
                {isDarkMode ? 'Illuminating warm cream & culinary gold tones' : 'Transitioning to private evening atmosphere'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 h-5 pt-1">
              <motion.span
                animate={{ height: ['4px', '18px', '8px', '14px', '4px'] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 bg-[var(--color-accent)] rounded-full"
              />
              <motion.span
                animate={{ height: ['12px', '4px', '20px', '6px', '12px'] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                className="w-1.5 bg-[var(--color-primary)] rounded-full"
              />
              <motion.span
                animate={{ height: ['6px', '22px', '10px', '18px', '6px'] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="w-1.5 bg-[var(--color-accent)] rounded-full"
              />
              <motion.span
                animate={{ height: ['16px', '8px', '14px', '4px', '16px'] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
                className="w-1.5 bg-[var(--color-primary)] rounded-full"
              />
              <motion.span
                animate={{ height: ['4px', '18px', '8px', '14px', '4px'] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="w-1.5 bg-[var(--color-accent)] rounded-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ThemeTransitionCurtain;
