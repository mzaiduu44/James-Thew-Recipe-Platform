import React, { useState, useRef } from 'react';
import { Plus, Trash2, Crown, Users, Upload, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  useContests,
  useCreateContest,
  useDeleteContest,
  useContestSubmissions,
  useSelectContestWinner,
} from '@/hooks/useContests';
import { mediaApi } from '@/api/media';
import { normalizeImageUrl } from '@/components/shared/AppImage';
import { AdminDataTable, Column } from '@/components/shared/AdminDataTable';
import { Button } from '@/components/ui/Button';
import { Badge, WinnerBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Contest, ContestSubmission } from '@/types/entities';

export const AdminContestsPage: React.FC = () => {
  const { data: contests = [], isLoading } = useContests();
  const createContestMutation = useCreateContest();
  const deleteContestMutation = useDeleteContest();
  const selectWinnerMutation = useSelectContestWinner();

  // Create Contest Modal State
  const todayISO = new Date().toISOString().split('T')[0];
  const defaultEndISO = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingContest, setDeletingContest] = useState<Contest | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prize, setPrize] = useState('$1,000 Cash + Masterclass Feature');
  const [startDate, setStartDate] = useState(todayISO);
  const [endDate, setEndDate] = useState(defaultEndISO);
  const [dateError, setDateError] = useState('');
  const [rulesText, setRulesText] = useState(
    'Open to all guests and members\nMust include full recipe and procedure\nChef James Thew reviews all submissions'
  );
  const [coverImage, setCoverImage] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setIsUploadingCover(true);
    try {
      const uploadedPath = await mediaApi.upload(file);
      if (uploadedPath) {
        setCoverImage(uploadedPath);
      }
    } catch {
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Submissions Viewer State
  const [viewingContest, setViewingContest] = useState<Contest | null>(null);
  const { data: submissions = [] } = useContestSubmissions(viewingContest?.id);

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault();
    setDateError('');

    if (startDate < todayISO) {
      setDateError('Contest start date cannot be in the past.');
      return;
    }
    if (endDate < startDate) {
      setDateError('Contest end date must be on or after the start date.');
      return;
    }

    createContestMutation.mutate({
      title,
      description,
      prize,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate + 'T23:59:59').toISOString(),
      rules: rulesText.split('\n').filter(Boolean),
      profileImage: coverImage,
    });
    setIsCreateModalOpen(false);
  };

  const handlePickWinner = (submissionId: string) => {
    if (!viewingContest) return;

    // Prevent announcing winners before contest end date
    const endDateMs = new Date(viewingContest.endDate).getTime();
    if (endDateMs > Date.now()) {
      alert(`Cannot crown winner before the contest end date (${new Date(viewingContest.endDate).toLocaleDateString()}). The contest is still actively accepting entries.`);
      return;
    }

    if (window.confirm('Declare this participant as Grand Champion? This will automatically publish a winner announcement.')) {
      selectWinnerMutation.mutate(
        { contestId: viewingContest.id, submissionId },
        {
          onSuccess: () => {
            confetti({
              particleCount: 100,
              spread: 80,
              colors: ['#A67628', '#53131B', '#357339', '#DBA84A'],
            });
          },
        }
      );
    }
  };

  const columns: Column<Contest>[] = [
    {
      key: 'title',
      header: 'Contest',
      sortable: true,
      render: (c) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-[var(--color-text)]">{c.title}</span>
          <span className="text-xs text-[var(--color-text-subtle)]">{c.prize}</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (c) => (c.isActive ? <Badge variant="accent" size="xs">Active</Badge> : <WinnerBadge size="xs" />),
    },
    {
      key: 'submissionCount',
      header: 'Submissions',
      sortable: true,
      render: (c) => `${c.submissionCount || 0} Entries`,
    },
    {
      key: 'endDate',
      header: 'End Date',
      sortable: true,
      render: (c) => new Date(c.endDate).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            Culinary Contests Management
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Launch seasonal cooking competitions, inspect recipe submissions, and crown winners.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-warm"
        >
          Launch New Contest
        </Button>
      </div>

      {/* Table */}
      <AdminDataTable
        columns={columns}
        data={contests}
        isLoading={isLoading}
        searchPlaceholder="Search contests..."
        searchFields={['title', 'description', 'prize']}
        renderActions={(contest) => (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              onClick={() => setViewingContest(contest)}
              leftIcon={<Users className="w-3.5 h-3.5" />}
            >
              Submissions ({contest.submissionCount || 0})
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setDeletingContest(contest)}
              className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
              title="Delete Contest"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Create Contest Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Launch New Culinary Grand Prix"
        description="Set the contest challenge brief, prize package, and countdown schedule."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateContest} className="flex flex-col gap-3.5 text-left">
          {dateError && (
            <div className="p-2.5 rounded-xl bg-[var(--color-danger)]/15 border border-[var(--color-danger)]/30 text-xs text-[var(--color-danger)] font-bold">
              {dateError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contest Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Autumn Wild Truffle Risotto Grand Prix"
            />

            <Input
              label="Prize Package"
              required
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              placeholder="E.g. $1,500 Cash + Masterclass Feature"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date (Today or Future)"
              type="date"
              required
              min={todayISO}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (endDate < e.target.value) {
                  setEndDate(e.target.value);
                }
              }}
              helperText="Restricted to current & future dates"
            />
            <Input
              label="End Date"
              type="date"
              required
              min={startDate || todayISO}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              helperText="Must be on or after start date"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Textarea
              label="Brief / Description"
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the challenge parameters..."
            />

            <Textarea
              label="Contest Rules (One per line)"
              required
              rows={2}
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
            />
          </div>

          {/* Cover Image Upload & URL */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block font-bold">
              Contest Banner / Cover Image
            </label>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
              {coverImage ? (
                <div className="w-16 h-12 rounded-xl overflow-hidden border border-[var(--color-border)] shrink-0">
                  <img
                    src={normalizeImageUrl(coverImage)}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shrink-0 text-xs text-[var(--color-text-subtle)] font-mono">
                  No Image
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2 flex-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingCover}
                  leftIcon={isUploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                >
                  {isUploadingCover ? 'Uploading...' : coverImage ? 'Change Image File' : 'Upload Image File'}
                </Button>
                {coverImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCoverImage('')}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            {uploadError && (
              <span className="text-[11px] text-[var(--color-danger)] font-bold">{uploadError}</span>
            )}

            <Input
              label="Or specify Image URL directly"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/... or uploaded server path"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createContestMutation.isPending}
              className="w-full sm:w-auto shadow-warm"
            >
              Publish Contest
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contest Submissions Drawer */}
      <Drawer
        isOpen={!!viewingContest}
        onClose={() => setViewingContest(null)}
        title={`Submissions: ${viewingContest?.title || ''}`}
        description="Review participant recipes and crown the grand champion."
      >
        <div className="flex flex-col gap-4 p-4 sm:p-6 text-left">
          {submissions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-subtle)]">
              No participants have submitted entries to this contest yet.
            </div>
          ) : (
            submissions.map((sub: ContestSubmission) => (
              <div
                key={sub.id}
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col gap-3 transition-all ${
                  sub.isWinner
                    ? 'bg-[var(--color-surface-2)] border-[var(--color-accent)] shadow-warm'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                    {sub.userName} ({sub.userEmail})
                  </span>
                  {sub.isWinner ? (
                    <WinnerBadge size="xs" />
                  ) : (
                    <Button
                      variant="gold"
                      size="xs"
                      onClick={() => handlePickWinner(sub.id)}
                      leftIcon={<Crown className="w-3 h-3" />}
                    >
                      Declare Winner
                    </Button>
                  )}
                </div>

                <h4 className="font-serif font-bold text-sm text-[var(--color-text)]">
                  {sub.recipeData?.title || sub.tipData?.title || 'Contest Entry'}
                </h4>

                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {sub.recipeData?.description || sub.tipData?.description}
                </p>

                {sub.recipeData?.ingredients && (
                  <div className="text-[11px] font-mono text-[var(--color-text-subtle)] pt-2 border-t border-[var(--color-border)]">
                    Ingredients: {sub.recipeData.ingredients.join(', ')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Drawer>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingContest}
        onClose={() => setDeletingContest(null)}
        onConfirm={() => {
          if (deletingContest) {
            deleteContestMutation.mutate(deletingContest.id);
            setDeletingContest(null);
          }
        }}
        itemName={deletingContest?.title}
        description="Deleting this contest will also permanently wipe all culinary submissions, competitor rankings, and jury votes associated with it."
        isLoading={deleteContestMutation.isPending}
      />
    </div>
  );
};
