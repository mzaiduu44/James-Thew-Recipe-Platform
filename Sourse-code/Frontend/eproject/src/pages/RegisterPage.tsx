import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Check,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Phone as PhoneIcon,
  User as UserIcon,
  Lock,
  Crown,
  Camera,
  Upload,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { authApi } from '@/services/api/auth.api';
import { mediaApi } from '@/api/media';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageContainer } from '@/components/layout/PageContainer';
import { TextHoverEffect } from '@/components/ui/TextHoverEffect';
import { normalizeImageUrl } from '@/components/shared/AppImage';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addToast } = useUiStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field validation and touched states
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  // Live password requirement tests
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasMinLength, hasNumber, hasLetter, hasSpecial].filter(Boolean).length;
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong Key'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  const strengthTextColors = ['text-red-500', 'text-orange-500', 'text-amber-500', 'text-blue-500', 'text-emerald-500'];

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Italian Classics',
    'Knife Skills',
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const culinaryInterests = [
    'French Haute Cuisine',
    'Italian Classics',
    'Artisan Bakery & Sourdough',
    'Knife Skills & Prep',
    'Seafood & Shellfish',
    'Sauces & Reductions',
    'Grand Prix Competition',
    'Wine & Flavor Pairing',
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Image size exceeds 5MB limit.');
      return;
    }

    setImageUploadError('');
    setIsUploadingImage(true);

    try {
      const uploadedPath = await mediaApi.upload(file);
      if (uploadedPath) {
        setProfileImage(uploadedPath);
        addToast({
          type: 'success',
          title: 'Photo Uploaded',
          message: 'Your profile picture has been uploaded.',
        });
      }
    } catch (err: any) {
      setImageUploadError('Failed to upload image. Please try another file.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        profileImage: profileImage || undefined,
        accountTier: 'Free',
        planType: 'Free',
      });

      setAuth(response.token, response.user);

      addToast({
        type: 'success',
        title: 'Welcome to James Thew! 🌱',
        message: `Welcome ${name || 'Food Lover'}! Your Free Explorer account is active.`,
      });

      navigate('/profile');
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        'Registration failed. Please check your details and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start text-left">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: 3D CARD SIMULATOR & PRIVILEGES */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-accent)] text-xs font-mono font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Explorer Pass ($0)</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-text)] leading-tight">
              <TextHoverEffect text="Join as a Culinary Explorer" effect="wave" />
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">
              Create your free account to access standard recipes, join community discussions, leave tasting reviews, and upgrade to VIP membership anytime.
            </p>
          </div>

          {/* LIVE 3D INTERACTIVE CARD PREVIEW */}
          <div className="w-full min-h-[200px] aspect-auto sm:aspect-[1.586] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 flex flex-col justify-between text-white relative overflow-hidden shadow-warm-xl border border-white/15 bg-gradient-to-tr from-[#1c2430] via-[#2d3748] to-[#1a202c]">
            {/* Ambient Card Glows */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

            {/* Top Card Bar */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-slate-300" />
                <span className="font-serif font-bold text-sm tracking-wider">JAMES THEW</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full border text-slate-300 bg-slate-700/50 border-slate-500/40">
                FREE EXPLORER
              </span>
            </div>

            {/* Center Area: Profile Photo + Chip */}
            <div className="flex items-center justify-between relative z-10 my-4 sm:my-0">
              {/* EMV Chip Visual */}
              <div className="w-11 h-8 rounded-lg border shadow-md flex items-center justify-center bg-gradient-to-tr from-[#94a3b8] via-[#e2e8f0] to-[#64748b] border-slate-300/60">
                <div className="w-7 h-5 border border-black/20 rounded flex flex-col justify-between py-0.5 px-1">
                  <span className="w-full h-px bg-black/30" />
                  <span className="w-full h-px bg-black/30" />
                </div>
              </div>

              {/* Avatar Preview */}
              {profileImage ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-md">
                  <img
                    src={normalizeImageUrl(profileImage)}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-700/60 border border-white/20 flex items-center justify-center text-slate-300">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Card Number & Info */}
            <div className="flex flex-col gap-1 relative z-10">
              <span className="font-mono text-base sm:text-lg tracking-widest text-white">
                FREE •••• ACCESS •••• PASS
              </span>
              <div className="flex items-center justify-between text-[10px] font-mono text-white/80 mt-1">
                <div>
                  <span className="block text-[8px] uppercase text-slate-400">Cardholder</span>
                  <span className="font-bold text-white uppercase truncate max-w-[150px] block">
                    {name || 'FOOD LOVER'}
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase text-slate-400">Role</span>
                  <span className="font-bold text-white uppercase">STANDARD USER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privileges List */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col gap-2.5 text-xs text-[var(--color-text-muted)]">
            <span className="font-mono uppercase text-[var(--color-primary)] font-bold text-[10px] mb-1">
              Free Explorer Account Features:
            </span>

            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" />
              <span>Access to all public standard recipes & culinary tips</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" />
              <span>Leave tasting reviews & rating notes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" />
              <span>Submit community feedback & recipe requests</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-subtle)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" />
              <span>Upgrade to VIP ($100/mo or $1,000/yr) anytime from Profile</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REGISTRATION FORM */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl">
          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 rounded-2xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-xs text-[var(--color-danger)] font-bold flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-[var(--color-danger)] mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-sm">Registration Notice</p>
                  <p className="mt-0.5 text-xs font-normal">{error}</p>
                </div>
              </div>
            )}

            {/* VIP Upgrade Banner (Clear Role Hierarchy) */}
            <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-accent)]/30 flex items-start gap-3.5">
              <Crown className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-[var(--color-text)] block mb-0.5">
                  Looking for VIP Masterclass Access?
                </span>
                <span className="text-[var(--color-text-muted)] leading-relaxed">
                  Per salon regulations, all chefs begin with a free account. After creating your profile, you can unlock full VIP access ($100/mo or $1,000/yr) instantly with a single click.
                </span>
              </div>
            </div>

            {/* Profile Picture Upload Section */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block font-bold">
                Profile Picture (Optional)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-[var(--color-surface)] border-2 border-[var(--color-border)] shrink-0 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={normalizeImageUrl(profileImage)}
                      alt="Uploaded avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ChefHat className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-text-subtle)]" />
                  )}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 flex-1 w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                    >
                      {profileImage ? 'Change Photo' : 'Upload Avatar'}
                    </Button>
                    {profileImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setProfileImage('')}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    JPG, PNG, or WebP up to 5MB. Rendered across your recipes & profile.
                  </span>
                  {imageUploadError && (
                    <span className="text-[11px] text-[var(--color-danger)] font-bold">
                      {imageUploadError}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div className="flex flex-col gap-4">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block font-bold">
                Account Credentials
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={name}
                  leftIcon={<UserIcon className="w-4 h-4" />}
                  error={touched.name ? errors.name : undefined}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, name: true }));
                    validate();
                  }}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (touched.name) {
                      if (!e.target.value.trim() || e.target.value.trim().length < 2) {
                        setErrors((prev) => ({ ...prev, name: 'Full name is required (minimum 2 characters).' }));
                      } else {
                        setErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }
                  }}
                  placeholder="e.g. Marcus Wareing"
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={touched.email ? errors.email : undefined}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, email: true }));
                    validate();
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) {
                      if (!e.target.value.trim()) {
                        setErrors((prev) => ({ ...prev, email: 'Email address is required.' }));
                      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value.trim())) {
                        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
                      } else {
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }
                  }}
                  placeholder="chef@restaurant.com"
                />
              </div>

              <Input
                label="Phone Number (Optional)"
                type="tel"
                value={phone}
                leftIcon={<PhoneIcon className="w-4 h-4" />}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                helperText="For competition and contest notification alerts."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
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
                        } else if (e.target.value.length < 8) {
                          setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters.' }));
                        } else {
                          setErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }
                    }}
                    placeholder="••••••••"
                  />

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[var(--color-text-subtle)]">Strength:</span>
                        <span className={`font-bold ${strengthTextColors[strengthScore]}`}>
                          {strengthLabels[strengthScore]}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                        {[0, 1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`h-full transition-all duration-300 ${
                              strengthScore > step ? strengthColors[strengthScore] : 'opacity-20 bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  error={touched.confirmPassword ? errors.confirmPassword : undefined}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, confirmPassword: true }));
                    validate();
                  }}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (touched.confirmPassword) {
                      if (!e.target.value) {
                        setErrors((prev) => ({ ...prev, confirmPassword: 'Please confirm your password.' }));
                      } else if (e.target.value !== password) {
                        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
                      } else {
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }
                    }
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Primary Culinary Interests */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block font-bold mb-2">
                Primary Culinary Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {culinaryInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--color-primary)] text-white shadow-warm-xs'
                          : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full shadow-warm-lg"
            >
              Create Free Explorer Account ($0)
            </Button>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)] text-center sm:text-left">
              <span>
                Already have an account?{' '}
                <Link to="/login" className="text-[var(--color-primary)] font-bold hover:underline">
                  Sign In
                </Link>
              </span>
              <span className="text-[11px] font-mono text-[var(--color-text-subtle)]">
                Upgrade to VIP anytime
              </span>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default RegisterPage;
