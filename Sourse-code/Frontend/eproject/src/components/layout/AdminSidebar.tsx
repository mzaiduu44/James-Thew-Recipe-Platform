import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Utensils,
  Lightbulb,
  Trophy,
  Megaphone,
  MessageSquare,
  HelpCircle,
  Users,
  ArrowLeft,
  ChefHat,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();

  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const links = [
    { name: 'Dashboard Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Manage Recipes', path: '/admin/recipes', icon: <Utensils className="w-4 h-4" />, badge: 'Free/VIP' },
    { name: 'Manage Tips', path: '/admin/tips', icon: <Lightbulb className="w-4 h-4" /> },
    { name: 'Contests & Winners', path: '/admin/contests', icon: <Trophy className="w-4 h-4" /> },
    { name: 'Announcements', path: '/admin/announcements', icon: <Megaphone className="w-4 h-4" /> },
    { name: 'Recipe Feedback', path: '/admin/feedback', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Manage FAQ (7+)', path: '/admin/faq', icon: <HelpCircle className="w-4 h-4" /> },
    { name: 'User Management', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-5 sm:p-6 text-left">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between pb-5 border-b border-[var(--color-border)]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-warm-sm">
              <ChefHat className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold text-base text-[var(--color-text)]">
                JAMES THEW
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)] font-bold">
                Admin Console
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-1.5">
          {links.map((link) => {
            const isActive =
              link.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-warm'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-[var(--color-border)]">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Salon</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-72 shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] shadow-warm-sm sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-xl"
              style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[calc(100vw-2.5rem)] bg-[var(--color-surface)] border-r border-[var(--color-border)] shadow-warm-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
