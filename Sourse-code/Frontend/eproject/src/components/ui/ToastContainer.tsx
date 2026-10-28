import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useUiStore, ToastItem } from '@/store/uiStore';

const iconMap = {
  success: <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-[var(--color-danger)] shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] shrink-0" />,
  info: <Info className="w-5 h-5 text-[var(--color-accent)] shrink-0" />,
};

const borderMap = {
  success: 'border-l-4 border-l-[var(--color-success)]',
  error: 'border-l-4 border-l-[var(--color-danger)]',
  warning: 'border-l-4 border-l-[var(--color-warning)]',
  info: 'border-l-4 border-l-[var(--color-accent)]',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-0 sm:right-5 left-0 sm:left-auto z-[100000] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-3 sm:px-0 mx-auto sm:mx-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast: ToastItem) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-warm-lg ${borderMap[toast.type]}`}
          >
            <div className="flex items-start gap-3 text-left">
              {iconMap[toast.type]}
              <div className="flex flex-col gap-0.5">
                {toast.title && (
                  <h4 className="text-sm font-semibold text-[var(--color-text)]">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                  {toast.message}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full text-[var(--color-text-subtle)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
