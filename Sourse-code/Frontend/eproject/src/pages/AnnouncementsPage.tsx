import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Trophy, Sparkles, Calendar, Tv, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Badge, WinnerBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHero } from '@/components/shared/PageHero';
import { Skeleton } from '@/components/ui/Skeleton';

export const AnnouncementsPage: React.FC = () => {
  const { data: announcements = [], isLoading } = useAnnouncements();

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#A67628', '#53131B', '#357339', '#DBA84A'],
    });
  };

  return (
    <PageContainer maxWidth="4xl">
      <PageHero
        tag="Official Dispatch"
        tagIcon={<Megaphone className="w-3.5 h-3.5" />}
        tagVariant="accent"
        title="Announcements & Winner Bulletins"
        description="Official contest results, seasonal winner crowns, culinary studio masterclass dates, and direct broadcasts from Chef James Thew."
      />

      {/* Timeline Feed */}
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      ) : announcements.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 text-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <Megaphone className="w-10 h-10 text-[var(--color-text-subtle)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-muted)] font-serif">
            No announcements published yet. Check back for contest results and studio updates.
          </p>
        </motion.div>
      ) : (
        <div className="relative text-left">
          {/* Timeline Line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-[var(--color-border)] hidden sm:block" />

          <div className="flex flex-col gap-8">
            {announcements.map((ann, idx) => {
              const isWinnerAnn = ann.type === 'ContestWinner' || ann.winnerName;

              return (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="relative sm:pl-16"
                >
                  {/* Timeline Dot */}
                  <div
                    className={`hidden sm:flex absolute left-4 sm:left-5 top-8 w-6 h-6 rounded-full items-center justify-center border-2 ${
                      isWinnerAnn
                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-on-accent)]'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    {isWinnerAnn ? (
                      <Trophy className="w-3 h-3" />
                    ) : (
                      <Tv className="w-3 h-3" />
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border transition-all ${
                      isWinnerAnn
                        ? 'bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)] border-[var(--color-accent)]/50 shadow-warm-lg'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)] shadow-warm hover:shadow-warm-lg'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        {isWinnerAnn ? (
                          <WinnerBadge size="sm" />
                        ) : (
                          <Badge variant="admin" size="sm">
                            {ann.badgeText || 'Studio Update'}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-subtle)]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(ann.createdAt).toLocaleDateString(undefined, {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-3 leading-snug">
                      {ann.title}
                    </h3>

                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                      {ann.description}
                    </p>

                    {isWinnerAnn && (
                      <div className="mt-4 flex flex-col gap-3">
                        <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-accent)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] text-[var(--color-accent)] flex items-center justify-center shadow-warm-xs shrink-0 border border-[var(--color-border)]">
                              <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-[var(--color-text-subtle)] block uppercase font-bold">
                                Crown Champion
                              </span>
                              <span className="font-serif text-lg font-bold text-[var(--color-text)]">
                                {ann.winnerName || 'Culinary Champion'}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="gold"
                            size="sm"
                            onClick={handleCelebrate}
                            leftIcon={<Sparkles className="w-4 h-4" />}
                          >
                            Celebrate 🎉
                          </Button>
                        </div>

                        {(ann.winningEntryTitle || ann.contestTitle) && (
                          <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              {ann.winningEntryType && (
                                <Badge variant="accent" size="xs">
                                  {ann.winningEntryType}
                                </Badge>
                              )}
                              {ann.winningEntryTitle && (
                                <span className="font-medium text-[var(--color-text)]">
                                  Winning Formulation: <strong className="font-serif italic">"{ann.winningEntryTitle}"</strong>
                                </span>
                              )}
                            </div>
                            {ann.contestId && (
                              <Link
                                to={`/contests/${ann.contestId}`}
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--color-accent)] hover:underline ml-auto"
                              >
                                <span>View Contest ({ann.contestTitle || 'Details'})</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
