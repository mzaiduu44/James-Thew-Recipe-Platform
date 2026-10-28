import React from 'react';

export interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', animate = true }) => (
  <div
    className={`rounded-2xl ${
      animate ? 'animate-shimmer' : 'bg-[var(--color-surface-2)]'
    } ${className}`}
  />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-3.5 rounded-lg ${i === lines - 1 ? 'w-3/5' : 'w-full'}`}
      />
    ))}
  </div>
);

export const SkeletonRecipeCard: React.FC = () => (
  <div className="flex flex-col bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] overflow-hidden shadow-warm-xs">
    <Skeleton className="aspect-[4/3] rounded-none rounded-t-3xl" />
    <div className="p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-4 w-16 rounded-lg" />
      </div>
      <Skeleton className="h-6 w-4/5 rounded-lg" />
      <SkeletonText lines={2} />
      <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-lg" />
        <Skeleton className="h-4 w-20 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SkeletonTipCard: React.FC = () => (
  <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-6 w-3/4 rounded-lg" />
    <SkeletonText lines={3} />
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-14 rounded-full" />
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
  </div>
);

export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className={`h-4 rounded-lg ${i === 0 ? 'w-32' : 'w-20'}`} />
      </td>
    ))}
  </tr>
);

export const SkeletonProfile: React.FC = () => (
  <div className="flex flex-col gap-6 items-center">
    <Skeleton className="w-24 h-24 rounded-full" />
    <Skeleton className="h-7 w-48 rounded-lg" />
    <Skeleton className="h-4 w-32 rounded-lg" />
    <div className="w-full max-w-md flex flex-col gap-3">
      <SkeletonText lines={4} />
    </div>
  </div>
);

export const SkeletonContestCard: React.FC = () => (
  <div className="flex flex-col bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] overflow-hidden shadow-warm-xs">
    <Skeleton className="aspect-[16/9] rounded-none rounded-t-3xl" />
    <div className="p-6 sm:p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-4 w-20 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-3/4 rounded-lg" />
      <SkeletonText lines={2} />
      <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  </div>
);

export const SkeletonHero: React.FC = () => (
  <div className="flex flex-col gap-4 pb-8 border-b border-[var(--color-border)]">
    <Skeleton className="h-6 w-40 rounded-full" />
    <Skeleton className="h-12 w-2/3 rounded-2xl" />
    <Skeleton className="h-4 w-1/2 rounded-lg" />
  </div>
);
