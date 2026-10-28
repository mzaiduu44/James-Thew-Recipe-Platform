import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  variant = 'pill',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-xs px-4 py-2',
    lg: 'text-sm px-5 py-2.5',
  };

  if (variant === 'underline') {
    return (
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className={`flex items-center gap-1 border-b border-[var(--color-border)] min-w-max ${className}`}>
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={`relative ${sizeClasses[size]} font-semibold transition-colors cursor-pointer pb-3 flex items-center gap-2 whitespace-nowrap select-none ${
                  isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full leading-none ${
                      isActive
                        ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                        : 'bg-[var(--color-surface-2)] text-[var(--color-text-subtle)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-0.5">
      <div
        className={`inline-flex items-center gap-1.5 p-1 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] whitespace-nowrap ${className}`}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`relative ${sizeClasses[size]} rounded-full font-semibold transition-colors cursor-pointer flex items-center gap-2 select-none whitespace-nowrap ${
                isActive ? 'text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="tabPill"
                  className="absolute inset-0 rounded-full bg-[var(--color-primary)] shadow-warm-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full leading-none ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-subtle)] border border-[var(--color-border)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
