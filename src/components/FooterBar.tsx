import React from 'react';
import { IconArchive } from '@tabler/icons-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FooterBarProps {
  language: Language;
  completedCount: number;
  totalCount: number;
  onClearCompleted: () => void;
  toastMessage?: string | null;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  language,
  completedCount,
  totalCount,
  onClearCompleted,
  toastMessage,
}) => {
  const t = translations[language];

  return (
    <div className="px-3 py-2 border-t border-[var(--glance-accent-border-subtle)] flex items-center justify-between text-xs select-none">
      {/* Toast notification or Status */}
      <div className="flex-1 min-w-0 pr-2">
        {toastMessage ? (
          <span className="text-[11px] font-semibold text-[var(--glance-accent-text)] animate-in fade-in duration-200 truncate block">
            {toastMessage}
          </span>
        ) : (
          <span className="text-[11px] text-[var(--glance-text-muted)] font-medium">
            {t.doneCount(completedCount, totalCount)}
          </span>
        )}
      </div>

      {/* Clear Completed Tasks Button */}
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          title={t.archiveButtonTooltip}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--glance-accent-subtle)] hover:bg-[var(--glance-accent-subtle-hover)] text-[var(--glance-accent-text)] border border-[var(--glance-accent-border-subtle)] text-[11px] font-semibold transition-all active:scale-95"
        >
          <IconArchive size={12} />
          <span>{t.clearCompleted}</span>
        </button>
      )}
    </div>
  );
};
