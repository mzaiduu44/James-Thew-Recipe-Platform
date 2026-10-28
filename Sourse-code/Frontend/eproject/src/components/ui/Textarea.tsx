import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, rows = 4, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={`w-full bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] text-sm sm:text-base rounded-2xl p-4 border border-[var(--color-border)] transition-all duration-200 outline-none focus:border-[var(--color-primary)] disabled:opacity-50 disabled:bg-[var(--color-surface-2)] resize-y min-h-[100px] ${
            error ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]' : ''
          } ${className}`}
          {...props}
        />
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-[var(--color-danger)] font-medium"
            >
              {error}
            </motion.p>
          ) : helperText ? (
            <p className="text-xs text-[var(--color-text-muted)]">{helperText}</p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
