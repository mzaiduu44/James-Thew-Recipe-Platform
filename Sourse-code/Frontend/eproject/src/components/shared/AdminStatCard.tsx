import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export interface AdminStatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  subtitle?: string;
  delay?: number;
  accentColor?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  icon,
  trend = '+14% this period',
  subtitle,
  delay = 0,
  accentColor = 'var(--color-primary)',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col justify-between p-4 sm:p-6 md:p-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl sm:rounded-3xl shadow-warm hover:shadow-warm-xl hover:border-[var(--color-accent)]/50 transition-all duration-300 text-left overflow-hidden select-none"
    >
      {/* Dynamic Ambient Hover Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[var(--color-primary)]/10 blur-2xl group-hover:bg-[var(--color-accent)]/20 transition-all duration-500 pointer-events-none" />

      {/* Top Section */}
      <div className="flex items-start justify-between gap-3 sm:gap-4 relative z-10">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-subtle)] font-bold truncate">
            {label}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text)] tracking-tight mt-0.5 sm:mt-1 truncate">
            {displayValue.toLocaleString()}
          </h3>
        </div>

        {/* Icon Pill */}
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0 border border-[var(--color-border)] shadow-warm-xs">
          {icon}
        </div>
      </div>

      {/* Bottom Trend & Details Strip */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--color-border)] text-xs relative z-10">
        <span className="inline-flex items-center gap-1 font-mono font-bold text-[var(--color-success)] px-2 py-0.5 rounded-full bg-[var(--color-success)]/10 border border-[var(--color-success)]/20">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </span>

        {subtitle ? (
          <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
            {subtitle}
          </span>
        ) : (
          <span className="text-[11px] font-mono text-[var(--color-text-subtle)]">
            Verified Live
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default AdminStatCard;
