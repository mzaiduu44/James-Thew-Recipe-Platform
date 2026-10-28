import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChefHat,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Crown,
} from 'lucide-react';
import { authApi } from '@/services/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageContainer } from '@/components/layout/PageContainer';
import { TextHoverEffect } from '@/components/ui/TextHoverEffect';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const { addToast } = useUiStore();

  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Field validation and touched states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email format (e.g. name@domain.com).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email: email.trim(), password });
      setAuth(response.token, response.user);
      addToast({
        type: 'success',
        title: 'Salon Admission Granted 👑',
        message: `Welcome back, ${response.user.name} (${response.user.role} Tier).`,
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch min-h-[75vh]">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: EDITORIAL VISUAL & SALON TESTIMONIAL */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 relative rounded-2xl sm:rounded-[36px] overflow-hidden border border-[var(--color-border)] shadow-warm-xl hidden md:flex flex-col justify-between p-6 sm:p-8 md:p-12 text-white bg-gradient-to-t from-black/90 via-black/40 to-black/20"
        >
          {/* Background Photography */}
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1000"
            alt="Chef James Thew private kitchen"
            className="absolute inset-0 w-full h-full object-cover -z-10 brightness-95"
          />

          {/* Top Brand Monogram Seal */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-warm-lg border border-[var(--color-accent)]">
                <ChefHat className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-bold text-lg tracking-tight">JAMES THEW</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-accent)] font-bold">
                  Private Gastronomy Club
                </span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
              EST. 2024
            </div>
          </div>

          {/* Bottom Testimonial & Credibility Plaque */}
          <div className="z-10 text-left flex flex-col gap-4">
            <div className="p-6 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-warm-lg flex flex-col gap-3">
              <div className="flex items-center gap-1 text-[var(--color-accent)]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest">
                  Verified Member Experience
                </span>
              </div>
              <blockquote className="font-serif italic text-sm sm:text-base leading-relaxed text-white">
                “The precision of James Thew’s emulsion ratios and pasta formulations completely transformed my kitchen discipline.”
              </blockquote>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 font-mono text-white/80">
                <span>Sophia Lorenza • VIP Member #1084</span>
                <span className="text-[var(--color-accent)]">★ ★ ★ ★ ★</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REFINED LOGIN ADMISSION FORM */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 p-4 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl flex flex-col justify-between text-left"
        >
          <div>
            {/* Header Title */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-accent)] text-xs font-mono font-bold mb-3">
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypted Salon Access</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text)] leading-tight">
                <TextHoverEffect text="Sign In to Kitchen Pass" effect="wave" />
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">
                Enter your credentials to access your formulations, preferences, and private masterclasses.
              </p>
            </div>

            {/* Main Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-[var(--color-danger)]/15 border border-[var(--color-danger)]/30 text-xs text-[var(--color-danger)] font-bold">
                  {error}
                </div>
              )}

              <Input
                label="Email Coordinates"
                type="email"
                required
                value={email}
                error={touched.email ? errors.email : undefined}
                onBlur={() => {
                  setTouched((t) => ({ ...t, email: true }));
                  validate();
                }}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, email: 'Email address is required.' }));
                    } else if (!emailRegex.test(e.target.value.trim())) {
                      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email format.' }));
                    } else {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }
                }}
                placeholder="chef@jamesthew.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Pass Key / Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                error={touched.password ? errors.password : undefined}
                onBlur={() => {
                  setTouched((t) => ({ ...t, password: true }));
                  validate();
                }}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    if (!e.target.value) {
                      setErrors((prev) => ({ ...prev, password: 'Password is required.' }));
                    } else if (e.target.value.length < 6) {
                      setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters long.' }));
                    } else {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }
                }}
                placeholder="••••••••"
                leftIcon={<KeyRound className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
                    title={showPassword ? 'Hide Pass Key' : 'Show Pass Key'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full mt-2 shadow-warm-lg"
              >
                Enter Culinary Salon
              </Button>
            </form>
          </div>

          {/* Footer Registration Links */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-text-muted)] text-center sm:text-left">
            <span>
              Don’t have an active account?{' '}
              <Link to="/register" className="text-[var(--color-primary)] font-bold hover:underline">
                Create Free Account
              </Link>
            </span>
            <Link to="/membership" className="text-[var(--color-accent)] font-bold hover:underline flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              <span>VIP Membership ($100/mo)</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};
