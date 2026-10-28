import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useFeedback, useDeleteFeedback } from '@/hooks/useFeedback';
import { AdminDataTable, Column } from '@/components/shared/AdminDataTable';
import { RatingStars } from '@/components/shared/RatingStars';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Feedback } from '@/types/entities';

export const AdminFeedbackPage: React.FC = () => {
  const { data: feedbackList = [], isLoading } = useFeedback();
  const deleteFeedbackMutation = useDeleteFeedback();
  const [deletingItem, setDeletingItem] = useState<Feedback | null>(null);

  const columns: Column<Feedback>[] = [
    {
      key: 'userName',
      header: 'Author & Target',
      sortable: true,
      render: (fb) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-[var(--color-text)]">
            {fb.userName}
          </span>
          <span className="text-xs font-mono text-[var(--color-primary)] font-semibold">
            {fb.recipeTitle ? `Recipe: ${fb.recipeTitle}` : 'General Site Review'}
          </span>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (fb) => <RatingStars rating={fb.rating} size="sm" />,
    },
    {
      key: 'comment',
      header: 'Commentary',
      render: (fb) => (
        <p className="text-xs text-[var(--color-text-muted)] max-w-md line-clamp-2">
          “{fb.comment}”
        </p>
      ),
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      sortable: true,
      render: (fb) => new Date(fb.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text)]">
          Recipe & Site Feedback Moderation
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          Review all tasting notes, reader commentary, and star ratings submitted across the platform.
        </p>
      </div>

      <AdminDataTable
        columns={columns}
        data={feedbackList}
        isLoading={isLoading}
        searchFields={['userName', 'comment', 'recipeTitle']}
        searchPlaceholder="Search feedback comments or user names..."
        renderActions={(fb) => (
          <button
            type="button"
            onClick={() => setDeletingItem(fb)}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-danger)]/10 text-[var(--color-danger)] cursor-pointer"
            title="Delete Feedback"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={async () => {
          if (deletingItem) {
            await deleteFeedbackMutation.mutateAsync({
              id: deletingItem.id,
              isSiteFeedback: !deletingItem.recipeId,
            });
            setDeletingItem(null);
          }
        }}
        itemName={deletingItem?.comment}
        isLoading={deleteFeedbackMutation.isPending}
      />
    </div>
  );
};
