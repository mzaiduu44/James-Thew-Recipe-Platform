import React, { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showShortcut?: boolean;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  size = 'md',
  showShortcut = false,
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const sizeClasses = {
    sm: 'pl-9 pr-8 py-2 text-xs',
    md: 'pl-11 pr-10 py-3 text-sm',
    lg: 'pl-12 pr-12 py-3.5 text-base',
  };

  const iconSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconPos = {
    sm: 'left-3',
    md: 'left-4',
    lg: 'left-4',
  };

  return (
    <div className={`relative group ${className}`}>
      <Search
        className={`${iconSize[size]} text-[var(--color-text-muted)] absolute ${iconPos[size]} top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
          isFocused ? 'text-[var(--color-primary)]' : ''
        }`}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] rounded-2xl border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)] transition-all input-focus-ring ${sizeClasses[size]}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
        >
          <X className={iconSize[size]} />
        </button>
      )}
      {showShortcut && !value && !isFocused && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-subtle)]">
            ⌘K
          </kbd>
        </div>
      )}
    </div>
  );
};
