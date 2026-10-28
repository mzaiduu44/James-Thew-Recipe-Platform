import React, { useState } from 'react';
import { Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface RatingStarsProps {
  rating?: number; // 0 - 5
  totalStars?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
  className?: string;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating = 5,
  totalStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showCount = false,
  count,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [showSparkle, setShowSparkle] = useState(false);

  const currentVal = hoverRating ?? rating;

  const handleClick = (value: number) => {
    if (!interactive) return;
    onChange?.(value);
    if (value === 5) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 2000);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 relative ${className}`}>
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => interactive && setHoverRating(null)}
      >
        {Array.from({ length: totalStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= currentVal;
          const isHalf = !isFilled && starValue - 0.5 <= currentVal;

          return (
            <motion.button
              key={index}
              type="button"
              disabled={!interactive}
              whileHover={interactive ? { scale: 1.25, rotate: 5 } : undefined}
              whileTap={interactive ? { scale: 0.9 } : undefined}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              className={`relative transition-colors ${
                interactive ? 'cursor-pointer focus:outline-none p-0.5' : 'cursor-default'
              }`}
              aria-label={`${starValue} Stars`}
            >
              <Star
                className={`${sizeMap[size]} ${
                  isFilled
                    ? 'fill-[var(--color-accent)] text-[var(--color-accent)] drop-shadow-sm'
                    : isHalf
                    ? 'fill-[var(--color-accent)]/50 text-[var(--color-accent)]'
                    : 'text-[var(--color-border)]'
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      {showCount && (
        <span className="text-xs sm:text-sm font-semibold text-[var(--color-text)] ml-1">
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="text-[var(--color-text-subtle)] font-normal ml-1">
              ({count})
            </span>
          )}
        </span>
      )}

      <AnimatePresence>
        {showSparkle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.1, y: -18 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-3 right-0 flex items-center gap-1 bg-[var(--color-surface-2)] border border-[var(--color-accent)] text-[var(--color-accent)] px-2 py-0.5 rounded-full text-xs font-semibold shadow-warm pointer-events-none"
          >
            <Sparkles className="w-3 h-3 text-[var(--color-accent)]" />
            <span>Masterpiece!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
