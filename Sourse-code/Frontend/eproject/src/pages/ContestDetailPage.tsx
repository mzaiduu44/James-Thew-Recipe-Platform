import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trophy,
  ChevronLeft,
  CheckCircle2,
  Send,
  Crown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  useContest,
  useContestSubmissions,
  useSubmitContestEntry,
  useSelectContestWinner,
} from '@/hooks/useContests';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { ContestCountdown } from '@/components/shared/ContestCountdown';
import { Badge, WinnerBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { AppImage } from '@/components/shared/AppImage';


export const ContestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useUiStore();
  const { data: contest, isLoading } = useContest(id);
  const { data: submissions = [] } = useContestSubmissions(id);
  const submitEntryMutation = useSubmitContestEntry();
  const selectWinnerMutation = useSelectContestWinner();

  const { role, user, isAuthenticated } = useAuthStore();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);


  // Form State
  const [entryType, setEntryType] = useState<'Recipe' | 'Tip'>('Recipe');
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [procedureText, setProcedureText] = useState('');

  // Single Submission & End Date checks
  const userSubmission = submissions.find((s) => {
    if (user?.id && (s as any).userId && String((s as any).userId) === String(user.id)) return true;
    if (user?.email && s.userEmail && s.userEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (user?.name && s.userName && s.userName.toLowerCase() === user.name.toLowerCase()) return true;
    return false;
  });
  const hasAlreadySubmitted = Boolean(userSubmission);
  const isContestEnded = !contest?.isActive || (contest?.endDate ? new Date(contest.endDate).getTime() <= Date.now() : false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#A67628', '#53131B', '#357339', '#DBA84A'],
    });
  };

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title || !description) return;

    if (hasAlreadySubmitted) {
      addToast({
        type: 'warning',
        title: 'Single Submission Limit',
        message: 'You have already submitted an entry for this competition. Only one entry is allowed per member.',
      });
      setIsSubmitModalOpen(false);
      return;
    }

    submitEntryMutation.mutate(
      {
        contestId: id,
        dto: {
          contestId: id,
          userName: userName || (isAuthenticated ? user?.name || '' : 'Guest Chef'),
          userEmail: userEmail || (isAuthenticated ? user?.email || '' : 'guest@example.com'),
          userPhone,
          entryType,
          userId: isAuthenticated ? user?.id : undefined,
          recipeData:
            entryType === 'Recipe'
              ? {
                  title,
                  description,
                  ingredients: ingredientsText.split('\n').filter(Boolean),
                  procedure: procedureText.split('\n').filter(Boolean),
                  categoryId: 1,
                }
              : undefined,
          tipData:
            entryType === 'Tip'
              ? {
                  title,
                  description,
                  categoryId: 1,
                }
              : undefined,
        },
      },
      {
        onSuccess: () => {
          setIsSubmitModalOpen(false);
          triggerConfetti();
          setTitle('');
          setDescription('');
          setIngredientsText('');
          setProcedureText('');
        },
      }
    );
  };

  const handleSelectWinner = (submissionId: string) => {
    if (!id || !contest) return;

    if (!isContestEnded) {
      addToast({
        type: 'warning',
        title: 'Contest In Progress',
        message: 'Winners cannot be crowned until the competition deadline has passed.',
      });
      return;
    }

    selectWinnerMutation.mutate(
      { contestId: id, submissionId },
      {
        onSuccess: () => {
          triggerConfetti();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <PageContainer maxWidth="5xl">
        <Skeleton className="h-8 w-40 mb-6" />
        <Skeleton className="h-64 w-full rounded-3xl mb-8" />
        <Skeleton className="h-10 w-3/4 mb-4" />
      </PageContainer>
    );
  }

  if (!contest) {
    return (
      <PageContainer maxWidth="md">
        <div className="text-center py-16">
          <h2 className="font-serif text-2xl font-bold mb-2 text-[var(--color-text)]">Contest Not Found</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            This competition does not exist or has been archived.
          </p>
          <Link to="/contests">
            <Button variant="primary">Back to Contests</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const winner = submissions.find((s) => s.isWinner);

  return (
    <PageContainer maxWidth="7xl">
      {/* Back Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/contests"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Contests</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-warm-xl mb-6 sm:mb-10 text-left">
        {contest.coverImage ? (
          <div className="relative h-56 sm:h-80 w-full">
            <AppImage
              src={contest.coverImage}
              alt={contest.title}
              className="w-full h-full object-cover"
              fallbackSrc="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {contest.isActive ? (
                  <Badge variant="accent" size="sm">
                    Active Submissions Open
                  </Badge>
                ) : (
                  <WinnerBadge size="sm" />
                )}
                <span className="text-xs font-mono text-[var(--color-accent)] font-bold">
                  Prize: {contest.prize}
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                {contest.title}
              </h1>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-12 bg-[var(--color-surface)]">
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--color-text)]">
              {contest.title}
            </h1>
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 text-left">
        {/* Left Column: Description & Rules */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm flex flex-col gap-4">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--color-text)]">
              Competition Brief
            </h3>
            <p className="text-xs sm:text-base text-[var(--color-text-muted)] leading-relaxed">
              {contest.description}
            </p>

            {contest.rules && contest.rules.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex flex-col gap-2">
                <span className="text-xs font-mono uppercase font-bold text-[var(--color-accent)]">
                  Submission Rules:
                </span>
                <ul className="flex flex-col gap-2">
                  {(contest.rules as string[]).map((rule: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--color-text)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Winner Announcement Banner */}
          {winner && (
            <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)] border border-[var(--color-accent)] shadow-warm-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[var(--color-accent)]">
                <Crown className="w-6 h-6" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Contest Champion Announced
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">
                {winner.recipeData?.title || winner.tipData?.title || 'Grand Prix Champion'}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                Crafted with excellence by <strong className="text-[var(--color-text)]">{winner.userName}</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Countdown & Submit Action */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm flex flex-col gap-5 sm:gap-6">
            <div>
              <span className="text-xs font-mono uppercase text-[var(--color-text-subtle)] font-bold block mb-1">
                Time Remaining
              </span>
              {contest.isActive ? (
                <ContestCountdown endDate={contest.endDate} />
              ) : (
                <span className="text-sm font-mono text-[var(--color-danger)] font-bold">
                  Contest Closed
                </span>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-muted)]">
                <span>Entry Format:</span>
                <span className="font-bold text-[var(--color-text)]">{contest.entryTypeAllowed}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-muted)]">
                <span>Total Entries:</span>
                <span className="font-bold text-[var(--color-text)]">{submissions.length} Submissions</span>
              </div>
            </div>

            {contest.isActive && (
              hasAlreadySubmitted ? (
                <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[var(--color-success)] mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Entry Submitted</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    You have already submitted your formulation for this contest. Only one entry is allowed per participant.
                  </p>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsSubmitModalOpen(true)}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="w-full"
                >
                  Submit Contest Entry
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Submissions Feed & Admin Review */}
      <section className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-[var(--color-border)] text-left">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--color-accent)]" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              Contest Submissions ({submissions.length})
            </h3>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-subtle)]">
            No entries submitted yet. Be the first to enter!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
                  sub.isWinner
                    ? 'bg-[var(--color-surface-2)] border-[var(--color-accent)] shadow-warm-md'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] shadow-warm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="neutral" size="xs">
                      {sub.entryType}
                    </Badge>
                    {sub.isWinner && <WinnerBadge size="xs" />}
                  </div>

                  <h4 className="font-serif text-lg font-bold text-[var(--color-text)] mb-1">
                    {sub.recipeData?.title || sub.tipData?.title || 'Contest Entry'}
                  </h4>

                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-3">
                    {sub.recipeData?.description || sub.tipData?.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                    By {sub.userName}
                  </span>

                  {role === 'Admin' && !sub.isWinner && (
                    isContestEnded ? (
                      <Button
                        variant="gold"
                        size="xs"
                        onClick={() => handleSelectWinner(sub.id)}
                        leftIcon={<Crown className="w-3.5 h-3.5" />}
                      >
                        Crown Winner
                      </Button>
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--color-text-subtle)] bg-[var(--color-surface-2)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                        Awaiting Contest End
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Entry Submission Modal (Compact & Slider-Free) */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Contest Entry"
        description="Share your formulation. Open to all visiting food lovers and members."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitEntry} className="flex flex-col gap-3.5 text-left">
          {contest.entryTypeAllowed === 'All' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Submission Type"
                options={[
                  { value: 'Recipe', label: 'Complete Recipe Formulation' },
                  { value: 'Tip', label: 'Culinary Secret / Tip' },
                ]}
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as any)}
              />
              <Input
                label={entryType === 'Recipe' ? 'Recipe Title' : 'Secret / Tip Title'}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Saffron Risotto with Bone Marrow Glaze"
              />
            </div>
          ) : (
            <Input
              label={entryType === 'Recipe' ? 'Recipe Title' : 'Secret / Tip Title'}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Saffron Risotto with Bone Marrow Glaze"
            />
          )}

          {!isAuthenticated && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Your Full Name"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Chef Auguste"
              />
              <Input
                label="Email Coordinates"
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="auguste@cuisine.com"
              />
              <Input
                label="Phone (For SMS Alerts)"
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="+1 555 0192"
              />
            </div>
          )}

          <Textarea
            label="Description & Culinary Rationale"
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain why this dish meets the contest challenge parameters..."
          />

          {entryType === 'Recipe' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Textarea
                label="Ingredients (One line per item)"
                required
                rows={3}
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="300g Carnaroli Rice&#10;1g Persian Saffron&#10;1L Veal Stock"
              />

              <Textarea
                label="Procedure Steps (One line per step)"
                required
                rows={3}
                value={procedureText}
                onChange={(e) => setProcedureText(e.target.value)}
                placeholder="Toast rice dry in heavy copper pan.&#10;Ladle hot stock incrementally."
              />
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={submitEntryMutation.isPending}
              className="w-full sm:w-auto shadow-warm"
            >
              Submit for Jury Review
            </Button>
          </div>
        </form>
      </Modal>


    </PageContainer>
  );
};

