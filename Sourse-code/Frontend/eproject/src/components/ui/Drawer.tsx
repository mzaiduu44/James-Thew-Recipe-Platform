import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  badge?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  badge,
  children,
  position = 'right',
  maxWidth = 'lg',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const slideVariants = {
    hidden: { x: position === 'right' ? '100%' : '-100%', opacity: 0.8 },
    visible: { x: 0, opacity: 1 },
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Frosted Luxury Backdrop (Blurs Header, Page & Footer) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-2xl"
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            onClick={onClose}
          />

          <div className={`fixed inset-y-0 ${position === 'right' ? 'right-0' : 'left-0'} flex max-w-full`}>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className={`w-screen ${widthClasses[maxWidth]} bg-[var(--color-surface)] border-${
                position === 'right' ? 'l' : 'r'
              } border-[var(--color-border)] shadow-warm-xl flex flex-col z-10 text-left`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none -z-10" />

              <div className="flex items-start justify-between p-4 sm:p-6 md:p-8 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <div>
                  {badge && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-accent)] text-[10px] font-mono font-bold mb-2 border border-[var(--color-border)]">
                      <Sparkles className="w-3 h-3" />
                      <span>{badge}</span>
                    </div>
                  )}
                  {title && (
                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text)] tracking-tight">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>

                <motion.button
                  type="button"
                  whileHover={{ rotate: 90, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 sm:p-2.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors cursor-pointer shrink-0"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Content body */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain modal-scrollbar p-4 sm:p-6 md:p-8 text-left text-[var(--color-text)]">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
