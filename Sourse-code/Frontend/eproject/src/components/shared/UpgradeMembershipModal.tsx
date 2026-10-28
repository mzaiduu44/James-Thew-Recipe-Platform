import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Check,
  Crown,
  ChefHat,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { useCreateSubscription } from '@/api/subscriptions';
import confetti from 'canvas-confetti';

export interface UpgradeMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerTitle?: string;
}

export const UpgradeMembershipModal: React.FC<UpgradeMembershipModalProps> = ({
  isOpen,
  onClose,
  triggerTitle = 'Unlock Complete Masterclass Experience',
}) => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useUiStore();
  const createSubMutation = useCreateSubscription();

  const [selectedPlan, setSelectedPlan] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#8B1E28', '#2D5A27', '#E8C55C'],
    });
  };

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const amount = selectedPlan === 'Monthly' ? 100 : 1000;

    try {
      if (user?.id) {
        try {
          await createSubMutation.mutateAsync({
            userId: Number(user.id) || 1,
            planType: selectedPlan,
            amount,
          });
        } catch {
        }
      }

      updateUser({
        role: 'Member',
        subscription: {
          id: `sub-${Date.now()}`,
          userId: user?.id || '1',
          planType: selectedPlan,
          amount,
          status: 'Active',
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + (selectedPlan === 'Yearly' ? 365 : 30) * 86400000
          ).toISOString(),
        },
      });

      setIsProcessing(false);
      triggerConfetti();
      addToast({
        type: 'success',
        title: 'VIP Masterclass Pass Activated! 👑',
        message: `Congratulations ${user?.name || 'Chef'}! You now have unrestricted access to all recipes, tips, and contest entries.`,
      });
      onClose();
    } catch {
      setIsProcessing(false);
      addToast({
        type: 'error',
        title: 'Upgrade Failed',
        message: 'Could not process membership upgrade. Please try again.',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade to VIP Culinary Pass"
      description={triggerTitle}
      maxWidth="2xl"
    >
      <form onSubmit={handleUpgrade} className="flex flex-col gap-4 text-left">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-2xl p-4 sm:p-5 text-white relative overflow-hidden bg-gradient-to-tr from-[#1E140F] via-[#2F1F17] to-[#1E140F] border border-[var(--color-accent)]/50 shadow-warm-lg"
        >
          <div className="flex items-center justify-between relative z-10 mb-2">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)]" />
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wider">JAMES THEW SALON</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider">
              <Crown className="w-3 h-3" />
              <span>VIP MASTERCLASS</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 relative z-10">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {selectedPlan === 'Monthly' ? '$100' : '$1,000'}
            </span>
            <span className="text-xs text-[var(--color-accent)] font-mono">
              / {selectedPlan === 'Monthly' ? 'month' : 'year (Save 17%)'}
            </span>
          </div>

          <p className="text-[11px] text-white/80 mt-1 relative z-10 leading-relaxed">
            Instant unlock of 480+ formulation vault, chef secrets, community publishing, & cash prize grand prix.
          </p>
        </motion.div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block font-bold mb-2">
            1. Select Billing Frequency
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div
              onClick={() => setSelectedPlan('Monthly')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'Monthly'
                  ? 'border-[var(--color-accent)] bg-[var(--color-surface-2)] shadow-warm'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] text-[9px] font-mono font-bold uppercase">
                Popular
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-[var(--color-text-muted)]">Monthly Pass</span>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'Monthly'
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {selectedPlan === 'Monthly' && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">$100</span>
                <span className="text-xs text-[var(--color-text-muted)]">/ mo</span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Cancel anytime.</p>
            </div>

            <div
              onClick={() => setSelectedPlan('Yearly')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'Yearly'
                  ? 'border-[var(--color-primary)] bg-[var(--color-surface-2)] shadow-warm'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-mono font-bold uppercase">
                Best Value
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-[var(--color-text-muted)]">Yearly Guild</span>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'Yearly'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {selectedPlan === 'Yearly' && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">$1,000</span>
                <span className="text-xs text-[var(--color-text-muted)]">/ yr</span>
              </div>
              <p className="text-[11px] text-[var(--color-accent)] font-semibold mt-0.5">Save 17%.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block font-bold">
            2. Payment Simulation Gateway
          </label>
          <Input
            label="Card Number (Demo Auto-Fill)"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="4242 4242 4242 4242"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Expiry Date"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              placeholder="12/28"
            />
            <Input label="Security CVC" placeholder="888" maxLength={4} />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex flex-col gap-2 text-xs text-[var(--color-text-muted)]">
          <span className="font-mono uppercase text-[var(--color-primary)] font-bold text-[10px]">
            Immediate Privileges Unlocked:
          </span>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" />
            <span>Unrestricted access to 480+ Members-Only recipes & techniques</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" />
            <span>Community publishing & recipe formulation sharing</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0" />
            <span>Grand Prix culinary competition submissions & cash prizes</span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-[var(--color-text-subtle)]">
            <ShieldCheck className="w-4 h-4 text-[var(--color-success)] shrink-0" />
            <span>Simulated 256-bit Encrypted Admission</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="md"
              isLoading={isProcessing}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-warm text-center justify-center text-xs sm:text-sm"
            >
              Activate VIP Pass ({selectedPlan === 'Monthly' ? '$100/mo' : '$1,000/yr'})
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpgradeMembershipModal;