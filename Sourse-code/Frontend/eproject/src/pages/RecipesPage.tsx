import React, { useState } from 'react';
import { ChefHat, LayoutGrid, List } from 'lucide-react';
import { useRecipes, useCategories } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { SkeletonRecipeCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHero } from '@/components/shared/PageHero';
import { SearchInput } from '@/components/ui/SearchInput';
import { Tabs } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { motion } from 'framer-motion';

export const RecipesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'members'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating'>('newest');

  const { data: categories = [] } = useCategories();
  const { data: recipesData, isLoading } = useRecipes({
    search: search || undefined,
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
    isFree: accessFilter === 'free' ? true : accessFilter === 'members' ? false : undefined,
    sortBy,
  });

  const recipes = recipesData?.data || [];

  const accessTabs = [
    { id: 'all', label: 'All Recipes', badge: recipes.length || undefined },
    { id: 'free', label: 'Free Access' },
    { id: 'members', label: 'Members Only' },
  ];

  return (
    <PageContainer maxWidth="7xl">
      <PageHero
        tag="Haute Cuisine Monograph"
        tagIcon={<ChefHat className="w-3.5 h-3.5" />}
        tagVariant="primary"
        title="Recipe Masterclasses & Archives"
        description="Explore authentic culinary formulations created by Chef James Thew. Free recipes are open to all visitors; Members-Only masterclasses unlock advanced techniques and luxury preparations."
      >
        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-4 w-full mt-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
            {/* Search Input */}
            <div className="md:col-span-6">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by recipe title, ingredients, or keywords..."
                showShortcut
              />
            </div>

            {/* Access Filter */}
            <div className="md:col-span-3">
              <Select
                options={[
                  { value: 'all', label: 'All Access (Free & Members)' },
                  { value: 'free', label: 'Free Access Only' },
                  { value: 'members', label: 'Members Only Masterclasses' },
                ]}
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value as any)}
              />
            </div>

            {/* Sort By */}
            <div className="md:col-span-3">
              <Select
                options={[
                  { value: 'newest', label: 'Sort: Newest First' },
                  { value: 'rating', label: 'Sort: Highest Rated' },
                ]}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              />
            </div>
          </div>

          {/* Category Pills Slider */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pt-2 pb-2 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[var(--color-primary)] text-white shadow-warm-xs'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]'
              }`}
            >
              All Categories
            </button>

            {(Array.isArray(categories) ? categories : []).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[var(--color-primary)] text-white shadow-warm-xs'
                    : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      {/* Results Count */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-xs font-mono text-[var(--color-text-subtle)]">
            Showing {recipes.length} formulation{recipes.length !== 1 ? 's' : ''}
            {search && <span className="text-[var(--color-primary)]"> for "{search}"</span>}
          </p>
        </motion.div>
      )}

      {/* Recipe Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRecipeCard key={i} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <EmptyState
          title="No recipes found"
          description="Try adjusting your search criteria, category selection, or access filter."
          actionText="Clear All Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('all');
            setAccessFilter('all');
          }}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8"
        >
          {recipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageContainer>
  );
};
