import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[var(--color-text-muted)] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] text-sm sm:text-base rounded-2xl px-4 py-2.5 sm:py-3 border border-[var(--color-border)] transition-all duration-200 outline-none focus:border-[var(--color-primary)] disabled:opacity-50 disabled:bg-[var(--color-surface-2)] ${
              leftIcon ? 'pl-11' : ''
            } ${rightIcon ? 'pr-11' : ''} ${
              error ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[var(--color-text-muted)] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
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

Input.displayName = 'Input';
