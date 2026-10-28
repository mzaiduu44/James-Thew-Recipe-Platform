import React from 'react';
import { Crown, Lock, Trophy, ShieldCheck, Sparkles } from 'lucide-react';

type BadgeVariant =
  | 'primary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'danger'
  | 'warning'
  | 'admin'
  | 'gradient';
type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:
    'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/30',
  accent:
    'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-[var(--color-accent)]/40',
  neutral:
    'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]',
  success:
    'bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/30',
  danger:
    'bg-[var(--color-danger)]/15 text-[var(--color-danger)] border-[var(--color-danger)]/30',
  warning:
    'bg-[var(--color-warning)]/20 text-[var(--color-warning)] border-[var(--color-warning)]/40',
  admin:
    'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/25',
  gradient:
    'bg-gradient-to-r from-[var(--color-primary)]/15 to-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/30',
};

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'text-[9px] px-2 py-0.5',
  sm: 'text-[10px] px-2.5 py-1',
  md: 'text-xs px-3 py-1',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'sm',
  children,
  className = '',
  pulse = false,
  icon,
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-bold leading-none whitespace-nowrap select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
  >
    {pulse && (
      <span
        className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          variant === 'accent' || variant === 'gradient'
            ? 'bg-[var(--color-accent)]'
            : variant === 'success'
            ? 'bg-[var(--color-success)]'
            : variant === 'danger'
            ? 'bg-[var(--color-danger)]'
            : 'bg-[var(--color-primary)]'
        }`}
      />
    )}
    {icon}
    {children}
  </span>
);

// Pre-built semantic badges
export const FreeAccessBadge: React.FC<{ size?: BadgeSize; className?: string }> = ({
  size = 'sm',
  className = '',
}) => (
  <Badge variant="success" size={size} className={className} icon={<ShieldCheck className="w-3 h-3" />}>
    Free Access
  </Badge>
);

export const MembersOnlyBadge: React.FC<{ size?: BadgeSize; className?: string }> = ({
  size = 'sm',
  className = '',
}) => (
  <Badge variant="gradient" size={size} className={className} icon={<Crown className="w-3 h-3" />}>
    Members Only
  </Badge>
);

export const LockedBadge: React.FC<{ size?: BadgeSize; className?: string }> = ({
  size = 'sm',
  className = '',
}) => (
  <Badge
    variant="accent"
    size={size}
    className={`bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-[var(--color-accent)]/50 ${className}`}
    icon={<Lock className="w-3 h-3 text-[var(--color-accent)]" />}
  >
    VIP Locked
  </Badge>
);

export const WinnerBadge: React.FC<{ size?: BadgeSize; className?: string }> = ({
  size = 'sm',
  className = '',
}) => (
  <Badge variant="accent" size={size} className={className} icon={<Trophy className="w-3 h-3" />}>
    Grand Champion
  </Badge>
);

export const LiveBadge: React.FC<{ size?: BadgeSize; className?: string }> = ({
  size = 'sm',
  className = '',
}) => (
  <Badge variant="accent" size={size} className={className} pulse>
    LIVE
  </Badge>
);

export const PremiumBadge: React.FC<{ size?: BadgeSize; className?: string }> = ({
  size = 'sm',
  className = '',
}) => (
  <Badge variant="gradient" size={size} className={className} icon={<Sparkles className="w-3 h-3" />}>
    Premium
  </Badge>
);

export const AdminBadge: React.FC<{ size?: BadgeSize; className?: string }> = ({
  size = 'sm',
  className = '',
}) => (
  <Badge variant="admin" size={size} className={className} icon={<ShieldCheck className="w-3 h-3" />}>
    Admin
  </Badge>
);
