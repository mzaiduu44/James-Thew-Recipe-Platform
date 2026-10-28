import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Lock, Crown } from 'lucide-react';
import type { Recipe } from '@/types/entities';
import { AppImage } from './AppImage';
import { FreeAccessBadge, MembersOnlyBadge, LockedBadge, Badge } from '../ui/Badge';
import { RatingStars } from './RatingStars';
import { useAuthStore } from '@/store/authStore';

export interface RecipeCardProps {
  recipe: Recipe;
  priority?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { role } = useAuthStore();
  const isLocked = !recipe.isFree && role !== 'Member' && role !== 'Admin';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="group flex flex-col h-full bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 text-left"
    >
      <Link to={`/recipes/${recipe.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <AppImage
          src={recipe.imagePath}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
        />

        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <Badge variant="neutral" size="xs" className="glass-card shadow-sm">
            {recipe.categoryName || 'Culinary'}
          </Badge>

          {recipe.isFree ? (
            <FreeAccessBadge size="xs" className="shadow-sm" />
          ) : isLocked ? (
            <LockedBadge size="xs" className="shadow-warm animate-pulse" />
          ) : (
            <MembersOnlyBadge size="xs" className="shadow-sm" />
          )}
        </div>

        {isLocked && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] text-xs font-bold shadow-warm-lg"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{role === 'User' ? 'VIP Locked — Upgrade' : 'VIP Locked — Join Now'}</span>
            </motion.div>
          </div>
        )}
      </Link>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1 justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <RatingStars
              rating={recipe.averageRating || 5.0}
              count={recipe.ratingsCount}
              showCount
              size="sm"
            />
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
              {recipe.difficulty}
            </span>
          </div>

          <Link to={`/recipes/${recipe.id}`}>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug">
              {recipe.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[var(--color-success)]" />
              <span>{recipe.servings} Servings</span>
            </span>
          </div>

          <div className="text-[11px] font-mono text-[var(--color-text-subtle)]">
            By {recipe.createdByName || 'Community Chef'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};