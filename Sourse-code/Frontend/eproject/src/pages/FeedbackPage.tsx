import React, { useState } from 'react';
import { MessageSquare, Send, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFeedback, useSubmitFeedback } from '@/hooks/useFeedback';
import { useRecipes } from '@/hooks/useRecipes';
import { useAuthStore } from '@/store/authStore';
import { RatingStars } from '@/components/shared/RatingStars';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHero } from '@/components/shared/PageHero';
import { Skeleton } from '@/components/ui/Skeleton';

export const FeedbackPage: React.FC = () => {
  const { data: feedbackList = [], isLoading } = useFeedback();
  const { data: recipesData } = useRecipes({ pageSize: 50 });
  const submitFeedbackMutation = useSubmitFeedback();
  const { user, isAuthenticated } = useAuthStore();

  const [rating, setRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState<'General' | 'Recipe'>('General');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [comment, setComment] = useState('');

  const recipes = recipesData?.data || [];
  const recipeOptions = [
    { value: '', label: 'Select a Recipe to Review...' },
    ...recipes.map((r) => ({ value: r.id, label: r.title })),
  ];

  const averageRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
      : '5.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitFeedbackMutation.mutate(
      {
        recipeId: feedbackType === 'Recipe' ? selectedRecipeId || undefined : undefined,
        feedbackType,
        rating,
        comment,
        userName: userName || (isAuthenticated ? user?.name : 'Guest Culinary Connoisseur'),
        userEmail: userEmail || (isAuthenticated ? user?.email : undefined),
      },
      {
        onSuccess: () => {
          setComment('');
          setSelectedRecipeId('');
        },
      }
    );
  };

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: feedbackList.filter((f) => Math.round(f.rating) === star).length,
    pct: feedbackList.length > 0
      ? Math.round((feedbackList.filter((f) => Math.round(f.rating) === star).length / feedbackList.length) * 100)
      : 0,
  }));

  return (
    <PageContainer maxWidth="7xl">
      <PageHero
        tag="Culinary Critique & Feedback"
        tagIcon={<MessageSquare className="w-3.5 h-3.5" />}
        tagVariant="primary"
        title="Site & Recipe Feedback"
        description="Share your tasting reviews, platform impressions, and recommendations directly with Chef James Thew. Open to all members and visiting guests."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Metrics Card & Submission Form */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 flex flex-col gap-6 text-left"
        >
          {/* Average Rating Metric Card */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-[var(--color-text-subtle)]">Overall Reader Score</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
                    {averageRating}
                  </span>
                  <span className="text-sm text-[var(--color-text-subtle)]">/ 5.0</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Based on {feedbackList.length} reviews
                </p>
              </div>
              <RatingStars rating={Number(averageRating)} size="lg" />
            </div>

            {/* Rating Distribution Bars */}
            <div className="flex flex-col gap-1.5 pt-4 border-t border-[var(--color-border)]">
              {ratingDist.map((r) => (
                <div key={r.star} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-right font-mono text-[var(--color-text-subtle)]">{r.star}</span>
                  <Star className="w-3 h-3 text-[var(--color-accent)]" />
                  <div className="flex-1 h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${r.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + (5 - r.star) * 0.1 }}
                      className="h-full rounded-full bg-[var(--color-accent)]"
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-[var(--color-text-subtle)]">{r.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Form */}
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm flex flex-col gap-4">
            <h3 className="font-serif text-xl font-bold text-[var(--color-text)]">
              Submit Feedback
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5 font-bold">
                  Score / Rating
                </label>
                <RatingStars
                  rating={rating}
                  interactive
                  onChange={setRating}
                  size="lg"
                  showCount
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackType('General')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    feedbackType === 'General'
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                      : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  General Platform
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('Recipe')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    feedbackType === 'Recipe'
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                      : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  Specific Recipe
                </button>
              </div>

              {feedbackType === 'Recipe' && (
                <Select
                  label="Target Recipe"
                  options={recipeOptions}
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  required
                />
              )}

              {!isAuthenticated && (
                <>
                  <Input
                    label="Your Name (Optional)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Guest Culinary Connoisseur"
                  />
                  <Input
                    label="Email Address (Optional)"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="guest@example.com"
                  />
                </>
              )}

              <Textarea
                label="Observations & Critique"
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on recipes, site performance, or culinary suggestions..."
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={submitFeedbackMutation.isPending}
                rightIcon={<Send className="w-4 h-4" />}
                className="w-full mt-2"
              >
                Publish Feedback
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Right Column: Feedback List */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col gap-4 text-left"
        >
          <h3 className="font-serif text-xl font-bold text-[var(--color-text)] mb-2">
            Recent Feedback ({feedbackList.length})
          </h3>

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))}
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]">
              <MessageSquare className="w-10 h-10 text-[var(--color-text-subtle)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-text-muted)]">
                No feedback entries yet. Be the first to share your critique!
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="flex flex-col gap-4"
            >
              {feedbackList.map((fb) => (
                <motion.div
                  key={fb.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.35 }}
                  className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm hover:shadow-warm-lg transition-shadow flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)] font-serif font-bold text-sm flex items-center justify-center border border-[var(--color-border)]">
                        {fb.userName ? fb.userName.charAt(0).toUpperCase() : 'G'}
                      </div>
                      <div>
                        <span className="font-serif text-sm font-bold text-[var(--color-text)] block">
                          {fb.userName}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">
                          {new Date(fb.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <RatingStars rating={fb.rating} size="sm" />
                  </div>

                  {fb.recipeTitle && (
                    <div className="text-[11px] font-mono text-[var(--color-accent)] font-semibold">
                      Review for: {fb.recipeTitle}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {fb.comment}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageContainer>
  );
};
