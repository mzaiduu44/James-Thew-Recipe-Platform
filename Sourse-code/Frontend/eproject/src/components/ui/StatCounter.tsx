import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export interface StatCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  trend?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  label,
  prefix = '',
  suffix = '',
  duration = 1.5,
  icon,
  className = '',
  size = 'md',
  trend,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animFrame: number;
    const targetValue = value;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * targetValue));

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isInView, value, duration]);

  const sizeClasses = {
    sm: {
      container: 'p-4',
      number: 'text-2xl',
      label: 'text-[10px]',
      icon: 'w-8 h-8',
    },
    md: {
      container: 'p-6',
      number: 'text-3xl sm:text-4xl',
      label: 'text-xs',
      icon: 'w-10 h-10',
    },
    lg: {
      container: 'p-8',
      number: 'text-4xl sm:text-5xl',
      label: 'text-sm',
      icon: 'w-12 h-12',
    },
  };

  const s = sizeClasses[size];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`${s.container} rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm text-left ${className}`}
    >
      {icon && (
        <div
          className={`${s.icon} rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] mb-3`}
        >
          {icon}
        </div>
      )}
      <div className={`font-serif font-bold ${s.number} text-[var(--color-text)] tracking-tight`}>
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <div className={`${s.label} font-mono uppercase tracking-wider text-[var(--color-text-muted)] font-bold mt-1`}>
        {label}
      </div>
      {trend && (
        <div className="mt-2 text-[11px] font-semibold text-[var(--color-success)] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          {trend}
        </div>
      )}
    </motion.div>
  );
};
