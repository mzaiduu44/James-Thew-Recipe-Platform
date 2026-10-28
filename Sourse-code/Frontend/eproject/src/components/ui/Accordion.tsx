import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  category?: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultExpandedId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpandedId,
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(
    defaultExpandedId ? [defaultExpandedId] : []
  );

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setExpandedIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`flex flex-col gap-3.5 w-full ${className}`}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);

        return (
          <div
            key={item.id}
            className={`border rounded-2xl transition-colors duration-200 overflow-hidden text-left ${
              isExpanded
                ? 'bg-[var(--color-surface)] border-[var(--color-primary)]/50 shadow-warm'
                : 'bg-[var(--color-surface-2)] border-[var(--color-border)] hover:bg-[var(--color-surface)]'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer gap-4 select-none"
              aria-expanded={isExpanded}
            >
              <div className="flex flex-col gap-1">
                {item.category && (
                  <span className="text-[10px] font-mono text-[var(--color-accent)] font-bold">
                    {item.category}
                  </span>
                )}
                <span className="font-serif text-base sm:text-lg font-bold text-[var(--color-text)]">
                  {item.title}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[var(--color-text-muted)] shrink-0 p-1.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)]"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)]">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
