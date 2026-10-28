import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowUp,
  Mail,
  CheckCircle2,
  ArrowUpRight,
  ChefHat,
  Sparkles,
  Award,
  Crown,
  Heart,
} from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { FooterMegaWordmark } from './FooterMegaWordmark';

export const Footer: React.FC = () => {
  const { addToast } = useUiStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    addToast({
      type: 'success',
      title: 'Salon Gazette Subscription Confirmed 📜',
      message: 'You have been enrolled in Chef James Thew’s private culinary dispatches and secret formulations.',
    });
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] text-left transition-colors duration-400 relative overflow-hidden pb-24 sm:pb-20 md:pb-8">
      <div className="glow-agency-footer" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 pt-16 sm:pt-20 pb-8 relative z-10 flex flex-col justify-between gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[var(--color-border)] items-center">
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-accent)] text-xs font-mono font-bold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE EXECUTIVE MONOGRAPH & SALON</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text)] tracking-tight leading-snug">
              Elevate your kitchen discipline to{' '}
              <span className="italic font-normal text-[var(--color-primary)]">Michelin standards</span>.
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
              Curated by 5-star executive chef James Thew. Discover authentic haute cuisine formulations, kitchen kinetics, and seasonal Grand Prix competitions.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3 bg-[var(--color-surface-2)] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--color-border)] shadow-warm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[var(--color-accent)] font-bold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Private Gazette Dispatch</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-subtle)]">Weekly Release</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Get secret chef ratios, knife mechanics notes, and live contest notifications directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-1">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="apprentice@culinary.com"
                  className="w-full bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] text-xs rounded-full pl-10 pr-3 py-3 border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)] transition-all input-focus-ring"
                />
              </div>
              <button type="submit" className="btn-agency-primary text-xs shrink-0 py-2.5 px-5 justify-center">
                <span>Join Gazette</span>
                <div className="arrow-disc-lime w-5 h-5">
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </button>
            </form>
            {isSubscribed && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs text-[var(--color-success)] font-medium pt-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Enrolled in Weekly Formulation Gazette. Welcome aboard!</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[var(--color-border)]">
          <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-[var(--color-accent)] font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <span>01 / Formulations</span>
            </span>
            <Link to="/recipes" className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all">
              Recipe Vault (480+)
            </Link>
            <Link to="/tips" className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all">
              Pro Kitchen Secrets
            </Link>
            <Link to="/membership" className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all flex items-center gap-1.5">
              <span>VIP Pass ($100/mo)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] font-bold">
                VIP
              </span>
            </Link>
            <Link to="/community" className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all">
              Community Kitchen
            </Link>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-[var(--color-accent)] font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <span>02 / Grand Prix</span>
            </span>
            <Link to="/contests" className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all flex items-center gap-1.5">
              <span>Live Competitions</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold animate-pulse">
                OPEN
              </span>
            </Link>
            <Link to="/announcements" className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all">
              Winner Bulletins & Crowns
            </Link>
            <Link to="/feedback" className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all">
              Tasting Critiques & Reviews
            </Link>
            <Link to="/faq" className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all">
              Rules & FAQ (7 Points)
            </Link>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-[var(--color-accent)] font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <span>03 / Connect</span>
            </span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all inline-flex items-center gap-1"
            >
              <span>Instagram Masterclass</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all inline-flex items-center gap-1"
            >
              <span>YouTube TV Series</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all inline-flex items-center gap-1">
              <span>Executive Chef Guild</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
            <Link to="/profile" className="text-sm font-semibold text-[var(--color-text)] hover-expand-letter transition-all">
              Account Management
            </Link>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-[var(--color-accent)] font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <span>04 / Global Studios</span>
            </span>
            <div className="text-xs text-[var(--color-text-muted)] font-mono leading-relaxed flex flex-col gap-2">
              <div>
                <span className="text-[var(--color-text)] font-bold block">Mayfair Laboratory:</span>
                <span>14 Berkeley Square, London W1J 5AW</span>
              </div>
              <div>
                <span className="text-[var(--color-text)] font-bold block">Mediterranean Atelier:</span>
                <span>Via Condotti 42, 00187 Rome</span>
              </div>
              <div className="pt-1 text-[11px] text-[var(--color-accent)] font-semibold">
                Weekend Public Sessions Available
              </div>
            </div>
          </div>
        </div>
        <div className="py-6 sm:py-10 text-center select-none overflow-visible">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <span>Live Salon Sessions • London • Paris • Rome • Tokyo</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="px-4 py-2 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs font-mono font-bold text-[var(--color-text)] flex items-center gap-2 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer shadow-warm-xs"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            </motion.button>
          </div>

          <FooterMegaWordmark />
        </div>

        <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--color-text-subtle)] text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <Link to="/faq" className="hover:text-[var(--color-text)] transition-colors">
              Privacy Charter
            </Link>
            <Link to="/faq" className="hover:text-[var(--color-text)] transition-colors">
              Terms of Salon
            </Link>
            <Link to="/feedback" className="hover:text-[var(--color-text)] transition-colors">
              Critique & Feedback
            </Link>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-[var(--color-accent)] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span>Aptech Capstone Deliverable</span>
            </span>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            <span>for Chef James Thew © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
