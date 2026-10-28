import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { SkeletonTableRow } from '../ui/Skeleton';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  itemsPerPage?: number;
  actionsHeader?: string;
  renderActions?: (item: T) => React.ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function AdminDataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Search records...',
  searchFields = [],
  itemsPerPage = 10,
  actionsHeader = 'Actions',
  renderActions,
  emptyTitle = 'No entries found',
  emptyMessage = 'There are no records matching your current filter criteria.',
}: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm && searchFields.length > 0) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          if (typeof val === 'string') return val.toLowerCase().includes(term);
          if (typeof val === 'number') return String(val).includes(term);
          return false;
        })
      );
    }

    if (sortKey) {
      result.sort((a: any, b: any) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchFields, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full text-left">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] text-xs rounded-xl pl-9 pr-3 py-2 border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)] transition-all shadow-warm-xs"
          />
        </div>

        <div className="text-xs font-mono text-[var(--color-text-subtle)] self-end sm:self-auto">
          Showing <span className="font-bold text-[var(--color-text)]">{filteredData.length}</span> entries
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-warm">
        <div className="overflow-x-auto modal-scrollbar">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] font-bold select-none ${
                      col.sortable ? 'cursor-pointer hover:text-[var(--color-primary)]' : ''
                    } ${col.className || ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && <ArrowUpDown className="w-3 h-3 opacity-60" />}
                    </div>
                  </th>
                ))}

                {renderActions && (
                  <th className="py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] font-bold text-right">
                    {actionsHeader}
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <SkeletonTableRow key={idx} cols={columns.length + (renderActions ? 1 : 0)} />
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (renderActions ? 1 : 0)}
                    className="py-12 px-4 text-center"
                  >
                    <EmptyState
                      title={emptyTitle}
                      description={emptyMessage}
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--color-surface-2)]/60 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`py-3.5 px-4 text-xs text-[var(--color-text)] ${col.className || ''}`}
                      >
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
                    ))}

                    {renderActions && (
                      <td className="py-3.5 px-4 text-xs text-right">
                        <div className="flex items-center justify-end gap-2">
                          {renderActions(item)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface-2)] text-xs">
            <span className="font-mono text-[var(--color-text-subtle)]">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-[var(--color-text)]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-[var(--color-text)]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
