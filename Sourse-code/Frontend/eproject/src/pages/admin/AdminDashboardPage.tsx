import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Utensils,
  Trophy,
  MessageSquare,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
  Crown,
  Calendar,
  Gift,
  Flame,
} from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useContests } from '@/hooks/useContests';
import { useFeedback } from '@/hooks/useFeedback';
import { AdminStatCard } from '@/components/shared/AdminStatCard';
import {
  AdminRevenueAreaChart,
  AdminCategoryBarChart,
  AdminMembershipDonutChart,
} from '@/components/shared/AdminChart';
import { Button } from '@/components/ui/Button';
import { Badge, WinnerBadge } from '@/components/ui/Badge';

export const AdminDashboardPage: React.FC = () => {
  const { data: stats } = useAdminStats();
  const { data: contests = [] } = useContests();
  const { data: feedbackList = [] } = useFeedback();

  const activeContest = contests.find((c) => c.isActive) || contests[0];

  return (
    <div className="flex flex-col gap-8 text-left max-w-[1720px] mx-auto w-full">
      {/* ========================================================================= */}
      {/* 1. TOP WELCOME BANNER WITH CHEF MONOGRAM */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl overflow-hidden"
      >
        {/* Ambient Backlight */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)] text-xs font-mono font-bold border border-[var(--color-border)] flex items-center gap-1.5 shadow-warm-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>EXECUTIVE CHEF CONSOLE</span>
            </span>
            <span className="text-xs font-mono text-[var(--color-text-subtle)] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight">
            Executive Kitchen Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Real-time analytics for subscriber memberships, live contest velocity, and culinary formulations.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Link to="/admin/recipes" className="flex-1 sm:flex-initial">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} className="w-full sm:w-auto justify-center">
              Add Formulation
            </Button>
          </Link>
          <Link to="/admin/contests" className="flex-1 sm:flex-initial">
            <Button variant="gold" size="md" leftIcon={<Trophy className="w-4 h-4" />} className="w-full sm:w-auto justify-center">
              Crown Winner
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. 4-METRIC KPI GRID WITH GLOWING STAT CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatCard
          label="Registered Users"
          value={stats?.totalUsers ?? 0}
          icon={<Users className="w-6 h-6" />}
          trend="+18% growth"
          subtitle="Free & VIP Tiers"
          delay={0.05}
        />
        <AdminStatCard
          label="Active Paid VIPs"
          value={stats?.activeMembers ?? 0}
          icon={<Sparkles className="w-6 h-6 text-[var(--color-accent)]" />}
          trend="89% retention"
          subtitle="$100/mo & $1,000/yr"
          delay={0.1}
        />
        <AdminStatCard
          label="Total Formulations"
          value={stats?.totalRecipes ?? 0}
          icon={<Utensils className="w-6 h-6" />}
          trend="480+ target vault"
          subtitle="All Published Recipes"
          delay={0.15}
        />
        <AdminStatCard
          label="Contest Entries"
          value={stats?.totalSubmissions ?? 0}
          icon={<Trophy className="w-6 h-6" />}
          trend="Active jury review"
          subtitle="Grand Prix Live"
          delay={0.2}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. CHARTS ROW: REVENUE VELOCITY & DISCIPLINE DISTRIBUTION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        <div className="lg:col-span-12 xl:col-span-7">
          <AdminRevenueAreaChart />
        </div>
        <div className="lg:col-span-12 xl:col-span-5">
          <AdminCategoryBarChart />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SUBSCRIPTION SEGMENTATION & LIVE CONTEST VELOCITY */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        <div className="lg:col-span-12 xl:col-span-6">
          <AdminMembershipDonutChart />
        </div>

        {/* Live Contest Highlight Card */}
        <div className="lg:col-span-12 xl:col-span-6 p-6 sm:p-8 rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl flex flex-col justify-between gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none -z-0" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--color-accent)]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)] font-bold">
                  Active Grand Prix Challenge
                </span>
              </div>
              {activeContest?.isActive ? (
                <Badge variant="accent" size="xs">
                  Jury Review Active
                </Badge>
              ) : (
                <WinnerBadge size="xs" />
              )}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
              {activeContest?.title || 'Seasonal Haute Cuisine Grand Prix'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2 line-clamp-2 leading-relaxed">
              {activeContest?.description || 'Evaluating creative culinary formulations from global salon apprentices.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-warm-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase block font-bold">Award Package:</span>
                <span className="font-bold text-sm text-[var(--color-text)]">{activeContest?.prize || '$1,500 Cash + Damascus Knife Set'}</span>
              </div>
            </div>

            <Link to="/admin/contests" className="w-full sm:w-auto">
              <Button variant="gold" size="sm" rightIcon={<Crown className="w-4 h-4" />} className="w-full sm:w-auto">
                Crown Champion
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. RECENT TASTING REVIEWS & QUICK MANAGEMENT STRIP */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/admin/recipes"
          className="p-6 sm:p-7 rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm hover:shadow-warm-xl hover:border-[var(--color-primary)] transition-all flex flex-col justify-between gap-4 group"
        >
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors flex items-center justify-center mb-3 border border-[var(--color-border)]">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[var(--color-text)] mb-1">
              Curate Formulations
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Create recipes, toggle Free/VIP lock access, manage ingredients, and upload photography.
            </p>
          </div>
          <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1">
            <span>Manage Masterclasses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/contests"
          className="p-6 sm:p-7 rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm hover:shadow-warm-xl hover:border-[var(--color-accent)] transition-all flex flex-col justify-between gap-4 group"
        >
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-on-accent)] transition-colors flex items-center justify-center mb-3 border border-[var(--color-border)]">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[var(--color-text)] mb-1">
              Grand Prix Jury
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Review member dishes, evaluate culinary execution, and select official contest champions.
            </p>
          </div>
          <span className="text-xs font-semibold text-[var(--color-accent)] flex items-center gap-1">
            <span>Inspect Submissions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/feedback"
          className="p-6 sm:p-7 rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm hover:shadow-warm-xl hover:border-[var(--color-primary)] transition-all flex flex-col justify-between gap-4 group"
        >
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors flex items-center justify-center mb-3 border border-[var(--color-border)]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[var(--color-text)] mb-1">
              Tasting Critiques
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Read community tasting reviews, monitor average ratings, and respond to guest inquiries.
            </p>
          </div>
          <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1">
            <span>Review Feedback</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
