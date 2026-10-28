import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Share2,
  Send,
  ChefHat,
  MessageSquare,
  Clock,
  Flame,
  Users,
} from 'lucide-react';
import { useRecipe } from '@/hooks/useRecipes';
import { useFeedback, useSubmitFeedback } from '@/hooks/useFeedback';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { FreeAccessBadge, MembersOnlyBadge, Badge } from '@/components/ui/Badge';
import { AppImage } from '@/components/shared/AppImage';
import { RatingStars } from '@/components/shared/RatingStars';
import { IngredientChecklist } from '@/components/shared/IngredientChecklist';
import { LockedContentOverlay } from '@/components/shared/LockedContentOverlay';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading } = useRecipe(id);
  const { data: feedbackList = [] } = useFeedback(id);
  const submitFeedbackMutation = useSubmitFeedback();

  const { role, user, isAuthenticated } = useAuthStore();
  const { addToast } = useUiStore();

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');

  // SECURITY NOTICE: This gating is cosmetic on the client side only — the full recipe body
  // (procedure, ingredients, details) is already present in the API response from GET /api/Recipe/{id}.
  // See backend RecipeController TODO(security) regarding enforcing backend-side paywalls/stripping.
  const isLocked = recipe && !recipe.isFree && role !== 'Member' && role !== 'Admin';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Recipe link has been copied to your clipboard.',
      });
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !id) return;

    submitFeedbackMutation.mutate(
      {
        recipeId: id,
        rating,
        comment,
        userName: user?.name || guestName || 'Guest Food Lover',
        userEmail: user?.email,
        feedbackType: 'Recipe',
      },
      {
        onSuccess: () => {
          setComment('');
          setGuestName('');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <PageContainer maxWidth="5xl">
        <Skeleton className="h-8 w-40 mb-6" />
        <Skeleton className="w-full aspect-[16/9] rounded-3xl mb-8" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-24 w-full mb-8" />
      </PageContainer>
    );
  }

  if (!recipe) {
    return (
      <PageContainer maxWidth="md">
        <div className="text-center py-16">
          <h2 className="font-serif text-2xl font-bold mb-2 text-[var(--color-text)]">Recipe Not Found</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            The recipe you are looking for does not exist or has been retired.
          </p>
          <Link to="/recipes">
            <Button variant="primary">Back to Recipes</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="7xl">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Recipes</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            aria-label="Share recipe"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] md:aspect-[21/8] rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-warm-xl mb-6 sm:mb-8">
        <AppImage
          src={recipe.imagePath}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Badge variant="neutral" size="sm" className="glass-card shadow-sm">
            {recipe.categoryName || 'Culinary'}
          </Badge>
          {recipe.isFree ? <FreeAccessBadge size="sm" /> : <MembersOnlyBadge size="sm" />}
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col text-left gap-4 pb-6 sm:pb-8 border-b border-[var(--color-border)] mb-8 sm:mb-10">
        <div className="flex items-center gap-3">
          <RatingStars
            rating={recipe.averageRating || 5.0}
            count={recipe.ratingsCount}
            showCount
            size="md"
          />
          <span className="text-xs font-mono text-[var(--color-text-subtle)]">•</span>
          <span className="text-xs font-mono text-[var(--color-primary)] font-bold">
            {recipe.difficulty} Level
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-bold text-[var(--color-text)] tracking-tight leading-tight">
          {recipe.title}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-4xl leading-relaxed">
          {recipe.description}
        </p>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-4">
          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase truncate">Prep Time</span>
              <span className="text-xs sm:text-sm font-bold text-[var(--color-text)] truncate">{recipe.prepTimeMinutes} mins</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase truncate">Cook Time</span>
              <span className="text-xs sm:text-sm font-bold text-[var(--color-text)] truncate">{recipe.cookTimeMinutes} mins</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-success)] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase truncate">Servings</span>
              <span className="text-xs sm:text-sm font-bold text-[var(--color-text)] truncate">{recipe.servings} portions</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase truncate">Curated By</span>
              <span className="text-xs sm:text-sm font-bold text-[var(--color-text)] truncate">
                {recipe.createdByName || 'Community Chef'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Recipe Body (Gated vs Unlocked) */}
      {isLocked ? (
        <LockedContentOverlay title={recipe.title} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
          {/* Left Column: Interactive Mise en place Checklist */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <IngredientChecklist
              ingredients={recipe.ingredients}
              servings={recipe.servings}
            />
          </div>

          {/* Right Column: Cooking Procedure Steps */}
          <div className="lg:col-span-7 flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl sm:rounded-3xl shadow-warm">
            <div className="flex items-center gap-2 pb-4 border-b border-[var(--color-border)]">
              <ChefHat className="w-6 h-6 text-[var(--color-primary)]" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">
                Step-by-Step Culinary Procedure
              </h3>
            </div>

            <div className="flex flex-col gap-5 sm:gap-6">
              {(recipe.procedure as string[]).map((step: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 sm:gap-6">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-primary)] font-serif font-bold text-sm sm:text-base flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-0.5 sm:pt-1">
                    <p className="text-sm sm:text-base text-[var(--color-text)] leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK & REVIEWS SECTION */}
      <section className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[var(--color-border)] text-left">
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <MessageSquare className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="font-serif text-xl sm:text-3xl font-bold text-[var(--color-text)]">
            Culinary Reviews & Notes ({feedbackList.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Submit Feedback Form */}
          <div className="lg:col-span-5 p-4 sm:p-6 md:p-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl sm:rounded-3xl shadow-warm h-fit">
            <h4 className="font-serif text-lg font-bold mb-1 text-[var(--color-text)]">
              Leave Your Recipe Review
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] mb-5">
              Share your tasting notes, cooking adaptations, or star rating with Chef James and the community.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5 font-bold">
                  Your Rating
                </label>
                <RatingStars
                  rating={rating}
                  interactive
                  onChange={setRating}
                  size="lg"
                  showCount
                />
              </div>

              {!isAuthenticated && (
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5 font-bold">
                    Your Name (Guest)
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Gordon B."
                    className="w-full bg-[var(--color-surface-2)] text-[var(--color-text)] text-xs rounded-xl px-3.5 py-2.5 border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5 font-bold">
                  Tasting Review & Observations
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe flavor notes, heat levels, or sauce consistency achieved..."
                  className="w-full bg-[var(--color-surface-2)] text-[var(--color-text)] text-xs rounded-xl p-3.5 border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)] resize-y"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={submitFeedbackMutation.isPending}
                rightIcon={<Send className="w-4 h-4" />}
                className="w-full mt-2"
              >
                Submit Recipe Review
              </Button>
            </form>
          </div>

          {/* Feedback Feed */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {feedbackList.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-subtle)]">
                No reviews yet. Be the first to cook and review this masterclass formulation!
              </div>
            ) : (
              feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xs flex flex-col gap-3 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center border border-[var(--color-border)]">
                        {fb.userName ? fb.userName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[var(--color-text)] block">
                          {fb.userName}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <RatingStars rating={fb.rating} size="sm" />
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {fb.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </PageContainer>
  );
};
