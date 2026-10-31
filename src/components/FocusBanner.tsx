import React from 'react';
import { IconTarget, IconX } from '@tabler/icons-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FocusBannerProps {
  language: Language;
  onExitFocus: () => void;
}

export const FocusBanner: React.FC<FocusBannerProps> = ({
  language,
  onExitFocus,
}) => {
  const t = translations[language];

  return (
    <div
      style={{ backgroundColor: 'var(--glance-accent)', color: '#ffffff' }}
      className="mx-3 mt-2 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-medium shadow-sm animate-in fade-in duration-150"
    >
      <div className="flex items-center gap-1.5">
        <IconTarget size={14} className="animate-spin opacity-80" style={{ animationDuration: '6s' }} />
        <span>{t.focusActive}</span>
      </div>
      <button
        onClick={onExitFocus}
        className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-semibold transition-all active:scale-95"
      >
        <span>{t.exitFocus}</span>
        <IconX size={12} />
      </button>
    </div>
  );
};
