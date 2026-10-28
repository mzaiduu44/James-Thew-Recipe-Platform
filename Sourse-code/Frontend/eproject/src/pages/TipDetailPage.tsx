import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Lightbulb, Share2, Tag } from 'lucide-react';
import { useTip, useTips } from '@/hooks/useTips';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { FreeAccessBadge, MembersOnlyBadge, Badge } from '@/components/ui/Badge';
import { LockedContentOverlay } from '@/components/shared/LockedContentOverlay';
import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { TipCard } from '@/components/shared/TipCard';

export const TipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tip, isLoading } = useTip(id);
  const { data: allTipsData } = useTips();
  const { role } = useAuthStore();
  const { addToast } = useUiStore();

  // SECURITY NOTICE: This gating is cosmetic on the client side only — the full tip description
  // is already present in the API response from GET /api/Tip/{id}.
  // See backend TipController TODO(security) regarding enforcing backend-side paywalls/stripping.
  const isLocked = tip && !tip.isFree && role !== 'Member' && role !== 'Admin';
  const relatedTips = allTipsData?.data?.filter((t) => t.id !== id)?.slice(0, 3) || [];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Tip URL copied to clipboard.',
      });
    }
  };

  if (isLoading) {
    return (
      <PageContainer maxWidth="6xl">
        <Skeleton className="h-8 w-40 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-40 w-full mb-8" />
      </PageContainer>
    );
  }

  if (!tip) {
    return (
      <PageContainer maxWidth="md">
        <div className="text-center py-16">
          <h2 className="font-serif text-2xl font-bold mb-2 text-[var(--color-text)]">Tip Not Found</h2>
          <Link to="/tips">
            <span className="text-sm text-[var(--color-primary)] font-semibold hover:underline">
              Return to Tips Archive
            </span>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="6xl">
      {/* Back & Share */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/tips"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Tips</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          aria-label="Share tip"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Card */}
      <div className="p-4 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl text-left flex flex-col gap-6 mb-8 sm:mb-12">
        <div className="flex items-center justify-between gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-accent)] flex items-center justify-center shadow-warm border border-[var(--color-border)]">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tip.categoryName && <Badge variant="neutral">{tip.categoryName}</Badge>}
            {tip.isFree ? <FreeAccessBadge size="sm" /> : <MembersOnlyBadge size="sm" />}
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--color-text)] leading-tight">
          {tip.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[var(--color-text-muted)] pb-4 sm:pb-6 border-b border-[var(--color-border)]">
          <span>Curated by <strong className="text-[var(--color-text)]">{tip.createdByName || 'Community Chef'}</strong></span>
          <span>•</span>
          <span className="font-mono">Published {new Date(tip.createdAt).toLocaleDateString()}</span>
        </div>

        {isLocked ? (
          <LockedContentOverlay title={tip.title} />
        ) : (
          <div className="flex flex-col gap-6">
            <p className="font-serif italic text-base sm:text-xl text-[var(--color-text)] leading-relaxed bg-[var(--color-surface-2)] p-4 sm:p-6 rounded-2xl border-l-4 border-l-[var(--color-primary)]">
              “{tip.description}”
            </p>

            {tip.tags && tip.tags.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <Tag className="w-4 h-4 text-[var(--color-text-subtle)]" />
                <div className="flex flex-wrap gap-2">
                  {(tip.tags as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2.5 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Tips */}
      {relatedTips.length > 0 && (
        <div className="text-left mt-8">
          <h3 className="font-serif text-xl sm:text-2xl font-bold mb-4 text-[var(--color-text)]">
            More Culinary Techniques
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTips.map((rTip) => (
              <TipCard key={rTip.id} tip={rTip} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
