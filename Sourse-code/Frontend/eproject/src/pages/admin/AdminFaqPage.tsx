import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '@/hooks/useFaqs';
import { AdminDataTable, Column } from '@/components/shared/AdminDataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FAQ } from '@/types/entities';

export const AdminFaqPage: React.FC = () => {
  const { data: faqs = [], isLoading } = useFaqs();
  const createFaqMutation = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();
  const deleteFaqMutation = useDeleteFaq();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [deletingFaq, setDeletingFaq] = useState<FAQ | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<any>('Membership');

  const openModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setCategory(faq.category || 'General');
    } else {
      setEditingFaq(null);
      setQuestion('');
      setAnswer('');
      setCategory('General');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      updateFaqMutation.mutate({
        id: editingFaq.id,
        dto: { question, answer, category },
      });
    } else {
      createFaqMutation.mutate({ question, answer, category });
    }
    setIsModalOpen(false);
  };

  const columns: Column<FAQ>[] = [
    {
      key: 'question',
      header: 'Question',
      sortable: true,
      render: (f) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-[var(--color-text)]">
            {f.question}
          </span>
          <span className="text-xs text-[var(--color-text-subtle)] line-clamp-1">{f.answer}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (f) => <Badge variant="neutral" size="xs">{f.category || 'General'}</Badge>,
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            FAQ Knowledge Base
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Maintain the 7 required platform FAQs and add additional culinary Q&As.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => openModal()}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-warm"
        >
          Add FAQ Entry
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={faqs}
        isLoading={isLoading}
        searchFields={['question', 'answer', 'category']}
        searchPlaceholder="Search FAQs..."
        renderActions={(f) => (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              onClick={() => openModal(f)}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setDeletingFaq(f)}
              className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
              title="Delete FAQ"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaq ? 'Edit FAQ Item' : 'New Platform FAQ'}
        description="Provide comprehensive answers to common questions."
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4 text-left">
          <Input
            label="Question"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g. How does contest judging work?"
          />

          <Select
            label="Category"
            options={[
              { value: 'Membership', label: 'Membership & Billing' },
              { value: 'Recipes & Tips', label: 'Recipes & Tips' },
              { value: 'Contests', label: 'Culinary Contests' },
              { value: 'Feedback', label: 'Feedback & Reviews' },
              { value: 'General', label: 'General Salon Rules' },
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Textarea
            label="Detailed Answer"
            required
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write clear, friendly explanation..."
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
              isLoading={createFaqMutation.isPending || updateFaqMutation.isPending}
              className="w-full sm:w-auto shadow-warm"
            >
              {editingFaq ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingFaq}
        onClose={() => setDeletingFaq(null)}
        onConfirm={() => {
          if (deletingFaq) {
            deleteFaqMutation.mutate(deletingFaq.id);
            setDeletingFaq(null);
          }
        }}
        itemName={deletingFaq?.question}
        isLoading={deleteFaqMutation.isPending}
      />
    </div>
  );
};
