import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Crown, ArrowRight, ShieldCheck, Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuthStore } from '@/store/authStore';
import { UpgradeMembershipModal } from './UpgradeMembershipModal';

export interface LockedPageProps {
  title?: string;
  description?: string;
  requiredRole?: string;
}

export const LockedPage: React.FC<LockedPageProps> = ({
  title = 'Exclusive VIP Member Sanctuary',
  description = 'This masterclass area and culinary archive are exclusively accessible to James Thew VIP Members.',
  requiredRole = 'VIP Member',
}) => {
  const { isAuthenticated, role, user } = useAuthStore();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isFreeUser = isAuthenticated && role === 'User';

  return (
    <PageContainer maxWidth="4xl" className="py-8 sm:py-16 md:py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-accent)]/50 p-5 sm:p-8 md:p-14 bg-[var(--color-surface)] shadow-warm-xl flex flex-col items-center gap-6"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />

        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[var(--color-accent)]/20 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--color-surface-2)] border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] shadow-warm-md">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/40 text-[var(--color-accent)] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFreeUser ? 'Free Account — Restricted Section' : `${requiredRole} Required`}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--color-text)] tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed mt-1">
            {isFreeUser ? (
              <>
                Hello <strong className="text-[var(--color-text)]">{user?.name}</strong>, your account is currently on the <span className="font-mono text-[var(--color-accent)] font-bold">Free Explorer Tier</span>. To access this exclusive salon section, publish recipes, and enter competitions, please upgrade to a VIP Member pass.
              </>
            ) : (
              description
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full justify-center flex-wrap pt-2">
          {isFreeUser ? (
            <>
              <Button
                variant="gold"
                size="lg"
                onClick={() => setIsUpgradeModalOpen(true)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={<Crown className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-warm-md"
              >
                Upgrade to VIP Member ($100/mo)
              </Button>
              <Link to="/recipes" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Free Recipes
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/membership" className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-warm-md"
                >
                  Explore VIP Pass ($100/mo)
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In to Account
                </Button>
              </Link>
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" leftIcon={<Home className="w-4 h-4" />} className="w-full sm:w-auto">
                  Return Home
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-[var(--color-border)] w-full max-w-lg flex items-center justify-center gap-4 text-xs text-[var(--color-text-subtle)] flex-wrap">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--color-success)] shrink-0" />
            <span>480+ formulation vault</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
            <span>Grand Prix contest eligibility</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <span>Cancel anytime</span>
          </span>
        </div>
      </motion.div>

      <UpgradeMembershipModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        triggerTitle={`Upgrade to access "${title}"`}
      />
    </PageContainer>
  );
};
