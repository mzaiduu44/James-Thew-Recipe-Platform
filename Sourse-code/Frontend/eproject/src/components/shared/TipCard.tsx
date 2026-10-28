import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Lock } from 'lucide-react';
import type { Tip } from '@/types/entities';
import { FreeAccessBadge, MembersOnlyBadge, LockedBadge, Badge } from '../ui/Badge';
import { useAuthStore } from '@/store/authStore';

export interface TipCardProps {
  tip: Tip;
}

export const TipCard: React.FC<TipCardProps> = ({ tip }) => {
  const { role } = useAuthStore();
  const isLocked = !tip.isFree && role !== 'Member' && role !== 'Admin';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="group flex flex-col justify-between h-full p-4 sm:p-6 md:p-7 bg-[var(--color-surface)] rounded-2xl sm:rounded-3xl border border-[var(--color-border)] shadow-warm hover:shadow-warm-lg transition-all duration-300 text-left"
    >
      <div className="flex flex-col gap-3.5 sm:gap-4 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--color-surface-2)] text-[var(--color-primary)] flex items-center justify-center shrink-0 border border-[var(--color-border)]">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {tip.categoryName && (
              <Badge variant="neutral" size="xs">
                {tip.categoryName}
              </Badge>
            )}
            {tip.isFree ? (
              <FreeAccessBadge size="xs" />
            ) : isLocked ? (
              <LockedBadge size="xs" className="shadow-warm animate-pulse" />
            ) : (
              <MembersOnlyBadge size="xs" />
            )}
          </div>
        </div>

        <Link to={`/tips/${tip.id}`}>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors leading-snug">
            {tip.title}
          </h3>
        </Link>

        {isLocked ? (
          <div className="relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-accent)]/40 text-xs text-[var(--color-accent)] flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              {role === 'User'
                ? 'Free Explorer Account: Upgrade to VIP to read secret.'
                : 'Masterclass technique reserved for VIP members.'}
            </span>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">
            {tip.description}
          </p>
        )}

        {tip.tags && tip.tags.length > 0 && !isLocked && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tip.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded-md border border-[var(--color-border)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--color-text)]">
            {tip.createdByName || 'Community Chef'}
          </span>
        </div>

        <Link
          to={`/tips/${tip.id}`}
          className="inline-flex items-center gap-1 font-semibold text-[var(--color-primary)] group-hover:translate-x-1 transition-transform"
        >
          <span>Read Technique</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};