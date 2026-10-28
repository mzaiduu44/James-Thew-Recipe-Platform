import React, { useState } from 'react';
import { HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFaqs } from '@/hooks/useFaqs';
import { Accordion } from '@/components/ui/Accordion';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHero } from '@/components/shared/PageHero';
import { SearchInput } from '@/components/ui/SearchInput';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export const FaqPage: React.FC = () => {
  const { data: faqs = [], isLoading } = useFaqs();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Membership', 'Recipes & Tips', 'Contests', 'Feedback', 'General'];

  const accordionItems = filteredFaqs.map((f) => ({
    id: f.id,
    title: f.question,
    content: f.answer,
    category: f.category,
  }));

  return (
    <PageContainer maxWidth="4xl">
      <PageHero
        tag="Aptech Platform Guidelines"
        tagIcon={<HelpCircle className="w-3.5 h-3.5" />}
        tagVariant="accent"
        title="Frequently Asked Questions"
        description="Everything you need to know regarding memberships, free vs. exclusive recipes, guest contest participation, and culinary publishing."
      >
        {/* Search */}
        <div className="w-full mt-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search FAQs (e.g. contest, membership, fees, upload, winner)..."
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pt-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--color-primary)] text-white shadow-warm-xs'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>
      </PageHero>

      {/* Accordion */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : accordionItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 text-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <HelpCircle className="w-10 h-10 text-[var(--color-text-subtle)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-muted)]">
            No questions matched your search criteria.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Accordion items={accordionItems} defaultExpandedId="faq-1" />
        </motion.div>
      )}

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 sm:mt-12 p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm text-center"
      >
        <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[var(--color-text)]">
            Still Have Questions?
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            If you didn't find what you're looking for, feel free to leave us a message through our feedback page. Chef James Thew's team responds within 24 hours.
          </p>
          <Link to="/feedback">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Send Us Feedback
            </Button>
          </Link>
        </div>
      </motion.div>
    </PageContainer>
  );
};
