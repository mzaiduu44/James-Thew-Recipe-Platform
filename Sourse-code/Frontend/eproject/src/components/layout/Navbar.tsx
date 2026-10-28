import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Menu,
  X,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Layers,
  ChevronDown,
  Trophy,
  Utensils,
  Compass,
  ArrowUpRight,
  Crown,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { UpgradeMembershipModal } from '@/components/shared/UpgradeMembershipModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode, isTransitioningTheme } = useUiStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [hoveredNavPath, setHoveredNavPath] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  interface NavItem {
    name: string;
    path: string;
    badge?: string;
    isGold?: boolean;
  }

  const primaryLinks: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Recipes', path: '/recipes', badge: 'Vault' },
    { name: 'Techniques', path: '/tips' },
    { name: 'Contests', path: '/contests', badge: 'Live', isGold: true },
    { name: 'Membership', path: '/membership', badge: 'VIP' },
  ];

  const secondaryLinks: NavItem[] = [
    { name: 'Community', path: '/community' },
    { name: 'Bulletins', path: '/announcements' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Feedback', path: '/feedback' },
  ];

  const navLinks: NavItem[] = [...primaryLinks, ...secondaryLinks];

  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  useEffect(() => {
    setIsMoreDropdownOpen(false);
  }, [location.pathname]);

  const renderNavLink = (link: NavItem, layoutIdPrefix = '') => {
    const isActive = location.pathname === link.path;
    const isHovered = hoveredNavPath === link.path;

    return (
      <Link
        key={link.path}
        to={link.path}
        onMouseEnter={() => setHoveredNavPath(link.path)}
        onClick={() => setIsMoreDropdownOpen(false)}
        className={`relative px-2 xl:px-2.5 2xl:px-2 py-1.5 rounded-full text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-colors duration-200 flex items-center gap-1 xl:gap-1.5 select-none ${
          isActive
            ? 'text-[var(--color-primary)] font-bold'
            : isHovered
            ? 'text-[var(--color-text)]'
            : 'text-[var(--color-text-muted)]'
        }`}
      >
        
        {isHovered && (
          <motion.div
            layoutId={`${layoutIdPrefix}navHoverGlassBox`}
            className="absolute inset-0 rounded-full bg-[var(--color-surface-2)]/90 backdrop-blur-md border border-[var(--color-accent)]/50 shadow-warm-sm -z-10"
            transition={{
              type: 'spring',
              stiffness: 480,
              damping: 30,
              mass: 0.5,
            }}
          />
        )}

        {isActive && !isHovered && (
          <motion.div
            layoutId={`${layoutIdPrefix}activeNavRoutePill`}
            className="absolute inset-0 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] -z-20"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}

        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
        )}

        <span>{link.name}</span>
        {link.badge && (
          <span
            className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold leading-tight ${
              link.isGold ? '' : 'hidden xl:inline-block'
            } ${
              link.isGold
                ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] animate-pulse'
                : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
            }`}
          >
            {link.badge}
          </span>
        )}
      </Link>
    );
  };

  const isSecondaryActive = secondaryLinks.some((l) => location.pathname === l.path);

  return (
    <>

      
      <header
        className={`fixed top-0 z-40 w-full transition-all duration-500 hidden lg:block ${
          isScrolled ? 'py-2 px-4 sm:px-6' : 'py-3.5 px-4 sm:px-8'
        }`}
      >
        <div
          className={`max-w-[1720px] mx-auto rounded-full border transition-all duration-500 flex items-center justify-between px-4 sm:px-6 xl:px-8 ${
            isScrolled
              ? 'glass-nav shadow-warm-lg py-2 border-[var(--color-border)]'
              : 'bg-[var(--color-surface)]/90 backdrop-blur-md shadow-warm-sm py-2.5 border-[var(--color-border)]'
          }`}
        >
          
          <Link to="/" className="flex items-center gap-2.5 xl:gap-3 group shrink-0 select-none">
            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300 shadow-warm-xs">
              <ChefHat className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold text-base xl:text-xl tracking-tight text-[var(--color-text)] leading-none group-hover:text-[var(--color-primary)] transition-colors">
                JAMES THEW
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mt-0.5">
                Culinary Salon
              </span>
            </div>
          </Link>

          <nav
            onMouseLeave={() => setHoveredNavPath(null)}
            className="flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 relative shrink min-w-0"
          >
            
            {primaryLinks.map((link) => renderNavLink(link))}

            <div className="hidden 2xl:contents">
              {secondaryLinks.map((link) => renderNavLink(link))}
            </div>

            <div className="relative 2xl:hidden">
              <button
                type="button"
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                onMouseEnter={() => setHoveredNavPath('__more__')}
                className={`relative px-2 xl:px-2.5 py-1.5 rounded-full text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-colors duration-200 flex items-center gap-1 select-none cursor-pointer ${
                  isSecondaryActive || isMoreDropdownOpen
                    ? 'text-[var(--color-primary)] font-bold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {hoveredNavPath === '__more__' && (
                  <motion.div
                    layoutId="navHoverGlassBox"
                    className="absolute inset-0 rounded-full bg-[var(--color-surface-2)]/90 backdrop-blur-md border border-[var(--color-accent)]/50 shadow-warm-sm -z-10"
                    transition={{
                      type: 'spring',
                      stiffness: 480,
                      damping: 30,
                      mass: 0.5,
                    }}
                  />
                )}
                {isSecondaryActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                )}
                <span>More</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isMoreDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isMoreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl p-2 z-50"
                  >
                    {secondaryLinks.map((link) => {
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsMoreDropdownOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                            isActive
                              ? 'text-[var(--color-primary)] bg-[var(--color-surface-2)]'
                              : 'text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
                          }`}
                        >
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                          )}
                          <span>{link.name}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            
            <motion.button
              whileHover={{ scale: 1.08, rotate: 15 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleDarkMode}
              disabled={isTransitioningTheme}
              className="p-2.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer shadow-warm-xs disabled:opacity-50"
              aria-label="Toggle visual theme"
              title="Switch between Light and Dark Mode"
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

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {role === 'User' && (
                  <button
                    type="button"
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-primary)]/20 border border-[var(--color-accent)] text-[var(--color-accent)] text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-warm-xs"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Upgrade VIP</span>
                  </button>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all cursor-pointer select-none"
                  >
                    <img
                      src={
                        user?.profileImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
                      }
                      alt={user?.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover border border-[var(--color-accent)]"
                    />
                    <span className="text-xs font-semibold text-[var(--color-text)] max-w-[90px] truncate hidden xl:inline">
                      {user?.name || 'Chef'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[var(--color-text-muted)] transition-transform duration-200 ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl p-2 z-50 text-left"
                      >
                        <div className="px-3.5 py-2.5 border-b border-[var(--color-border)] mb-1">
                          <p className="text-xs font-bold text-[var(--color-text)] truncate">{user?.name}</p>
                          <p className="text-[10px] font-mono text-[var(--color-text-muted)] truncate">{user?.email}</p>
                          <span
                            className={`inline-block mt-1 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                              role === 'Admin'
                                ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/30'
                                : role === 'Member'
                                ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-[var(--color-accent)]/40'
                                : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                            }`}
                          >
                            {role === 'Admin' ? 'Executive Chef / Admin' : role === 'Member' ? 'VIP Member Tier' : 'Free Explorer Tier'}
                          </span>
                        </div>

                        {role === 'User' && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setIsUpgradeModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--color-accent)] font-bold bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 transition-colors mb-1 cursor-pointer"
                          >
                            <Crown className="w-4 h-4" />
                            <span>Upgrade to VIP ($100/mo)</span>
                          </button>
                        )}

                        {role === 'Admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--color-primary)] font-bold hover:bg-[var(--color-surface-2)] transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Executive Console</span>
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <span>Profile & Preferences</span>
                        </Link>

                        <Link
                          to="/my-content"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors"
                        >
                          <Layers className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <span>My Formulations & Tips</span>
                        </Link>

                        <div className="my-1 border-t border-[var(--color-border)]" />

                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--color-danger)] hover:bg-[var(--color-surface-2)] font-semibold transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-agency-secondary text-xs py-2 px-3 sm:px-4 whitespace-nowrap">
                  <span>Sign In</span>
                  <div className="w-5 h-5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>

                <Link to="/membership" className="btn-agency-primary text-xs py-2 px-3 sm:px-4 whitespace-nowrap">
                  <span>VIP Pass ($100)</span>
                  <div className="arrow-disc-lime w-5 h-5">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="hidden lg:block h-[80px]" />

      
      
      <header className="fixed top-0 left-0 z-40 w-full px-3 py-3 lg:hidden">
        <div className="w-full rounded-2xl glass-nav border border-[var(--color-border)] shadow-warm px-4 py-2.5 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-warm border border-[var(--color-accent)]">
              <ChefHat className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold text-sm tracking-tight text-[var(--color-text)] leading-none">
                JAMES THEW
              </span>
              <span className="font-mono text-[8px] uppercase tracking-widest text-[var(--color-accent)] font-bold">
                Culinary Salon
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              disabled={isTransitioningTheme}
              className="p-2 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)] cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-[var(--color-primary)] text-white shadow-warm cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="block lg:hidden h-[67px]" />
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col justify-between p-5 sm:p-6 overflow-y-auto lg:hidden"
          >
            
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                  <ChefHat className="w-4 h-4" />
                </div>
                <span className="font-serif font-bold text-base text-[var(--color-text)]">
                  JAMES THEW SALON
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5 py-4 text-left">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-2xl text-base font-serif font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors"
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="pt-4 border-t border-[var(--color-border)] flex flex-col gap-3">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  {role === 'User' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsUpgradeModalOpen(true);
                      }}
                      className="btn-agency-primary w-full justify-center text-xs"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Upgrade to VIP Pass ($100/mo)</span>
                    </button>
                  )}
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <button type="button" className="btn-agency-secondary w-full justify-center text-xs">
                      <span>My Profile ({user?.name})</span>
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full py-2.5 rounded-full text-xs text-[var(--color-danger)] font-semibold bg-[var(--color-surface-2)] cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button type="button" className="btn-agency-secondary w-full justify-center text-xs">
                      <span>Sign In</span>
                    </button>
                  </Link>
                  <Link to="/membership" onClick={() => setIsMobileMenuOpen(false)}>
                    <button type="button" className="btn-agency-primary w-full justify-center text-xs">
                      <span>VIP Pass</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      
      <div className="fixed bottom-3 inset-x-2 sm:inset-x-4 z-30 lg:hidden">
        <div className="w-full max-w-sm mx-auto rounded-full glass-nav border border-[var(--color-border)] shadow-warm-xl px-2 sm:px-4 py-2 flex items-center justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              location.pathname === '/' ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/recipes"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              location.pathname.startsWith('/recipes')
                ? 'text-[var(--color-primary)] font-bold'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Vault</span>
          </Link>

          <Link
            to="/contests"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              location.pathname.startsWith('/contests')
                ? 'text-[var(--color-accent)] font-bold'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Contests</span>
          </Link>

          <Link
            to="/membership"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              location.pathname.startsWith('/membership')
                ? 'text-[var(--color-accent)] font-bold'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>VIP</span>
          </Link>

          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              location.pathname === '/profile' || location.pathname === '/login'
                ? 'text-[var(--color-primary)] font-bold'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>{isAuthenticated ? 'Chef' : 'Sign In'}</span>
          </Link>
        </div>
      </div>

      <UpgradeMembershipModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        triggerTitle="Unlock unrestricted access to 480+ recipes, secrets, & cash prize contests"
      />
    </>
  );
};

export default Navbar;
