import React from 'react';
import {
  IconChevronDown,
  IconPlayerPlay,
  IconPlayerPause,
} from '@tabler/icons-react';
import { PomodoroState, Language } from '../types';
import { translations } from '../i18n/translations';
import { GlanceLogo } from './GlanceLogo';

interface CompactBarProps {
  language: Language;
  completedCount: number;
  totalCount: number;
  pomodoro: PomodoroState;
  isLocked: boolean;
  onExpand: () => void;
  onPomodoroToggle: () => void;
}

export const CompactBar: React.FC<CompactBarProps> = ({
  language,
  completedCount,
  totalCount,
  pomodoro,
  isLocked,
  onExpand,
  onPomodoroToggle,
}) => {
  const t = translations[language];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onDoubleClick={onExpand}
      className={`h-[68px] px-3.5 flex items-center justify-between glass-widget rounded-2xl select-none ${
        isLocked ? 'no-drag' : 'drag-handle cursor-move'
      }`}
    >
      {/* Branding & Done Counter */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 no-drag">
          <GlanceLogo size={20} />
          <span className="font-bold text-sm tracking-tight text-[var(--glance-text-main)]">
            glance
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--glance-accent)]" />
        </div>

        {/* Counter Pill */}
        <div className="px-2.5 py-0.5 rounded-full bg-[var(--glance-accent-subtle)] border border-[var(--glance-accent-border-subtle)] text-[var(--glance-accent-text)] text-xs font-semibold">
          {t.doneCount(completedCount, totalCount)}
        </div>
      </div>

      {/* Pomodoro & Expand Controls */}
      <div className="flex items-center gap-2 no-drag">
        {/* Compact Pomodoro */}
        <div className="flex items-center gap-1.5 bg-[var(--glance-accent-subtle)] border border-[var(--glance-accent-border-subtle)] rounded-full px-2.5 py-0.5 text-xs">
          <span
            style={pomodoro.isRunning ? { color: 'var(--glance-accent)' } : { color: 'var(--glance-text-main)' }}
            className={`font-mono text-xs font-bold ${
              pomodoro.isRunning ? 'timer-running' : ''
            }`}
          >
            {formatTime(pomodoro.timeLeft)}
          </span>
          <button
            onClick={onPomodoroToggle}
            className="p-0.5 text-[var(--glance-text-muted)] hover:text-[var(--glance-accent)] transition-colors"
          >
            {pomodoro.isRunning ? <IconPlayerPause size={12} /> : <IconPlayerPlay size={12} />}
          </button>
        </div>

        {/* Expand button */}
        <button
          onClick={onExpand}
          title={t.rollupTooltip}
          style={{
            backgroundColor: 'var(--glance-accent)',
            color: '#ffffff',
          }}
          className="p-1.5 rounded-full shadow-sm hover:opacity-90 transition-all active:scale-95"
        >
          <IconChevronDown size={14} />
        </button>
      </div>
    </div>
  );
};
