import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  Check,
  Flame,
  Compass,
  ChefHat,
  ShieldCheck,
  ArrowUpRight,
  Award,
  Users,
  BookOpen,
  Utensils,
  Calendar,
  MapPin,
  Star,
  Lightbulb,
  Crown,
  Lock,
} from 'lucide-react';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { TipCard } from '@/components/shared/TipCard';
import { ContestCountdown } from '@/components/shared/ContestCountdown';
import { Reveal } from '@/components/shared/Reveal';
import { TextHoverEffect } from '@/components/ui/TextHoverEffect';
import { StatCounter } from '@/components/ui/StatCounter';
import { useRecipes } from '@/hooks/useRecipes';
import { useTips } from '@/hooks/useTips';
import { useContests } from '@/hooks/useContests';
import { useFeedback } from '@/hooks/useFeedback';
import { SkeletonRecipeCard } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { AppImage } from '@/components/shared/AppImage';

export const HomePage: React.FC = () => {
  const { data: recipesData, isLoading: isRecipesLoading } = useRecipes({ pageSize: 8 });
  const { data: tipsData } = useTips();
  const { data: contests = [] } = useContests();
  const { data: feedbackList = [] } = useFeedback();

  const [activeCurriculumStage, setActiveCurriculumStage] = useState(0);
  const [selectedContestIndex, setSelectedContestIndex] = useState(0);
  const [billingPlan, setBillingPlan] = useState<'Monthly' | 'Yearly'>('Monthly');

  const featuredRecipes = recipesData?.data?.slice(0, 8) || [];
  const topTips = tipsData?.data?.slice(0, 4) || [];
  const activeContests = contests.filter((c) => c.isActive) || [];
  const currentContest = activeContests[selectedContestIndex] || activeContests[0] || contests[0];

  // Press & Michelin Guide Partners Ticker
  const pressPartners = [
    { name: 'MICHELIN GUIDE', quote: '“The gold standard in modern haute cuisine pedagogy.”' },
    { name: 'THE NEW YORK TIMES', quote: '“James Thew deconstructs classical gastronomy with surgical precision.”' },
    { name: 'VOGUE GASTRONOMY', quote: '“The world’s most refined private culinary salon.”' },
    { name: 'BON APPÉTIT', quote: '“Masterclass perfection for the dedicated kitchen artist.”' },
    { name: 'GAULT & MILLAU', quote: '“Flawless culinary architecture and formulation discipline.”' },
    { name: 'WALLPAPER* DESIGN', quote: '“Where molecular physics meets sublime presentation aesthetics.”' },
  ];

  // 4-Stage Masterclass Curriculum
  const curriculumStages = [
    {
      stage: '01',
      title: 'Knife Mechanics & Kitchen Architecture',
      subtitle: 'Foundations of Precision',
      duration: '4 Weeks • 12 Formulations',
      difficulty: 'Foundation',
      description:
        'Master the 15-degree Japanese blade sharpening technique, root vegetable brunoise geometry, and classical French mirepoix sweat control.',
      techniques: [
        'Santoku vs Chef Knife balance & grip mechanics',
        'Cold-start pan rendering physics & fat release',
        'Aromatic herb bouquet garni essential oil bloom',
      ],
      image:
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
    },
    {
      stage: '02',
      title: 'Thermal Dynamics & Emulsion Mastery',
      subtitle: 'Sauce Architecture',
      duration: '6 Weeks • 18 Formulations',
      difficulty: 'Intermediate',
      description:
        'Harness molecular starch suspension in pasta waters, classic Hollandaise satin emulsions, and dry-aged beef crust caramelization.',
      techniques: [
        'Pecorino Romano DOP suspension off direct heat',
        'Brown butter noisette temperature thresholds (140°C)',
        'Tellicherry peppercorn essential oil toasted bloom',
      ],
      image:
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
    },
    {
      stage: '03',
      title: 'Pastry Chemistry & Artisan Fermentation',
      subtitle: 'The Baker’s Alchemy',
      duration: '5 Weeks • 14 Formulations',
      difficulty: 'Advanced',
      description:
        'Unlock open-crumb sourdough hydration curves, double-fermented focaccia dimpling, and crystalline sugar glass sugarcraft.',
      techniques: [
        '82% hydration sourdough folding intervals',
        'Laminated butter block dough temperature parity',
        'Tahitian vanilla bean infusion kinetics',
      ],
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    },
    {
      stage: '04',
      title: 'Symphonic Plating & Grand Prix Mastery',
      subtitle: 'The Executive Table',
      duration: '4 Weeks • 10 Formulations',
      difficulty: 'Masterclass',
      description:
        'Craft five-course tasting menus, balance micro-acidity against rich collagen reductions, and compose award-winning plating aesthetics.',
      techniques: [
        'Negative space & asymmetrical sauce drag composition',
        'Cold smoke dome aromatics presentation',
        'Seasonal tasting menu pacing & wine accord',
      ],
      image:
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 overflow-hidden pb-20 text-left w-full">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: KINETIC EDITORIAL BANNER */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-[1720px] mx-auto w-full">
        {/* Ambient Glow Gradient */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-tr from-[var(--color-primary)]/15 via-[var(--color-accent)]/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left: Typography & Call-To-Action */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 z-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-accent)] text-xs font-mono font-bold tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRIVATE CULINARY SALON & GUILD</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight text-[var(--color-text)] leading-[1.08]"
            >
              The architecture of{' '}
              <span className="italic font-normal text-[var(--color-primary)] hover-glow-gold">
                Michelin-grade
              </span>{' '}
              gastronomy.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl leading-relaxed"
            >
              Step inside the culinary conservatory of celebrity chef James Thew. Discover 480+ guarded masterclass formulations, knife kinetics, and seasonal Grand Prix competitions.
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto"
            >
              <Link to="/recipes" className="btn-agency-primary py-3.5 px-6 text-sm w-full sm:w-auto justify-center">
                <span>Explore Formulations ({recipesData?.total || '40+'})</span>
                <div className="arrow-disc-lime w-7 h-7">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>

              <Link to="/membership" className="btn-agency-secondary py-3.5 px-6 text-sm w-full sm:w-auto justify-center">
                <span>VIP Membership Pass ($100/mo)</span>
                <div className="w-7 h-7 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] shrink-0">
                  <Crown className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                </div>
              </Link>
            </motion.div>

            {/* Metrics Strip with Animated Counters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-[var(--color-border)] grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-xl text-left"
            >
              <div>
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-text)] block">
                  14.2k+
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[var(--color-text-subtle)]">Active Members</span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-text)] block">
                  480+
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[var(--color-text-subtle)]">Formulations</span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-accent)] block">
                  $12.5k
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[var(--color-text-subtle)]">Contest Purse</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Visual Magazine Frame */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              <div className="relative aspect-[4/5] rounded-[32px] sm:rounded-[40px] overflow-hidden border-2 border-[var(--color-border)] shadow-warm-xl">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1000"
                  alt="Chef James Thew private kitchen"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-5 sm:bottom-6 inset-x-5 sm:inset-x-6 text-white text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E2B35B] font-bold block mb-1">
                    Featured Masterclass
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                    Pan-Seared Duck Breast with Cherry-Balsamic Reduction
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs font-mono text-white/80">
                    <span>45m Preparation</span>
                    <span>•</span>
                    <span className="text-[#E2B35B]">★ 4.95 Rating</span>
                  </div>
                </div>
              </div>

              {/* Floating Verified Seal */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-3 left-3 sm:-top-4 sm:-left-4 p-2.5 sm:p-3 rounded-2xl glass-card border border-[var(--color-border)] shadow-warm-lg flex items-center gap-2.5 z-20"
              >
                <div className="w-8 h-8 rounded-xl bg-[var(--color-success)] text-white flex items-center justify-center shadow-warm-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-mono text-[var(--color-text-subtle)] block uppercase font-bold">
                    Accreditation
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text)]">
                    100% Chef Verified
                  </span>
                </div>
              </motion.div>

              {/* Floating Technique Rating Badge */}
              <motion.div
                animate={{ y: [3, -3, 3] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 sm:top-12 -right-3 sm:-right-8 p-4 rounded-3xl glass-card border border-[var(--color-border)] shadow-warm-xl max-w-[220px] text-left hidden sm:flex flex-col gap-2 z-20"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                  <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-accent)]">
                    Active Technique
                  </span>
                </div>
                <p className="text-xs font-serif font-bold text-[var(--color-text)] leading-snug">
                  French Saucier: Mastering Demi-Glace Reductions
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)] pt-1 border-t border-[var(--color-border)]">
                  <span>92% Precision</span>
                  <span className="text-[var(--color-accent)] font-bold">★ 4.98</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INFINITE PRESS & MICHELIN REVIEWS TICKER */}
      {/* ========================================================================= */}
      <section className="w-full border-y border-[var(--color-border)] bg-[var(--color-surface)] py-6 overflow-hidden select-none">
        <div className="animate-ticker flex items-center gap-12 text-left">
          {[...pressPartners, ...pressPartners].map((partner, idx) => (
            <div key={idx} className="flex items-center gap-4 shrink-0 px-4">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-primary)] bg-[var(--color-surface-2)] px-3 py-1 rounded-full border border-[var(--color-border)]">
                {partner.name}
              </span>
              <span className="font-serif italic text-sm text-[var(--color-text-muted)]">
                {partner.quote}
              </span>
              <span className="text-[var(--color-text-subtle)] text-xs">/</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CHEF JAMES THEW PROFILE (POINT 2 SPECIFICATION) */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-[1720px] mx-auto w-full">
        <Reveal>
          <div className="relative rounded-2xl sm:rounded-[40px] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-2)] to-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl overflow-hidden p-4 sm:p-8 md:p-12 lg:p-16">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
              {/* Left Portrait */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[var(--color-border)] shadow-warm-xl group">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1000"
                    alt="Chef James Thew - 5-Star Hotel Executive Chef"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold flex items-center gap-2">
                      <ChefHat className="w-3.5 h-3.5 text-[#E2B35B]" />
                      <span>FOUNDER & EXECUTIVE CHEF</span>
                    </span>
                  </div>

                  <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 text-white text-left">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#E2B35B] font-bold block mb-1">
                      Five-Star Luxury Hotel Executive Chef
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                      Mr. James Thew
                    </h3>
                    <p className="text-xs text-white/80 mt-1 font-mono">
                      Master Saucier • Cookbook Author • Television Host
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-[var(--color-text-muted)]">
                  <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[var(--color-text-subtle)] uppercase block">Studio & Lab</span>
                      <span className="font-bold text-[var(--color-text)]">London & Milan</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[var(--color-text-subtle)] uppercase block">Weekend Sessions</span>
                      <span className="font-bold text-[var(--color-text)]">Open to Public</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Biography & 4 Disciplines */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)] text-xs font-mono font-bold mb-3 border border-[var(--color-border)]">
                    <Award className="w-3.5 h-3.5" />
                    <span>CLIENT BIOGRAPHY & PEDAGOGY</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] leading-tight">
                    The Culinary Journey of Chef James Thew
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--color-text-muted)] mt-3 leading-relaxed">
                    James Thew is one of the most acclaimed culinary architects in the region, currently directing kitchen operations across premier five-star luxury hotels. Renowned for his meticulous palate and pedagogical discipline, publishers regularly commission his definitive recipe monographs, while major television networks produce his signature cooking broadcasts.
                  </p>
                </div>

                {/* 4 Specialty Disciplines */}
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-accent)] block mb-3">
                    Featured Masterclass Disciplines:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-serif font-bold text-sm text-[var(--color-text)] block">
                          1. Juices & Wellness Elixirs
                        </span>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-snug">
                          Cold-pressed extractions, herbal infusions, and botanical balance.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-serif font-bold text-sm text-[var(--color-text)] block">
                          2. Farm-to-Table Vegetarian
                        </span>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-snug">
                          Truffle risotto, vegetable duxelles, open emulsions, and heirloom craft.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-serif font-bold text-sm text-[var(--color-text)] block">
                          3. Gourmet Non-Vegetarian
                        </span>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-snug">
                          Center-cut Beef Wellington, crispy salmon sear kinetics, and demi-glace.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-serif font-bold text-sm text-[var(--color-text)] block">
                          4. Classical Italian Gastronomy
                        </span>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-snug">
                          Handcrafted egg yolk pasta, Roman Cacio e Pepe, and artisan sourdough.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weekend Community Classes Mission */}
                <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-accent)]/40 flex flex-col gap-2">
                  <span className="text-xs font-mono uppercase font-bold text-[var(--color-accent)]">
                    Weekend Community Classes & Accessible Education:
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                    During his free time, Chef James conducts intimate cookery classes near his home. To ensure culinary mastery is open to everyone, he charges very modest fares ($100/mo VIP access) to empower the maximum number of passionate cooking enthusiasts.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                  <Link to="/membership" className="btn-agency-primary text-xs w-full sm:w-auto justify-center">
                    <span>Join Weekend Masterclass ($100/mo)</span>
                    <div className="arrow-disc-lime w-6 h-6">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>

                  <Link to="/register?tier=free" className="btn-agency-secondary text-xs w-full sm:w-auto justify-center">
                    <span>Start Free Account ($0)</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========================================================================= */}
      {/* 4. MASTERCLASS CURRICULUM (4 Stages) */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-[1720px] mx-auto w-full">
        <Reveal>
          <div className="p-4 sm:p-8 md:p-12 lg:p-16 rounded-2xl sm:rounded-[40px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[var(--color-border)]">
              <div className="flex flex-col gap-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)] text-xs font-mono font-bold w-fit border border-[var(--color-border)]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>STRUCTURED PEDAGOGY</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)]">
                  The Masterclass Curriculum
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                  A four-stage conservatory journey designed by James Thew, progressing from foundational knife mechanics to symphonic grand prix plating.
                </p>
              </div>

              {/* Stage Navigation Pills */}
              <div className="flex flex-wrap gap-2">
                {curriculumStages.map((stageItem, idx) => (
                  <button
                    key={stageItem.stage}
                    type="button"
                    onClick={() => setActiveCurriculumStage(idx)}
                    className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      activeCurriculumStage === idx
                        ? 'bg-[var(--color-primary)] text-white shadow-warm'
                        : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
                    }`}
                  >
                    <span>Stage {stageItem.stage}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Stage Interactive Showcase */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCurriculumStage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-10"
              >
                <div className="lg:col-span-6 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-accent)] border border-[var(--color-accent)]/40">
                      {curriculumStages[activeCurriculumStage].difficulty}
                    </span>
                    <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                      {curriculumStages[activeCurriculumStage].duration}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider font-bold block mb-1">
                      {curriculumStages[activeCurriculumStage].subtitle}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
                      {curriculumStages[activeCurriculumStage].title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
                    {curriculumStages[activeCurriculumStage].description}
                  </p>

                  <div className="p-5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex flex-col gap-3">
                    <span className="text-xs font-mono uppercase font-bold text-[var(--color-accent)]">
                      Core Techniques Evaluated:
                    </span>
                    <ul className="flex flex-col gap-2">
                      {curriculumStages[activeCurriculumStage].techniques.map((tech) => (
                        <li key={tech} className="flex items-center gap-2.5 text-xs sm:text-sm text-[var(--color-text)]">
                          <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                          <span>{tech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Link to="/membership" className="btn-agency-primary text-xs w-full sm:w-auto justify-center">
                      <span>Enroll in Stage {curriculumStages[activeCurriculumStage].stage} ($100/mo)</span>
                      <div className="arrow-disc-lime w-6 h-6">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-warm-lg group">
                    <img
                      src={curriculumStages[activeCurriculumStage].image}
                      alt={curriculumStages[activeCurriculumStage].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                      <span>Curriculum Stage {curriculumStages[activeCurriculumStage].stage} of 04</span>
                      <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                        Mastery Pathway
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </section>

      {/* ========================================================================= */}
      {/* 5. SIGNATURE FORMULATIONS ARCHIVE */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-[1720px] mx-auto w-full">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[var(--color-border)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)] text-xs font-mono font-bold mb-2 border border-[var(--color-border)]">
                <Flame className="w-3.5 h-3.5" />
                <span>SIGNATURE FORMULATIONS</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
                Featured Culinary Formulations
              </h2>
            </div>

            <Link to="/recipes" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline">
              <span>View Full Archive ({recipesData?.total || '40+'})</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
          {isRecipesLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonRecipeCard key={i} />
              ))
            : featuredRecipes.map((recipe, idx) => (
                <Reveal key={`recipe-${recipe.id}-${idx}`} delay={idx * 0.05}>
                  <RecipeCard recipe={recipe} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ACTIVE CONTEST SPOTLIGHT */}
      {/* ========================================================================= */}
      {currentContest && (
        <section className="px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-[1720px] mx-auto w-full">
          <Reveal>
            <div className="relative rounded-2xl sm:rounded-[40px] bg-[var(--color-surface)] border border-[var(--color-accent)]/40 hover:border-[var(--color-accent)]/80 transition-colors duration-500 shadow-warm-xl overflow-hidden p-4 sm:p-8 lg:p-12">
              <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-[var(--color-accent)]/15 via-[var(--color-primary)]/10 to-transparent blur-3xl pointer-events-none -z-0" />
              <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-[var(--color-primary)]/10 via-[var(--color-accent)]/5 to-transparent blur-2xl pointer-events-none -z-0" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-[var(--color-border)]">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-accent)] text-xs font-mono font-bold w-fit border border-[var(--color-accent)]/30">
                    <Trophy className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span>GRAND PRIX COMPETITIONS • LIVE SUBMISSIONS OPEN</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text)]">
                    Seasonal Culinary Grand Prix
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {activeContests.map((contestItem, idx) => (
                    <button
                      key={`contest-btn-${contestItem.id}-${idx}`}
                      type="button"
                      onClick={() => setSelectedContestIndex(idx)}
                      className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        selectedContestIndex === idx
                          ? 'bg-[var(--color-primary)] text-white shadow-warm'
                          : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
                      }`}
                    >
                      <span>Contest 0{idx + 1}</span>
                    </button>
                  ))}
                  <Link
                    to="/contests"
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[var(--color-accent)] hover:underline ml-2"
                  >
                    <span>All Contests</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] text-xs font-mono font-bold border border-[var(--color-accent)]/30">
                      Prize Purse: {currentContest.prize || '$1,500 Cash'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-subtle)] text-xs font-mono border border-[var(--color-border)]">
                      Format: {currentContest.entryTypeAllowed || 'All Formulations'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] leading-[1.08] tracking-tight">
                      {currentContest.title}
                    </h3>
                    <p className="mt-3.5 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
                      {currentContest.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-start gap-3">
                      <Award className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-mono uppercase font-bold text-[var(--color-accent)] block">
                          Award Package
                        </span>
                        <span className="text-xs font-semibold text-[var(--color-text)] leading-snug block">
                          {currentContest.prize || '$1,500 Cash + Damascus Knife Set'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-start gap-3">
                      <ChefHat className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-mono uppercase font-bold text-[var(--color-primary)] block">
                          Executive Evaluation
                        </span>
                        <span className="text-xs font-semibold text-[var(--color-text)] leading-snug block">
                          Chef James Thew personally cooks & evaluates entries
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border)] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                    <ContestCountdown endDate={currentContest.endDate} />
                    <Link to={`/contests/${currentContest.id}`} className="w-full xl:w-auto">
                      <Button variant="primary" size="lg" rightIcon={<ArrowUpRight className="w-4 h-4" />} className="w-full xl:w-auto justify-center">
                        Enter Contest & Submit
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-warm-lg">
                    <AppImage
                      src={currentContest.coverImage}
                      alt={currentContest.title}
                      className="w-full h-full object-cover"
                      fallbackSrc="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. KITCHEN SECRETS & TECHNIQUES TEASER */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-[1720px] mx-auto w-full">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-[var(--color-border)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-accent)] text-xs font-mono font-bold mb-2 border border-[var(--color-border)]">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>PROFESSIONAL KITCHEN DISCIPLINES</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--color-text)]">
                Kitchen Secrets & Techniques
              </h2>
            </div>

            <Link to="/tips" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline">
              <span>View All Secrets ({tipsData?.data?.length || '12+'})</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topTips.map((tip, idx) => (
            <Reveal key={`tip-${tip.id}-${idx}`} delay={idx * 0.06}>
              <TipCard tip={tip} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MEMBERSHIP TIERS & PATHWAYS (REDESIGNED LUXURY SALON PRICING) */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-[1720px] mx-auto w-full">
        <Reveal>
          <div className="p-4 sm:p-8 md:p-12 lg:p-16 rounded-2xl sm:rounded-[40px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl text-center relative overflow-hidden">
            {/* Ambient Background Gold Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none -z-10" />

            {/* Section Header */}
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-3.5 mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-accent)] text-xs font-mono font-bold border border-[var(--color-border)] shadow-warm-xs">
                <Crown className="w-3.5 h-3.5" />
                <span>UNRESTRICTED SALON ADMISSION</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text)] tracking-tight">
                Choose Your Culinary Pathway
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
                Accessible gourmet education curated by Chef James Thew. Start with free casual exploration, or unlock the entire 480+ secret formulation vault and competition privileges.
              </p>

              {/* Interactive Billing Period Switcher */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-warm-xs mt-2">
                {[
                  { id: 'Monthly', label: 'Monthly ($100)', badge: 'POPULAR' },
                  { id: 'Yearly', label: 'Annual ($1,000)', badge: 'SAVE 17%' },
                ].map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setBillingPlan(plan.id as any)}
                    className={`px-3.5 sm:px-5 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      billingPlan === plan.id
                        ? 'bg-[var(--color-primary)] text-white shadow-warm'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    <span>{plan.label}</span>
                    {plan.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          billingPlan === plan.id
                            ? 'bg-white/20 text-white'
                            : 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3-Tier Luxury Pricing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto text-left items-stretch">
              {/* Tier 1: Free Explorer */}
              <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[var(--color-surface-2)]/70 border border-[var(--color-border)] shadow-warm hover:shadow-warm-lg transition-all flex flex-col justify-between gap-6 h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase text-[var(--color-text-subtle)]">
                      Tier 01 • Standard
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      Free Forever
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-2">
                    Free Explorer
                  </h3>

                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight">
                        $0
                      </span>
                      <span className="text-xs font-mono text-[var(--color-text-muted)] font-medium">
                        / forever
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--color-text-subtle)]">
                      Casual culinary salon & community access
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-6">
                    Perfect for curious food lovers looking to browse foundational public dishes and community notes.
                  </p>

                  <ul className="flex flex-col gap-3 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-5">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                      <span>All public recipes & culinary tips</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                      <span>Leave tasting notes & reviews</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                      <span>Join open community discussions</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-[var(--color-text-subtle)] line-through opacity-60">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>480+ guarded masterclass recipes</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-[var(--color-text-subtle)] line-through opacity-60">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Grand Prix contest cash prize eligibility</span>
                    </li>
                  </ul>
                </div>

                <Link to="/register?tier=free" className="w-full pt-2">
                  <Button variant="outline" size="md" className="w-full shadow-warm-xs">
                    Start Free Explorer
                  </Button>
                </Link>
              </div>

              {/* Tier 2: VIP Masterclass Pass (Monthly) */}
              <div
                className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] transition-all duration-300 flex flex-col justify-between gap-6 relative group overflow-hidden h-full ${
                  billingPlan === 'Monthly'
                    ? 'border-2 border-[var(--color-accent)] shadow-warm-xl ring-2 ring-[var(--color-accent)]/20 z-10'
                    : 'border border-[var(--color-border)] shadow-warm hover:shadow-warm-lg'
                }`}
              >
                {/* Glowing Top Ribbon */}
                <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] py-1 text-center text-[10px] font-mono font-bold uppercase text-white tracking-widest">
                  ★ MOST POPULAR SALON PASS ★
                </div>

                <div className="pt-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase text-[var(--color-accent)]">
                      Tier 02 • VIP Admission
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                      Instant Access
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-2">
                    VIP Monthly Pass
                  </h3>

                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight">
                        $100
                      </span>
                      <span className="text-xs font-mono text-[var(--color-text-muted)] font-medium">
                        / month
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--color-accent)] font-semibold">
                      Flexible monthly billing • Cancel anytime
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-6">
                    Full uninhibited access to 480+ secret recipe formulations, video notes, and grand prix contest prize eligibility.
                  </p>

                  <ul className="flex flex-col gap-3 text-xs text-[var(--color-text)] border-t border-[var(--color-border)] pt-5">
                    <li className="flex items-center gap-2.5 font-bold">
                      <Check className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span>480+ Restricted Member Formulations</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-bold">
                      <Check className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span>$1,500+ Seasonal Grand Prix Cash Contests</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-bold">
                      <Check className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span>Publish Custom Recipes & Kitchen Secrets</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-semibold">
                      <Check className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span>Step-by-step secret masterclass videos</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-semibold">
                      <Check className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span>Priority Tasting Review by Chef James</span>
                    </li>
                  </ul>
                </div>

                <Link to="/membership" className="w-full pt-2">
                  <Button
                    variant={billingPlan === 'Monthly' ? 'gold' : 'primary'}
                    size="lg"
                    rightIcon={<Crown className="w-4 h-4" />}
                    className="w-full shadow-warm"
                  >
                    Activate VIP Pass ($100/mo)
                  </Button>
                </Link>
              </div>

              {/* Tier 3: VIP Annual Patron (Best Value) */}
              <div
                className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] transition-all duration-300 flex flex-col justify-between gap-6 relative group overflow-hidden h-full ${
                  billingPlan === 'Yearly'
                    ? 'border-2 border-[var(--color-accent)] shadow-warm-xl ring-2 ring-[var(--color-accent)]/20 z-10'
                    : 'border border-[var(--color-border)] shadow-warm hover:shadow-warm-lg'
                }`}
              >
                {/* Top Badge */}
                <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-[var(--color-accent)] via-amber-500 to-[var(--color-accent)] py-1 text-center text-[10px] font-mono font-bold uppercase text-[var(--color-surface)] tracking-widest">
                  ★ BEST VALUE • SAVE $200 ANNUALLY ★
                </div>

                <div className="pt-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase text-[var(--color-text-subtle)]">
                      Tier 03 • Guild Patron
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                      Annual Pass
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-2">
                    VIP Annual Patron
                  </h3>

                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight">
                        $1,000
                      </span>
                      <span className="text-xs font-mono text-[var(--color-text-muted)] font-medium">
                        / year
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--color-primary)] font-semibold">
                      $83.33/mo • 2 Months Free (Save 17%)
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-6">
                    For serious gastronomes who desire direct masterclass interaction, physical monographs, and jury voting rights.
                  </p>

                  <ul className="flex flex-col gap-3 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-5">
                    <li className="flex items-center gap-2.5 font-semibold text-[var(--color-text)]">
                      <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span>All VIP Masterclass Pass Privileges</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-semibold text-[var(--color-text)]">
                      <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span>2 Months Completely Free ($200 direct savings)</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-semibold text-[var(--color-text)]">
                      <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span>Signed Certificate of Gastronomy</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-semibold text-[var(--color-text)]">
                      <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span>Grand Prix Jury Voting Privileges</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span>Priority Q&A during Weekend Sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span>Exclusive Hardcover Cookbook Monograph</span>
                    </li>
                  </ul>
                </div>

                <Link to="/membership" className="w-full pt-2">
                  <Button
                    variant={billingPlan === 'Yearly' ? 'gold' : 'primary'}
                    size="lg"
                    rightIcon={<Crown className="w-4 h-4" />}
                    className="w-full shadow-warm"
                  >
                    Join Annual Guild ($1,000/yr)
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bottom Security & Taste Guarantee Ribbon */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--color-border)] text-xs font-mono text-[var(--color-text-subtle)]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--color-success)]" />
                <span>14-Day Taste Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--color-success)]" />
                <span>Cancel or Switch Anytime with 1 Click</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--color-success)]" />
                <span>256-Bit Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
