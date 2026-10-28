import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Recipes Found',
  description = 'Try adjusting your culinary search terms, filters, or category selections.',
  actionText,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-dashed border-[#E8DFD1] dark:border-[#383026] bg-[#FBF7F0]/40 dark:bg-[#1E1A15]/40 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#F3ECE0] dark:bg-[#28231D] border border-[#E8DFD1] dark:border-[#383026] flex items-center justify-center text-[#C9542F] mb-4 shadow-warm-xs">
        {icon || <UtensilsCrossed className="w-8 h-8 opacity-80" />}
      </div>

      <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#201A14] dark:text-[#F5EFE4] mb-1.5">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-[#6B6155] dark:text-[#A89E90] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
