import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Lock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTips, useCreateTip, useUpdateTip, useDeleteTip } from '@/hooks/useTips';
import { useCategories } from '@/hooks/useRecipes';
import { AdminDataTable, Column } from '@/components/shared/AdminDataTable';
import { Button } from '@/components/ui/Button';
import { FreeAccessBadge, MembersOnlyBadge } from '@/components/ui/Badge';
import { Drawer } from '@/components/ui/Drawer';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Tip } from '@/types/entities';

export const AdminTipsPage: React.FC = () => {
  const { data: tipsData, isLoading } = useTips();
  const { data: categories = [] } = useCategories();
  const createTipMutation = useCreateTip();
  const updateTipMutation = useUpdateTip();
  const deleteTipMutation = useDeleteTip();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [deletingTip, setDeletingTip] = useState<Tip | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [tagsText, setTagsText] = useState('Pasta, Emulsion');

  const tips = tipsData?.data || [];

  const openDrawer = (tip?: Tip) => {
    if (tip) {
      setEditingTip(tip);
      setTitle(tip.title);
      setDescription(tip.description);
      setCategoryId(tip.categoryId || '');
      setIsFree(tip.isFree);
      setTagsText(tip.tags?.join(', ') || '');
    } else {
      setEditingTip(null);
      setTitle('');
      setDescription('');
      setCategoryId(categories[0]?.id || '');
      setIsFree(true);
      setTagsText('Technique, FrenchDiscipline');
    }
    setIsDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingTip) {
      updateTipMutation.mutate({
        id: editingTip.id,
        dto: { title, description, categoryId, isFree, tags },
      });
    } else {
      createTipMutation.mutate({
        title,
        description,
        categoryId,
        isFree,
        tags,
      });
    }
    setIsDrawerOpen(false);
  };

  const columns: Column<Tip>[] = [
    {
      key: 'title',
      header: 'Culinary Technique',
      sortable: true,
      render: (t) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-[var(--color-text)]">{t.title}</span>
          <span className="text-xs text-[var(--color-text-subtle)] line-clamp-1">{t.description}</span>
        </div>
      ),
    },
    {
      key: 'categoryName',
      header: 'Category',
      sortable: true,
      render: (t) => t.categoryName || 'General Culinary',
    },
    {
      key: 'isFree',
      header: 'Access Tier',
      sortable: true,
      render: (t) => (t.isFree ? <FreeAccessBadge size="xs" /> : <MembersOnlyBadge size="xs" />),
    },
    {
      key: 'createdByName',
      header: 'Author',
      render: (t) => t.createdByName || 'Community Chef',
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            Culinary Tips & Secrets Management
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Curate professional kitchen principles, equipment tricks, and secret methods.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => openDrawer()}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-warm"
        >
          Add New Tip
        </Button>
      </div>

      {/* Table */}
      <AdminDataTable
        columns={columns}
        data={tips}
        isLoading={isLoading}
        searchPlaceholder="Search tips by keyword or technique..."
        searchFields={['title', 'description']}
        itemsPerPage={10}
        renderActions={(tip) => (
          <div className="flex items-center gap-1.5">
            <Link to={`/tips/${tip.id}`} target="_blank">
              <Button variant="ghost" size="xs" title="Preview Tip">
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="xs"
              onClick={() => openDrawer(tip)}
              title="Edit Tip"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setDeletingTip(tip)}
              className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
              title="Delete Tip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Tip Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingTip ? 'Edit Culinary Tip' : 'Publish New Secret Method'}
        description="Share concise, high-value cooking principles with the guild."
      >
        <form onSubmit={handleSave} className="flex flex-col gap-5 p-4 sm:p-6 text-left">
          {/* Access Tier */}
          <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block mb-2 font-bold">
              Access Gate Policy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsFree(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isFree
                    ? 'bg-[var(--color-primary)] text-white shadow-warm-xs'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Free Access (Public)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFree(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  !isFree
                    ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] shadow-warm-xs'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Members Only ($100/mo)</span>
              </button>
            </div>
          </div>

          <Input
            label="Tip Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Cold-Pan Bacon Rendering Physics"
          />

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] block mb-1 font-bold">
              Category
            </label>
            <Select
              options={(Array.isArray(categories) ? categories : []).map((c) => ({ value: c.id, label: c.name }))}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            />
          </div>

          <Textarea
            label="Secret Instruction & Technique"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail why this technique works and what mistakes to avoid..."
          />

          <Input
            label="Tags (Comma separated)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="KnifeSkills, Emulsion, Fermentation"
          />

          <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sticky bottom-0 bg-[var(--color-surface)] py-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsDrawerOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={createTipMutation.isPending || updateTipMutation.isPending}
              className="w-full sm:w-auto shadow-warm"
            >
              {editingTip ? 'Update Tip' : 'Publish Secret'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingTip}
        onClose={() => setDeletingTip(null)}
        onConfirm={() => {
          if (deletingTip) {
            deleteTipMutation.mutate(deletingTip.id);
            setDeletingTip(null);
          }
        }}
        itemName={deletingTip?.title}
        isLoading={deleteTipMutation.isPending}
      />
    </div>
  );
};
