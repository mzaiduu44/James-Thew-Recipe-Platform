import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContests } from '@/hooks/useContests';
import { ContestCountdown } from '@/components/shared/ContestCountdown';
import { Badge, WinnerBadge, LiveBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHero } from '@/components/shared/PageHero';
import { AppImage } from '@/components/shared/AppImage';
import { SkeletonContestCard } from '@/components/ui/Skeleton';

export const ContestsPage: React.FC = () => {
  const [tab, setTab] = useState<string>('active');
  const { data: contests = [], isLoading } = useContests();

  const activeContests = contests.filter((c) => c.isActive);
  const pastContests = contests.filter((c) => !c.isActive);
  const displayedContests = tab === 'active' ? activeContests : pastContests;

  const tabItems = [
    { id: 'active', label: 'Active Contests', badge: activeContests.length },
    { id: 'past', label: 'Past Champions', badge: pastContests.length },
  ];

  // Featured contest (first active contest)
  const featured = activeContests[0];

  return (
    <PageContainer maxWidth="7xl">
      <PageHero
        tag="Aptech Culinary Competitions"
        tagIcon={<Trophy className="w-3.5 h-3.5" />}
        tagVariant="accent"
        title="Culinary Contests & Grand Prix"
        description={
          <>
            Put your recipes and techniques to the test. Chef James Thew personally reviews every entry.{' '}
            <strong className="text-[var(--color-text)]">Open to both registered members and guest visitors.</strong>
          </>
        }
      >
        <div className="pt-2">
          <Tabs items={tabItems} activeId={tab} onChange={setTab} variant="pill" />
        </div>
      </PageHero>

      {/* Featured Contest Spotlight (only when viewing active tab and there's a contest) */}
      {tab === 'active' && featured && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 sm:mb-10 rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--color-accent)]/40 shadow-warm-lg bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {featured.coverImage && (
              <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden min-h-[200px]">
                <AppImage
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <LiveBadge size="sm" className="glass-card shadow-sm" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
              </div>
            )}
            <div className="p-4 sm:p-8 lg:p-12 flex flex-col justify-center gap-4 sm:gap-5 text-left">
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="xs" icon={<Sparkles className="w-3 h-3" />}>
                  Featured Competition
                </Badge>
              </div>
              <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text)] leading-tight">
                {featured.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">
                {featured.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
                <span className="text-[var(--color-accent)] font-bold">Prize: {featured.prize}</span>
                <span className="text-[var(--color-text-subtle)]">•</span>
                <span className="text-[var(--color-text-subtle)]">{featured.submissionCount || 0} entries</span>
              </div>
              <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <ContestCountdown endDate={featured.endDate} />
                <Link to={`/contests/${featured.id}`} className="w-full sm:w-auto">
                  <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto justify-center">
                    View & Submit Entry
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contest Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <SkeletonContestCard />
          <SkeletonContestCard />
        </div>
      ) : displayedContests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <Trophy className="w-10 h-10 text-[var(--color-text-subtle)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-muted)] font-serif">
            {tab === 'active'
              ? 'No active contests at the moment. New season announcements coming soon!'
              : 'No past contest archives available.'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 text-left"
        >
          {displayedContests
            .filter((c) => tab !== 'active' || c.id !== featured?.id)
            .map((contest) => (
              <motion.div
                key={contest.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-between bg-[var(--color-surface)] rounded-2xl sm:rounded-3xl border border-[var(--color-border)] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 card-hover-lift"
              >
                {contest.coverImage && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <AppImage
                      src={contest.coverImage}
                      alt={contest.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      {contest.isActive ? (
                        <LiveBadge size="sm" className="glass-card shadow-sm" />
                      ) : (
                        <WinnerBadge size="sm" className="glass-card shadow-sm" />
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-1 justify-between gap-5 sm:gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-[var(--color-accent)] font-bold">
                        Prize: {contest.prize}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">
                        Allowed: {contest.entryTypeAllowed}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)] leading-tight">
                      {contest.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">
                      {contest.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    {contest.isActive ? (
                      <ContestCountdown endDate={contest.endDate} />
                    ) : (
                      <div className="text-xs font-mono text-[var(--color-text-subtle)]">
                        Concluded on {new Date(contest.endDate).toLocaleDateString()}
                      </div>
                    )}

                    <Link to={`/contests/${contest.id}`} className="w-full sm:w-auto">
                      <Button
                        variant={contest.isActive ? 'primary' : 'outline'}
                        size="md"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="w-full sm:w-auto"
                      >
                        {contest.isActive ? 'View & Submit' : 'View Winner Bulletin'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      )}
    </PageContainer>
  );
};
