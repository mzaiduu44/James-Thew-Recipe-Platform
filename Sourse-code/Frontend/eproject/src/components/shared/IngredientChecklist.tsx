import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

export interface IngredientChecklistProps {
  ingredients: string[];
  servings?: number;
  className?: string;
}

export const IngredientChecklist: React.FC<IngredientChecklistProps> = ({
  ingredients,
  servings,
  className = '',
}) => {
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const checkedCount = Object.values(checkedMap).filter(Boolean).length;
  const totalCount = ingredients.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const isAllDone = checkedCount === totalCount && totalCount > 0;

  const resetAll = () => setCheckedMap({});
  const selectAll = () => {
    const all: Record<number, boolean> = {};
    ingredients.forEach((_, i) => (all[i] = true));
    setCheckedMap(all);
  };

  return (
    <div
      className={`flex flex-col gap-4 p-4 sm:p-6 md:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl sm:rounded-3xl shadow-warm ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              Ingredients Checklist
            </h3>
            {servings && (
              <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                ({servings} Servings)
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Interactive cooking mode — check off ingredients as you prepare your mise en place
          </p>
        </div>

        <div className="flex items-center gap-2">
          {checkedCount > 0 ? (
            <button
              type="button"
              onClick={resetAll}
              className="text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            >
              Reset
            </button>
          ) : (
            <button
              type="button"
              onClick={selectAll}
              className="text-xs font-mono text-[var(--color-primary)] font-bold hover:underline transition-colors cursor-pointer"
            >
              Check All
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[var(--color-text-muted)] font-mono">
            Mise en place Progress:
          </span>
          <span className={isAllDone ? 'text-[var(--color-success)] font-bold' : 'text-[var(--color-accent)] font-bold'}>
            {checkedCount} of {totalCount} ready ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden border border-[var(--color-border)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`h-full rounded-full transition-colors ${
              isAllDone ? 'bg-[var(--color-success)]' : 'bg-[var(--color-primary)]'
            }`}
          />
        </div>
      </div>

      <ul className="flex flex-col gap-2.5 mt-2">
        {ingredients.map((item, idx) => {
          const isChecked = !!checkedMap[idx];

          return (
            <motion.li
              key={idx}
              layout
              className={`flex items-start gap-3.5 p-3 rounded-2xl transition-all duration-200 cursor-pointer select-none border ${
                isChecked
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
              }`}
              onClick={() => toggleItem(idx)}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                  isChecked
                    ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
                }`}
              >
                {isChecked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </motion.div>
                )}
              </div>

              <span
                className={`text-sm sm:text-base leading-snug transition-all ${
                  isChecked ? 'line-through opacity-70 italic text-[var(--color-text-muted)]' : 'font-normal text-[var(--color-text)]'
                }`}
              >
                {item}
              </span>
            </motion.li>
          );
        })}
      </ul>
      <AnimatePresence>
        {isAllDone && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-3 p-4 bg-[var(--color-surface-2)] border border-[var(--color-success)]/40 rounded-2xl text-[var(--color-success)]"
          >
            <Sparkles className="w-5 h-5 shrink-0" />
            <div className="text-left text-xs sm:text-sm">
              <span className="font-bold">Mise en place ready!</span> All ingredients are prepared.
              Ready to fire up the stove!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
