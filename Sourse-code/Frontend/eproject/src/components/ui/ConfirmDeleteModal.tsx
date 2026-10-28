import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  description?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Permanent Deletion',
  itemName,
  description = 'This action cannot be undone. All associated data, ratings, and records will be permanently removed from the salon records.',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showClose={!isLoading}>
      <div className="flex flex-col items-center text-center gap-5 py-3">
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-16 h-16 rounded-3xl bg-[var(--color-danger)]/15 text-[var(--color-danger)] border border-[var(--color-danger)]/30 flex items-center justify-center shadow-warm-lg"
          >
            <Trash2 className="w-8 h-8" />
          </motion.div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--color-danger)] border-2 border-[var(--color-surface)] animate-ping" />
        </div>

        <div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
            {title}
          </h3>
          {itemName && (
            <div className="mt-2.5">
              <span className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--color-surface-2)] px-3.5 py-1 rounded-full border border-[var(--color-border)] inline-block max-w-full truncate shadow-warm-xs">
                {itemName}
              </span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-3 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>
        <div className="w-full flex items-center gap-2.5 p-3.5 rounded-2xl bg-[var(--color-danger)]/8 border border-[var(--color-danger)]/25 text-left text-xs text-[var(--color-danger)] font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Irreversible action: This record will be permanently purged from the salon database.</span>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full pt-4 border-t border-[var(--color-border)] mt-2">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-warm">Delete Record</Button>
        </div>
      </div>
    </Modal>
  );
};
