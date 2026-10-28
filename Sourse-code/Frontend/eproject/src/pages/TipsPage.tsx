import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { useTips } from '@/hooks/useTips';
import { TipCard } from '@/components/shared/TipCard';
import { SkeletonTipCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHero } from '@/components/shared/PageHero';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { motion } from 'framer-motion';

export const TipsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'members'>('all');

  const { data: tipsData, isLoading } = useTips({
    search: search || undefined,
    isFree: accessFilter === 'free' ? true : accessFilter === 'members' ? false : undefined,
  });

  const tips = tipsData?.data || [];

  return (
    <PageContainer maxWidth="7xl">
      <PageHero
        tag="Professional Kitchen Disciplines"
        tagIcon={<Lightbulb className="w-3.5 h-3.5" />}
        tagVariant="accent"
        title="Culinary Techniques & Secrets"
        description="From knife sharpening angles to cold dough fermentation and butter emulsification—master the subtle foundational principles behind award-winning gastronomy."
      >
        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full mt-2">
          <div className="md:col-span-8">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search tips by keyword, equipment, or technique..."
            />
          </div>
          <div className="md:col-span-4">
            <Select
              options={[
                { value: 'all', label: 'All Techniques (Free & Members)' },
                { value: 'free', label: 'Free Techniques' },
                { value: 'members', label: 'Members Only Secrets' },
              ]}
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value as any)}
            />
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
            {tips.length} technique{tips.length !== 1 ? 's' : ''} discovered
            {search && <span className="text-[var(--color-accent)]"> matching "{search}"</span>}
          </p>
        </motion.div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonTipCard key={i} />
          ))}
        </div>
      ) : tips.length === 0 ? (
        <EmptyState
          title="No culinary tips match your search"
          description="Try exploring different keywords like 'pasta', 'knife', 'fermentation', or 'butter'."
          actionText="Clear Filter"
          onAction={() => {
            setSearch('');
            setAccessFilter('all');
          }}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {tips.map((tip) => (
            <motion.div
              key={tip.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              className="w-full"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <TipCard tip={tip} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageContainer>
  );
};
