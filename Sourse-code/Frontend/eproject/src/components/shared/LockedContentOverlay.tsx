import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, ArrowRight, ShieldCheck, Crown, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuthStore } from '@/store/authStore';
import { UpgradeMembershipModal } from './UpgradeMembershipModal';

export interface LockedContentOverlayProps {
  title?: string;
  className?: string;
}

export const LockedContentOverlay: React.FC<LockedContentOverlayProps> = ({
  title = 'Exclusive Masterclass Content',
  className = '',
}) => {
  const { isAuthenticated, role, user } = useAuthStore();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isFreeUser = isAuthenticated && role === 'User';

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-accent)]/50 p-4 sm:p-8 md:p-12 text-center bg-[var(--color-surface)] backdrop-blur-xl shadow-warm-xl ${className}`}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="max-w-xl mx-auto flex flex-col items-center gap-4"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--color-surface-2)] border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] shadow-warm">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center justify-center gap-1.5 text-xs font-mono text-[var(--color-accent)] font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>
                {isFreeUser ? 'Free Explorer Tier — VIP Formulation Locked' : 'VIP Members Only Masterclass'}
              </span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text)]">
              🔒 Locked: {title}
            </h3>

            {isFreeUser ? (
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                Hello <strong className="text-[var(--color-text)]">{user?.name}</strong>, your account is currently on the <strong className="text-[var(--color-accent)] font-mono">Free Explorer Tier</strong>. This formulation is locked. Please upgrade to a <strong className="text-[var(--color-text)]">VIP Member pass</strong> to unlock full ingredients, step-by-step techniques, and grand prix contest entries.
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                This gourmet recipe, professional techniques, and step-by-step masterclass secrets are locked and reserved for registered James Thew culinary VIP members.
              </p>
            )}
          </div>

          {isFreeUser ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full justify-center">
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
              <Link to="/profile" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Manage Account Tier
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full justify-center flex-wrap">
              <Link to="/membership" className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-warm"
                >
                  Explore VIP Pass ($100/mo)
                </Button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Create Free Account ($0)
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)] mt-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-success)] shrink-0" />
            <span>Includes 480+ formulation vault, chef secrets, & contest prize entry</span>
          </div>
        </motion.div>
      </div>

      <UpgradeMembershipModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        triggerTitle={`Upgrade your pass to unlock "${title}"`}
      />
    </>
  );
};

