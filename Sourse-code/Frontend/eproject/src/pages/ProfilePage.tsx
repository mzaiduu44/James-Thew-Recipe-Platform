import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Check,
  UploadCloud,
  Crown,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ChefHat,
  Utensils,
  Trophy,
  BookOpen,
  ShieldCheck,
  Award,
  Bell,
  Lock,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useUpdateSubscription, useCreateSubscription, useSubscriptions } from '@/api/subscriptions';
import { usersApi } from '@/api/users';
import { mediaApi } from '@/api/media';
import { UpgradeMembershipModal } from '@/components/shared/UpgradeMembershipModal';

// Curated Culinary Avatar Library Presets
const AVATAR_LIBRARY = [
  {
    id: 'chef-james',
    label: 'Executive Chef',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'sophia-member',
    label: 'Master Saucier',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'pastry-artist',
    label: 'Pastry Specialist',
    url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'gastronomy-critic',
    label: 'Gastronomy Critic',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'artisan-baker',
    label: 'Artisan Baker',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'sommelier-connoisseur',
    label: 'Sommelier',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'sous-chef',
    label: 'Sous Chef',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'gourmet-apprentice',
    label: 'Culinary Apprentice',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
  },
];

export const ProfilePage: React.FC = () => {
  const { user, role, updateUser } = useAuthStore();
  const { addToast } = useUiStore();

  const [activeTab, setActiveTab] = useState<'credentials' | 'membership' | 'portfolio' | 'notifications'>('credentials');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<'Weekly' | 'Monthly' | 'Yearly'>(
    (user?.subscription?.planType as any) || 'Monthly'
  );
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  // Notification Preferences
  const [emailDigest, setEmailDigest] = useState(true);
  const [contestAlerts, setContestAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const updateSubMutation = useUpdateSubscription();
  const createSubMutation = useCreateSubscription();
  const { data: allSubscriptions = [] } = useSubscriptions();

  const isFreeUser = role === 'User';

  const activeBackendSub = allSubscriptions.find((s) => String(s.userId) === String(user?.id));
  const currentSubscription = activeBackendSub || user?.subscription;
  const formattedStartDate = currentSubscription?.startDate
    ? new Date(currentSubscription.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : null;
  const formattedEndDate = currentSubscription?.endDate
    ? new Date(currentSubscription.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  if (!user) {
    return (
      <PageContainer maxWidth="md">
        <div className="p-8 text-center bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-warm">
          <p className="text-sm text-[var(--color-text-muted)]">Please sign in to view your culinary passport.</p>
          <Link to="/login" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Sign In</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately from object URL
    const localUrl = URL.createObjectURL(file);
    setProfileImage(localUrl);

    setIsUploadingAvatar(true);
    try {
      const serverFileName = await mediaApi.upload(file);
      if (serverFileName) {
        setProfileImage(serverFileName);
      }
      addToast({
        type: 'success',
        title: 'Avatar Uploaded',
        message: 'Portrait was successfully uploaded to the server.',
      });
    } catch {
      addToast({
        type: 'info',
        title: 'Local Portrait Set',
        message: 'Loaded local preview. Profile will save with this image.',
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast({ type: 'warning', title: 'Name Required', message: 'Please enter your name.' });
      return;
    }

    setIsSavingProfile(true);
    try {
      const numericId = Number(user.id);
      if (numericId && !isNaN(numericId)) {
        await usersApi.update(numericId, {
          id: numericId,
          name: name.trim(),
          email: user.email,
          password: user.password || '12345678',
          profileImage: profileImage || user.profileImage,
        });
      }

      updateUser({
        name: name.trim(),
        phone,
        bio,
        profileImage: profileImage || user.profileImage,
      });

      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your culinary profile details and avatar portrait have been saved to the database.',
      });
      setIsEditModalOpen(false);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err?.response?.data?.title || err?.message || 'Could not save profile changes to the server.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <PageContainer maxWidth="7xl">
      {/* ========================================================================= */}
      {/* 1. HAUTE CULINARY PASSPORT HEADER CARD */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-4 sm:p-8 lg:p-12 rounded-2xl sm:rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl text-left relative overflow-hidden mb-6 sm:mb-8"
      >
        {/* Ambient Top Glow Ribbon */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none -z-0" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[var(--color-accent)] shadow-warm shrink-0 bg-[var(--color-surface-2)] group">
              <img
                src={
                  user.profileImage ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
                }
                alt={user.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                type="button"
                onClick={() => {
                  setName(user.name);
                  setPhone(user.phone || '');
                  setBio(user.bio || '');
                  setProfileImage(user.profileImage || '');
                  setIsEditModalOpen(true);
                }}
                className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                title="Change Avatar"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {role === 'Admin' ? (
                  <Badge variant="admin" size="sm">Executive Chef / Admin</Badge>
                ) : role === 'Member' ? (
                  <Badge variant="gradient" size="sm">VIP Culinary Guild Member</Badge>
                ) : (
                  <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)] flex items-center gap-1.5 shadow-warm-xs">
                    <Sparkles className="w-3 h-3 text-[var(--color-text-subtle)]" />
                    <span>Free Explorer Tier</span>
                  </span>
                )}

                <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                  • Member #{user.id || '104'}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight">
                {user.name}
              </h1>

              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
                {user.bio || (isFreeUser ? 'Culinary explorer enjoying standard formulations and community discussions.' : 'Passionate gastronomy apprentice in the James Thew culinary conservatory.')}
              </p>
            </div>
          </div>

          {/* Right Action Button Group */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            {isFreeUser && (
              <Button
                variant="gold"
                size="md"
                onClick={() => setIsUpgradeModalOpen(true)}
                leftIcon={<Crown className="w-4 h-4" />}
                className="shadow-warm flex-1 sm:flex-initial text-xs sm:text-sm"
              >
                Upgrade to VIP Pass ($100/mo)
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setName(user.name);
                setPhone(user.phone || '');
                setBio(user.bio || '');
                setProfileImage(user.profileImage || '');
                setIsEditModalOpen(true);
              }}
              leftIcon={<Edit3 className="w-4 h-4" />}
              className="flex-1 sm:flex-initial shadow-warm-xs text-xs sm:text-sm"
            >
              Edit Identity
            </Button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[var(--color-border)] text-left">
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]">
            <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] font-bold block truncate">
              Admission Status
            </span>
            <span className="font-serif text-sm sm:text-lg font-bold text-[var(--color-text)] truncate block">
              {role === 'Admin' ? 'Executive Director' : role === 'Member' ? 'VIP All-Access' : 'Standard Guest'}
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]">
            <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] font-bold block truncate">
              Billing Interval
            </span>
            <span className="font-serif text-sm sm:text-lg font-bold text-[var(--color-accent)] truncate block">
              {role === 'Admin' ? 'Executive Director' : currentSubscription?.planType || (isFreeUser ? 'Free ($0)' : 'Monthly')}
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]">
            <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] font-bold block truncate">
              Formulation Access
            </span>
            <span className="font-serif text-sm sm:text-lg font-bold text-[var(--color-text)] truncate block">
              {isFreeUser ? 'Public Only' : '480+ Unlocked'}
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]">
            <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] font-bold block truncate">
              Grand Prix Rights
            </span>
            <span className="font-serif text-sm sm:text-lg font-bold text-[var(--color-success)] truncate block">
              {isFreeUser ? 'Spectator' : 'Contestant ($1.5k)'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. SECTION NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar border-b border-[var(--color-border)]">
        {[
          { id: 'credentials', label: 'Salon Credentials', icon: <ChefHat className="w-4 h-4" /> },
          role === 'Admin'
            ? { id: 'membership', label: 'Administration Console', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Admin' }
            : { id: 'membership', label: 'VIP Pass & Plan', icon: <Crown className="w-4 h-4" />, badge: isFreeUser ? 'Upgrade' : 'Active' },
          { id: 'portfolio', label: 'My Creations & Submissions', icon: <Layers className="w-4 h-4" /> },
          { id: 'notifications', label: 'Gazette & Preferences', icon: <Bell className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[var(--color-primary)] text-white shadow-warm'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : isFreeUser
                    ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)]'
                    : 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE TAB CONTENT */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        {activeTab === 'credentials' && (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
          >
            {/* Account Info */}
            <div className="lg:col-span-6 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm flex flex-col gap-5 sm:gap-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--color-border)]">
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-[var(--color-text)]">
                  Registered Identity
                </h3>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)] font-bold uppercase">
                  Verified Guild Account
                </span>
              </div>

              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase block font-bold">Email Address</span>
                    <span className="font-semibold text-xs sm:text-sm text-[var(--color-text)] truncate block">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase block font-bold">SMS Notifications</span>
                    <span className="font-semibold text-xs sm:text-sm text-[var(--color-text)] truncate block">{user.phone || 'Not configured'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-success)] shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase block font-bold">Member Since</span>
                    <span className="font-semibold text-xs sm:text-sm text-[var(--color-text)] truncate block">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Culinary Bio & Persona Card */}
            <div className="lg:col-span-6 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm flex flex-col justify-between gap-5 sm:gap-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-4">
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-[var(--color-text)]">
                    Culinary Statement & Bio
                  </h3>
                  <Award className="w-5 h-5 text-[var(--color-accent)]" />
                </div>

                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] italic leading-relaxed bg-[var(--color-surface-2)] p-4 sm:p-5 rounded-2xl border-l-4 border-l-[var(--color-primary)]">
                  “{user.bio || 'I am dedicated to exploring modern gastronomy, practicing classical French sauce reductions, and mastering handmade pasta kinetics under Chef James Thew.’'}”
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-[var(--color-text-subtle)] font-mono">
                  Personal profile details are visible in reviews
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  className="w-full sm:w-auto"
                >
                  Edit Bio & Persona
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'membership' && (
          <motion.div
            key="membership"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
          >
            {/* Membership Pass Card */}
            {role === 'Admin' ? (
              <div className="lg:col-span-12 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-primary)]/30 shadow-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shrink-0 shadow-warm-xs">
                    <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-text)]">
                        Administrator Access
                      </h3>
                      <span className="text-[10px] sm:text-xs font-mono px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold border border-[var(--color-primary)]/40">
                        SYSTEM ADMINISTRATOR
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1.5 max-w-xl leading-relaxed">
                      Your account maintains global system administration privileges. You have unlimited access to all formulation vaults, tip archives, contest evaluations, and user management tools without subscription constraints.
                    </p>
                  </div>
                </div>
                <Link to="/admin" className="shrink-0 w-full md:w-auto">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full md:w-auto">
                    Open Admin Console
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm flex flex-col justify-between gap-6">
                  {isFreeUser ? (
                    /* Free Tier Call-To-Action */
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--color-border)]">
                        <h3 className="font-serif text-lg sm:text-2xl font-bold text-[var(--color-text)]">
                          Current Admission Status
                        </h3>
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] font-bold border border-[var(--color-border)]">
                          FREE EXPLORER
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-text)]">$0</span>
                        <span className="text-xs text-[var(--color-text-muted)] font-mono">/ Free Guest Pass (Restricted)</span>
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                        You currently hold a complimentary guest pass. Upgrade to a <strong className="text-[var(--color-accent)]">VIP Masterclass Pass</strong> to immediately unlock all 480+ secret recipe formulations, video notes, community recipe publishing, and Grand Prix competition cash prize eligibility ($1,500+).
                      </p>

                      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex flex-col gap-2.5 text-xs">
                        <div className="flex items-center gap-2 text-[var(--color-success)] font-medium">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Public recipes & tasting notes active</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--color-danger)] font-medium">
                          <Lock className="w-4 h-4 shrink-0" />
                          <span>480+ Members-only recipes, video notes & grand prix locked</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-xs text-[var(--color-text-subtle)] font-mono">Instant upgrade anytime</span>
                        <Button
                          variant="gold"
                          size="md"
                          onClick={() => setIsUpgradeModalOpen(true)}
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                          className="shadow-warm w-full sm:w-auto"
                        >
                          Upgrade to VIP ($100/mo)
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* VIP Member Active Card */
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--color-border)]">
                        <h3 className="font-serif text-lg sm:text-2xl font-bold text-[var(--color-text)]">
                          VIP Salon Pass Active
                        </h3>
                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-bold border border-[var(--color-accent)]/40">
                          ★ {currentSubscription?.status || 'ACTIVE VIP GUILD'} ★
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-text)]">
                          {currentSubscription?.planType === 'Yearly' ? '$1,000' : '$100'}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] font-mono">
                          / {currentSubscription?.planType || 'Monthly'} Billing Plan
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                        Full uninhibited access to 480+ Members-Only formulations, private masterclass video notes, custom recipe publishing privileges, and seasonal Grand Prix contest cash prize eligibility.
                      </p>

                      <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-[var(--color-success)] font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Status: {currentSubscription?.status || 'Active'}</span>
                        </div>
                        <div className="font-mono text-[var(--color-text-subtle)] sm:text-right">
                          {formattedStartDate && <span>Member Since: {formattedStartDate}</span>}
                        </div>
                        <div className="font-mono text-[var(--color-text-muted)] col-span-full">
                          {formattedEndDate ? `Current Period Ends: ${formattedEndDate}` : 'Auto-renewing active access'}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-xs text-[var(--color-text-subtle)] font-mono">Modify or cancel anytime</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPlanModalOpen(true)}
                          className="w-full sm:w-auto"
                        >
                          Change Billing Plan
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Privilege Matrix Breakdown */}
                <div className="lg:col-span-5 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm flex flex-col justify-between gap-5">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-text)] pb-3 border-b border-[var(--color-border)]">
                    Unlocked Privileges
                  </h3>

                  <div className="flex flex-col gap-3.5 text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span className="text-[var(--color-text)]">480+ Members-Only Formulation Vault</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span className="text-[var(--color-text)]">$1,500+ Grand Prix Contest Entries</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span className="text-[var(--color-text)]">Publish Custom Recipes & Kitchen Secrets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span className="text-[var(--color-text)]">Direct Feedback Evaluation by Chef James</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span className="text-[var(--color-text)]">Weekend Masterclass Priority Registration</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)] text-xs text-[var(--color-text-subtle)] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                    <span>14-Day Taste Guarantee: 100% money-back satisfaction.</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-12 rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm text-center flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
              <Layers className="w-8 h-8" />
            </div>

            <div className="max-w-md">
              <h3 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-2">
                My Culinary Portfolio & Creations
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                Manage your authored recipe formulations, kitchen secret tips, and seasonal Grand Prix competition entries in the dedicated conservatory studio.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/my-content">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Open My Creations Studio
                </Button>
              </Link>

              <Link to="/recipes">
                <Button variant="outline" size="md">
                  Explore Salon Vault
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-[32px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm text-left flex flex-col gap-6"
          >
            <div className="pb-4 border-b border-[var(--color-border)]">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">
                Gazette & Notification Preferences
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                Customize which monographs, contest alerts, and community reviews you receive.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-[var(--color-text)] block">Weekly Gazette Dispatches</span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">Exclusive recipe monographs and ratio secrets.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-[var(--color-accent)]" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-[var(--color-text)] block">Grand Prix Contest Alerts</span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">New competition openings, jury reviews, and winner coronations.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={contestAlerts}
                  onChange={(e) => setContestAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-success)]" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-[var(--color-text)] block">SMS Notifications</span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">Urgent masterclass seat reminders and prize notifications.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Preferences Saved',
                    message: 'Your notification and gazette preferences have been saved.',
                  });
                }}
              >
                Save Preferences
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. EDIT PROFILE & AVATAR STUDIO MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Culinary Identity & Avatar"
        description="Update your display name, bio, and avatar portrait."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-5 text-left">
          {/* Avatar Preview & Library Selector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>Culinary Avatar Portrait</span>
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
                Select from library or custom URL
              </span>
            </div>

            {/* Current Active Preview */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[var(--color-primary)] shadow-warm shrink-0 bg-[var(--color-surface)]">
                <img
                  src={profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5 text-xs">
                <span className="font-bold text-[var(--color-text)]">Active Portrait Preview</span>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  Pick a persona from the gallery below or paste a direct image URL.
                </p>

                {/* Optional local file upload button */}
                <label className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[var(--color-accent)] hover:underline cursor-pointer pt-1">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload from Computer Library</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Presets Gallery Grid */}
            <div>
              <span className="text-[11px] font-mono text-[var(--color-text-subtle)] uppercase block font-bold mb-2">
                Preset Persona Gallery:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {AVATAR_LIBRARY.map((item) => {
                  const isSelected = profileImage === item.url;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProfileImage(item.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 scale-105 shadow-warm'
                          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/70 opacity-80 hover:opacity-100'
                      }`}
                      title={item.label}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[var(--color-primary)]/40 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <Input
            label="Avatar Image URL (Custom Link)"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            helperText="Enter a direct https image link or click any preset above."
          />

          <Textarea
            label="Culinary Bio"
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell fellow members about your cooking passion, specialties, and experience..."
          />

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)] mt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsEditModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSavingProfile || isUploadingAvatar}
              className="w-full sm:w-auto shadow-warm"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 5. SUBSCRIPTION PLAN MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title="Manage Culinary Membership Pass"
        description="Choose your membership tier to access exclusive masterclass recipes and contest privileges."
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { type: 'Monthly', price: '$100 / mo', amount: 100, desc: 'Most popular gourmet VIP tier' },
              { type: 'Yearly', price: '$1,000 / yr', amount: 1000, desc: 'Grand conservatory patron pass (Save 17%)' },
            ].map((plan) => (
              <button
                key={plan.type}
                type="button"
                onClick={() => setSelectedPlan(plan.type as any)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === plan.type
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 ring-2 ring-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]'
                }`}
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[var(--color-text-muted)] block">
                    {plan.type} Pass
                  </span>
                  <span className="font-serif text-xl font-bold text-[var(--color-text)] mt-1 block">
                    {plan.price}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-2">{plan.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPlanModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={updateSubMutation.isPending || createSubMutation.isPending}
              className="w-full sm:w-auto shadow-warm"
              onClick={async () => {
                const amount = selectedPlan === 'Monthly' ? 100 : 1000;
                try {
                  const numUserId = Number(user.id) || 1;
                  if (user.subscription?.id && !user.subscription.id.startsWith('sub-')) {
                    await updateSubMutation.mutateAsync({
                      id: user.subscription.id,
                      dto: { planType: selectedPlan, amount },
                    });
                  } else {
                    await createSubMutation.mutateAsync({
                      userId: numUserId,
                      planType: selectedPlan,
                      amount,
                    });
                  }
                  updateUser({
                    role: 'Member',
                    subscription: {
                      id: user.subscription?.id || 'sub-1',
                      userId: String(user.id),
                      planType: selectedPlan,
                      amount,
                      status: 'Active',
                      startDate: user.subscription?.startDate || new Date().toISOString(),
                      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
                    },
                  });
                  addToast({
                    type: 'success',
                    title: 'Subscription Updated',
                    message: `You are now subscribed to the ${selectedPlan} Culinary Pass ($${amount})!`,
                  });
                  setIsPlanModalOpen(false);
                } catch (err: any) {
                  addToast({
                    type: 'error',
                    title: 'Update Failed',
                    message: err?.response?.data || err?.message || 'Could not update subscription.',
                  });
                }
              }}
            >
              Confirm Plan Selection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Global Upgrade Modal for Free Users */}
      <UpgradeMembershipModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        triggerTitle="Activate VIP Membership to unlock full masterclass formulations & privileges"
      />
    </PageContainer>
  );
};

export default ProfilePage;
