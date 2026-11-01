import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { IconPlus, IconCalendar, IconX } from '@tabler/icons-react';
import { Priority, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  formatDeadlineText,
  getTodayDateString,
  getTomorrowDateString,
  getDateInDaysString,
} from '../utils/dateUtils';

export interface QuickAddRef {
  focus: () => void;
}

interface QuickAddProps {
  language: Language;
  onAddTask: (title: string, priority: Priority, dueDate?: string) => void;
}

export const QuickAdd = forwardRef<QuickAddRef, QuickAddProps>(
  ({ language, onAddTask }, ref) => {
    const t = translations[language];
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>('P2');
    const [dueDate, setDueDate] = useState<string | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      },
    }));

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
          setShowDatePicker(false);
        }
      };
      if (showDatePicker) {
        window.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showDatePicker]);

    const handleSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;
      onAddTask(trimmed, priority, dueDate);
      setTitle('');
      setDueDate(undefined);
      setShowDatePicker(false);
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
      <form onSubmit={handleSubmit} className="px-3 pt-2.5 pb-1 relative">
        <div className="relative flex items-center bg-[var(--glance-card-bg)] border border-[var(--glance-accent-border-subtle)] rounded-2xl shadow-sm transition-all focus-within:border-[var(--glance-accent)] focus-within:ring-2 focus-within:ring-[var(--glance-accent-light)]">
          {/* Priority Pill Selector */}
          <button
            type="button"
            onClick={cyclePriority}
            title={`${t.priorityLabel[priority]} (${t.priorityDesc[priority]}) - Басып ауыстыру`}
            className={`ml-1.5 px-2 py-0.5 rounded-xl text-[11px] font-semibold border transition-all active:scale-95 cursor-pointer ${priorityBadgeStyles[priority]}`}
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

          {/* Deadline Chip or Toggle Button */}
          {dueDate ? (
            <div className="flex items-center gap-1 mr-1 px-2 py-0.5 rounded-xl bg-[var(--glance-accent-subtle)] border border-[var(--glance-accent-border-subtle)] text-[10px] text-[var(--glance-accent-text)] font-semibold flex-shrink-0 animate-in fade-in duration-100">
              <IconCalendar size={11} />
              <span className="truncate max-w-[90px]">{formatDeadlineText(dueDate, language)}</span>
              <button
                type="button"
                onClick={() => setDueDate(undefined)}
                className="hover:opacity-75 p-0.5 text-[var(--glance-text-muted)] hover:text-red-500 cursor-pointer"
                title={t.removeDeadline}
              >
                <IconX size={10} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDatePicker((prev) => !prev)}
              title={t.quickAddDeadline}
              className={`p-1 mr-1 rounded-xl text-[var(--glance-text-muted)] hover:text-[var(--glance-accent)] hover:bg-[var(--glance-accent-subtle)] transition-colors cursor-pointer ${
                showDatePicker ? 'text-[var(--glance-accent)] bg-[var(--glance-accent-subtle)]' : ''
              }`}
            >
              <IconCalendar size={15} />
            </button>
          )}

          {/* Add Button */}
          <button
            type="submit"
            disabled={!title.trim()}
            title={t.quickAddPlaceholder}
            className={`mr-1.5 p-1 rounded-xl transition-all cursor-pointer ${
              title.trim()
                ? 'bg-[var(--glance-accent)] text-white shadow-sm hover:opacity-90 active:scale-95'
                : 'text-[var(--glance-text-muted)] opacity-40 cursor-not-allowed'
            }`}
          >
            <IconPlus size={16} stroke={2.5} />
          </button>
        </div>

        {/* Quick Deadline Selector Popover */}
        {showDatePicker && (
          <div
            ref={popoverRef}
            className="absolute z-40 right-4 top-full mt-1 w-64 bg-white/95 dark:bg-[#1a172a]/95 backdrop-blur-md border border-[var(--glance-accent-border)] rounded-2xl shadow-float p-2.5 text-xs select-none animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex items-center justify-between font-semibold text-[11px] text-[var(--glance-text-main)] mb-1.5">
              <span className="flex items-center gap-1">
                <IconCalendar size={12} style={{ color: 'var(--glance-accent)' }} />
                <span>{t.deadline}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="p-0.5 text-[var(--glance-text-muted)] hover:text-[var(--glance-text-main)] rounded cursor-pointer"
              >
                <IconX size={12} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 mb-2">
              <button
                type="button"
                onClick={() => {
                  setDueDate(getTodayDateString());
                  setShowDatePicker(false);
                }}
                className="py-1 px-1.5 rounded-lg bg-[var(--glance-accent-subtle)] hover:bg-[var(--glance-accent)] hover:text-white text-[10px] font-medium text-center transition-all cursor-pointer"
              >
                {t.today}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDueDate(getTomorrowDateString());
                  setShowDatePicker(false);
                }}
                className="py-1 px-1.5 rounded-lg bg-[var(--glance-accent-subtle)] hover:bg-[var(--glance-accent)] hover:text-white text-[10px] font-medium text-center transition-all cursor-pointer"
              >
                {t.tomorrow}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDueDate(getDateInDaysString(3));
                  setShowDatePicker(false);
                }}
                className="py-1 px-1.5 rounded-lg bg-[var(--glance-accent-subtle)] hover:bg-[var(--glance-accent)] hover:text-white text-[10px] font-medium text-center transition-all cursor-pointer"
              >
                {t.inDays(3)}
              </button>
            </div>

            <div className="pt-1 border-t border-[var(--glance-accent-border-subtle)]">
              <input
                type="date"
                defaultValue={dueDate || getTodayDateString()}
                onChange={(e) => {
                  if (e.target.value) {
                    setDueDate(e.target.value);
                    setShowDatePicker(false);
                  }
                }}
                className="w-full px-2 py-1 bg-[var(--glance-card-bg)] border border-[var(--glance-accent-border-subtle)] rounded-xl text-xs text-[var(--glance-text-main)] focus:outline-none focus:border-[var(--glance-accent)] cursor-pointer"
              />
            </div>
          </div>
        )}
      </form>
    );
  }
);
