import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  X as XIcon,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChefHat,
  Trophy,
  BookOpen,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHero } from '@/components/shared/PageHero';
import { useAuthStore } from '@/store/authStore';
import { UpgradeMembershipModal } from '@/components/shared/UpgradeMembershipModal';

const plans = [
  {
    id: 'free',
    name: 'Free Explorer',
    price: '$0',
    period: 'forever',
    description: 'Browse free recipes, leave reviews, and explore the culinary community.',
    features: [
      { text: 'Access all free recipes & tips', included: true },
      { text: 'Leave tasting reviews & notes', included: true },
      { text: 'View community content', included: true },
      { text: 'Join public contests', included: true },
      { text: 'Members-Only recipes (480+)', included: false },
      { text: 'Publish your own recipes & tips', included: false },
      { text: 'Grand Prix contest submissions', included: false },
      { text: 'Priority chef support', included: false },
    ],
    cta: 'Create Free Account',
    variant: 'outline' as const,
    popular: false,
  },
  {
    id: 'monthly',
    name: 'VIP Monthly',
    price: '$100',
    period: '/month',
    description: 'Full unrestricted access to every recipe, technique, and contest. Cancel anytime.',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Members-Only recipes (480+)', included: true },
      { text: 'Advanced technique masterclasses', included: true },
      { text: 'Publish your own recipes & tips', included: true },
      { text: 'Grand Prix contest submissions', included: true },
      { text: 'Cash prize eligibility ($1,500+)', included: true },
      { text: 'Priority chef support', included: true },
      { text: 'Community kitchen publishing', included: true },
    ],
    cta: 'Start VIP Monthly',
    variant: 'gold' as const,
    popular: true,
  },
  {
    id: 'yearly',
    name: 'VIP Yearly',
    price: '$1,000',
    period: '/year',
    description: 'Best value — save big vs. monthly billing. Everything in Monthly VIP, billed annually.',
    badge: 'Best Value',
    features: [
      { text: 'Everything in VIP Monthly', included: true },
      { text: 'Best value annual pricing', included: true },
      { text: 'Members-Only recipes (480+)', included: true },
      { text: 'Advanced technique masterclasses', included: true },
      { text: 'Publish your own recipes & tips', included: true },
      { text: 'Grand Prix contest submissions', included: true },
      { text: 'Cash prize eligibility ($1,500+)', included: true },
      { text: 'Priority chef support', included: true },
    ],
    cta: 'Start VIP Yearly',
    variant: 'primary' as const,
    popular: false,
  },
];

const stats = [
  { icon: <BookOpen className="w-5 h-5" />, value: '480+', label: 'Exclusive Recipes' },
  { icon: <Trophy className="w-5 h-5" />, value: '$1,500+', label: 'Contest Prizes' },
  { icon: <Users className="w-5 h-5" />, value: '2,400+', label: 'Active Members' },
  { icon: <ChefHat className="w-5 h-5" />, value: '24/7', label: 'Chef Support' },
];

export const MembershipPage: React.FC = () => {
  const { isAuthenticated, role } = useAuthStore();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const isAlreadyMember = role === 'Member' || role === 'Admin';

  return (
    <PageContainer maxWidth="7xl">
      <PageHero
        tag="Culinary VIP Membership"
        tagIcon={<Crown className="w-3.5 h-3.5" />}
        tagVariant="accent"
        title="Unlock the Full Culinary Experience"
        subtitle="Membership plans for every kitchen ambition"
        description="Choose the plan that fits your culinary journey. From free exploration to full VIP masterclass access with exclusive recipes, techniques, and contest eligibility."
      />

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-8 sm:mb-12"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm text-center"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-2">
              {stat.icon}
            </div>
            <div className="font-serif text-lg sm:text-2xl font-bold text-[var(--color-text)]">{stat.value}</div>
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] font-bold mt-0.5 truncate">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 sm:mb-16">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            className={`relative flex flex-col p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border text-left transition-all ${
              plan.popular
                ? 'border-[var(--color-accent)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-2)] shadow-warm-xl md:scale-[1.02] scale-100 z-10'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] shadow-warm hover:shadow-warm-lg'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap">
                Most Popular
              </div>
            )}
            {plan.badge && !plan.popular && (
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-mono font-bold uppercase whitespace-nowrap">
                {plan.badge}
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-serif text-xl font-bold text-[var(--color-text)] mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-text)]">{plan.price}</span>
                <span className="text-sm text-[var(--color-text-muted)]">{plan.period}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-2 leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 flex-1 mb-6">
              {plan.features.map((feat) => (
                <div key={feat.text} className="flex items-start gap-2.5 text-xs">
                  {feat.included ? (
                    <Check className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" />
                  ) : (
                    <XIcon className="w-4 h-4 text-[var(--color-text-subtle)] shrink-0 mt-0.5" />
                  )}
                  <span className={feat.included ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-subtle)] line-through'}>
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>

            {isAlreadyMember ? (
              <Button variant="outline" size="md" className="w-full" disabled>
                Current Plan Active
              </Button>
            ) : plan.id === 'free' ? (
              <Link to="/register" className="w-full">
                <Button variant={plan.variant} size="md" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            ) : isAuthenticated ? (
              <Button
                variant={plan.variant}
                size="md"
                rightIcon={<Crown className="w-4 h-4" />}
                className="w-full"
                onClick={() => setUpgradeOpen(true)}
              >
                {plan.cta}
              </Button>
            ) : (
              <Link to="/register" className="w-full">
                <Button variant={plan.variant} size="md" rightIcon={<Crown className="w-4 h-4" />} className="w-full">
                  Register to Upgrade
                </Button>
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Trust Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm text-center"
      >
        <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-success)]">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-text)]">
            Risk-Free Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
            Cancel your VIP membership anytime — no lock-in contracts. Your published recipes and community contributions remain yours forever.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-[11px] font-mono text-[var(--color-text-subtle)]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[var(--color-accent)]" />
              Instant Activation
            </span>
            <span>•</span>
            <span>Cancel Anytime</span>
            <span>•</span>
            <span>256-bit Secure</span>
          </div>
        </div>
      </motion.div>

      <UpgradeMembershipModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
      />
    </PageContainer>
  );
};
