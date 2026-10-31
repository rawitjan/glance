import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Priority, Language } from '../types';
import { translations } from '../i18n/translations';

export interface QuickAddRef {
  focus: () => void;
}

interface QuickAddProps {
  language: Language;
  onAddTask: (title: string, priority: Priority) => void;
}

export const QuickAdd = forwardRef<QuickAddRef, QuickAddProps>(
  ({ language, onAddTask }, ref) => {
    const t = translations[language];
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>('P2');
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      },
    }));

    const handleSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;
      onAddTask(trimmed, priority);
      setTitle('');
    };

    const cyclePriority = () => {
      const order: Priority[] = ['P1', 'P2', 'P3'];
      const nextIndex = (order.indexOf(priority) + 1) % order.length;
      setPriority(order[nextIndex]);
    };

    const priorityBadgeStyles: Record<Priority, string> = {
      P1: 'bg-red-100 text-red-700 border-red-200/80 hover:bg-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800/70 dark:hover:bg-red-900/60',
      P2: 'bg-amber-100 text-amber-800 border-amber-200/80 hover:bg-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/70 dark:hover:bg-amber-900/60',
      P3: 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/70 dark:hover:bg-slate-700/60',
    };

    return (
      <form onSubmit={handleSubmit} className="px-3 pt-2.5 pb-1">
        <div className="relative flex items-center bg-[var(--glance-card-bg)] border border-[var(--glance-accent-border-subtle)] rounded-2xl shadow-sm transition-all focus-within:border-[var(--glance-accent)] focus-within:ring-2 focus-within:ring-[var(--glance-accent-light)]">
          {/* Priority Pill Selector */}
          <button
            type="button"
            onClick={cyclePriority}
            title={`${t.priorityLabel[priority]} (${t.priorityDesc[priority]}) - Басып ауыстыру`}
            className={`ml-1.5 px-2 py-0.5 rounded-xl text-[11px] font-semibold border transition-all active:scale-95 ${priorityBadgeStyles[priority]}`}
          >
            {priority}
          </button>

          {/* Quick Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.quickAddPlaceholder}
            className="w-full py-2 px-2.5 bg-transparent text-sm text-[var(--glance-text-main)] placeholder-[var(--glance-text-muted)] opacity-90 focus:outline-none"
          />

          {/* Add Button */}
          <button
            type="submit"
            disabled={!title.trim()}
            title={t.quickAddPlaceholder}
            className={`mr-1.5 p-1 rounded-xl transition-all ${
              title.trim()
                ? 'bg-[var(--glance-accent)] text-white shadow-sm hover:opacity-90 active:scale-95'
                : 'text-[var(--glance-text-muted)] opacity-40 cursor-not-allowed'
            }`}
          >
            <IconPlus size={16} stroke={2.5} />
          </button>
        </div>
      </form>
    );
  }
);
