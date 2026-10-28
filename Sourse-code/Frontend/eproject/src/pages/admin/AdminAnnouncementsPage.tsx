import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncements';
import { AdminDataTable, Column } from '@/components/shared/AdminDataTable';
import { Button } from '@/components/ui/Button';
import { Badge, WinnerBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Announcement } from '@/types/entities';

export const AdminAnnouncementsPage: React.FC = () => {
  const { data: announcements = [], isLoading } = useAnnouncements();
  const createAnnMutation = useCreateAnnouncement();
  const deleteAnnMutation = useDeleteAnnouncement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingAnn, setDeletingAnn] = useState<Announcement | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'General' | 'CookingClass' | 'ContestWinner'>('General');
  const [winnerName, setWinnerName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnMutation.mutate({
      title,
      description,
      type,
      winnerName: type === 'ContestWinner' ? winnerName : undefined,
    });
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const columns: Column<Announcement>[] = [
    {
      key: 'title',
      header: 'Title & Headline',
      sortable: true,
      render: (a) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-[var(--color-text)]">{a.title}</span>
          <span className="text-xs text-[var(--color-text-subtle)] line-clamp-1">{a.description}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (a) =>
        a.type === 'ContestWinner' ? (
          <WinnerBadge size="xs" />
        ) : (
          <Badge variant="admin" size="xs">
            {a.type}
          </Badge>
        ),
    },
    {
      key: 'createdAt',
      header: 'Published',
      sortable: true,
      render: (a) => new Date(a.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            Announcements & Bulletins
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Broadcast studio updates, live masterclass sessions, and contest winner declarations.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-warm"
        >
          Publish Announcement
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={announcements}
        isLoading={isLoading}
        searchFields={['title', 'description', 'winnerName']}
        searchPlaceholder="Search announcements..."
        renderActions={(a) => (
          <button
            type="button"
            onClick={() => setDeletingAnn(a)}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-danger)]/10 text-[var(--color-danger)] cursor-pointer"
            title="Delete Announcement"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Announcement Dispatch"
        description="Share official news, workshop dates, or winner crowns with readers."
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-4 text-left">
          <Input
            label="Announcement Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Live Masterclass: Sourdough Kinetics this Saturday"
          />

          <Select
            label="Dispatch Type"
            options={[
              { value: 'General', label: 'General Broadcast' },
              { value: 'CookingClass', label: 'Masterclass Live Stream' },
              { value: 'ContestWinner', label: 'Contest Champion Declaration' },
            ]}
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          />

          {type === 'ContestWinner' && (
            <Input
              label="Grand Champion Name"
              required
              value={winnerName}
              onChange={(e) => setWinnerName(e.target.value)}
              placeholder="e.g. Marcus Aurelius (Rome)"
            />
          )}

          <Textarea
            label="Dispatch Content & Details"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide all essential details, schedule coordinates, and congratulations..."
          />

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createAnnMutation.isPending}
              className="w-full sm:w-auto shadow-warm"
            >
              Broadcast Dispatch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingAnn}
        onClose={() => setDeletingAnn(null)}
        onConfirm={() => {
          if (deletingAnn) {
            deleteAnnMutation.mutate(deletingAnn.id);
            setDeletingAnn(null);
          }
        }}
        itemName={deletingAnn?.title}
        isLoading={deleteAnnMutation.isPending}
      />
    </div>
  );
};
