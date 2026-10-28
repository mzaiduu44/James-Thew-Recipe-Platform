import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { ThemeTransitionCurtain } from './ThemeTransitionCurtain';
import { ScrollToTop } from '../shared/ScrollToTop';
import { ArrowUpRight, Sun, Moon, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout: React.FC = () => {
  const { user } = useAuthStore();
  const { isDarkMode, toggleDarkMode, isTransitioningTheme } = useUiStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row bg-[var(--color-bg)] text-[var(--color-text)]">
      <ScrollToTop />
      <ThemeTransitionCurtain />

      <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0 shadow-warm-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[var(--color-text-muted)] font-mono truncate max-w-[130px] sm:max-w-none">
              <span className="text-[var(--color-primary)] font-bold truncate">Executive Office</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-[var(--color-text)] font-semibold hidden sm:inline truncate">Chef James Thew Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleDarkMode}
              disabled={isTransitioningTheme}
              className="p-2 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Toggle theme"
              title="Switch Visual Atmosphere (2.0s Golden Veil)"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-[var(--color-accent)]" />
                  ) : (
                    <Moon className="w-4 h-4 text-[var(--color-primary)]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <div className="flex items-center gap-2">
              <img
                src={
                  user?.profileImage ||
                  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200'
                }
                alt={user?.name || 'Admin'}
                className="w-7 h-7 rounded-full object-cover border border-[var(--color-accent)] shadow-warm-xs"
              />
              <span className="text-xs font-bold text-[var(--color-text)] hidden sm:inline">
                {user?.name || 'James Thew'}
              </span>
            </div>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all shadow-warm-xs"
            >
              <span>Live Site</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;