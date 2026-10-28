import React, { useState } from 'react';
import { Users, ChefHat, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecipes } from '@/hooks/useRecipes';
import { useTips } from '@/hooks/useTips';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { TipCard } from '@/components/shared/TipCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHero } from '@/components/shared/PageHero';
import { Tabs } from '@/components/ui/Tabs';
import { SkeletonRecipeCard, SkeletonTipCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';

export const CommunityPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'recipes' | 'tips'>('all');
  const { data: recipesData, isLoading: isRecipesLoading } = useRecipes({ pageSize: 20 });
  const { data: tipsData, isLoading: isTipsLoading } = useTips();

  const recipes = recipesData?.data || [];
  const tips = tipsData?.data || [];

  const tabItems = [
    { id: 'all', label: 'All Member Creations', badge: recipes.length + tips.length },
    { id: 'recipes', label: 'Formulations', badge: recipes.length },
    { id: 'tips', label: 'Kitchen Secrets', badge: tips.length },
  ];

  const isLoading = isRecipesLoading || isTipsLoading;

  return (
    <PageContainer maxWidth="7xl">
      <PageHero
        tag="Culinary Guild Feed"
        tagIcon={<Users className="w-3.5 h-3.5" />}
        tagVariant="accent"
        title="Community Kitchen Conservatory"
        description="Discover culinary experiments, artisan baking triumphs, and masterclass recipes submitted by verified James Thew club members worldwide."
      >
        <div className="pt-2">
          <Tabs items={tabItems} activeId={filter} onChange={(id) => setFilter(id as any)} variant="pill" />
        </div>
      </PageHero>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-12">
          {(filter === 'all' || filter === 'recipes') && (
            <div className="space-y-4">
              <div className="h-6 w-48 bg-[var(--color-surface-2)] rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRecipeCard key={i} />
                ))}
              </div>
            </div>
          )}

          {(filter === 'all' || filter === 'tips') && (
            <div className="space-y-4">
              <div className="h-6 w-48 bg-[var(--color-surface-2)] rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonTipCard key={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12 sm:space-y-16">
          {/* Formulations / Recipes Section */}
          {(filter === 'all' || filter === 'recipes') && (
            <section className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">
                      Member Formulations
                    </h2>
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      {recipes.length}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                    Artisan recipes and culinary dishes crafted and shared by guild chefs.
                  </p>
                </div>

                <Link
                  to="/recipes"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline self-start sm:self-auto"
                >
                  <span>Explore Recipe Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recipes.length === 0 ? (
                <EmptyState
                  title="No Formulations Found"
                  description="No member recipes have been submitted in this category yet."
                />
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {recipes.map((recipe) => (
                    <motion.div
                      key={`recipe-${recipe.id}`}
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4 }}
                      className="h-full flex flex-col"
                    >
                      <RecipeCard recipe={recipe} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>
          )}

          {/* Kitchen Secrets / Tips Section */}
          {(filter === 'all' || filter === 'tips') && (
            <section className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">
                      Kitchen Secrets & Techniques
                    </h2>
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      {tips.length}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                    Proven culinary shortcuts, blade techniques, and temperature mastery.
                  </p>
                </div>

                <Link
                  to="/tips"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-accent)] hover:underline self-start sm:self-auto"
                >
                  <span>Explore All Secrets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {tips.length === 0 ? (
                <EmptyState
                  title="No Kitchen Secrets Found"
                  description="No culinary tips have been shared in this category yet."
                />
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {tips.map((tip) => (
                    <motion.div
                      key={`tip-${tip.id}`}
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4 }}
                      className="h-full flex flex-col"
                    >
                      <TipCard tip={tip} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>
          )}
        </div>
      )}
    </PageContainer>
  );
};
