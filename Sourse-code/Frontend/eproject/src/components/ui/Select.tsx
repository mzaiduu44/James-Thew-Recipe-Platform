import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none bg-[var(--color-surface)] text-[var(--color-text)] text-sm sm:text-base rounded-2xl pl-4 pr-10 py-2.5 sm:py-3 border border-[var(--color-border)] transition-all duration-200 outline-none focus:border-[var(--color-primary)] cursor-pointer disabled:opacity-50 disabled:bg-[var(--color-surface-2)] ${
              error ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]' : ''
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[var(--color-surface)] text-[var(--color-text)]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 text-[var(--color-text-muted)] pointer-events-none flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-[var(--color-danger)] font-medium"
            >
              {error}
            </motion.p>
          )}
          {helperText && !error && (
            <p className="text-xs text-[var(--color-text-muted)]">{helperText}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = 'Select';
