import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, ArrowLeft, Utensils, Lightbulb, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer maxWidth="lg">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        {/* Animated 404 Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 rounded-3xl bg-[var(--color-surface-2)] text-[var(--color-primary)] flex items-center justify-center shadow-warm-lg border border-[var(--color-border)] animate-float">
            <ChefHat className="w-12 h-12" />
          </div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 500 }}
            className="absolute -bottom-3 -right-3 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-sm font-mono font-bold shadow-warm"
          >
            404
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-text)] mb-3"
        >
          Culinary Misadventure
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-md leading-relaxed mb-8"
        >
          The dish, technique, or page you're searching for seems to have been whisked away from the kitchen counter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Kitchen
            </Button>
          </Link>
          <Link to="/recipes">
            <Button variant="outline" size="md" leftIcon={<Utensils className="w-4 h-4" />}>
              Browse Recipes
            </Button>
          </Link>
        </motion.div>

        {/* Quick Navigation Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl"
        >
          <Link
            to="/recipes"
            className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm hover:shadow-warm-lg transition-all text-center card-hover-lift"
          >
            <Utensils className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
            <span className="font-serif text-sm font-bold text-[var(--color-text)] block">Recipes</span>
            <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">480+ formulations</span>
          </Link>
          <Link
            to="/tips"
            className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm hover:shadow-warm-lg transition-all text-center card-hover-lift"
          >
            <Lightbulb className="w-6 h-6 text-[var(--color-accent)] mx-auto mb-2" />
            <span className="font-serif text-sm font-bold text-[var(--color-text)] block">Techniques</span>
            <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">Pro secrets</span>
          </Link>
          <Link
            to="/contests"
            className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm hover:shadow-warm-lg transition-all text-center card-hover-lift"
          >
            <Trophy className="w-6 h-6 text-[var(--color-success)] mx-auto mb-2" />
            <span className="font-serif text-sm font-bold text-[var(--color-text)] block">Contests</span>
            <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">Win prizes</span>
          </Link>
        </motion.div>
      </div>
    </PageContainer>
  );
};
