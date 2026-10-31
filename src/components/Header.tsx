import React from 'react';
import {
  IconPin,
  IconPinnedOff,
  IconChevronUp,
  IconSettings,
} from '@tabler/icons-react';
import { Language, PomodoroMode } from '../types';
import { translations } from '../i18n/translations';
import { GlanceLogo } from './GlanceLogo';

interface HeaderProps {
  language: Language;
  isLocked: boolean;
  alwaysOnTop: boolean;
  onToggleAlwaysOnTop: () => void;
  onToggleRollup: () => void;
  onOpenSettings: () => void;
  pomodoroRunning?: boolean;
  pomodoroTimeLeft?: number;
  pomodoroMode?: PomodoroMode;
  onSwitchToPomodoro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  isLocked,
  alwaysOnTop,
  onToggleAlwaysOnTop,
  onToggleRollup,
  onOpenSettings,
  pomodoroRunning = false,
  pomodoroTimeLeft = 0,
  pomodoroMode = 'work',
  onSwitchToPomodoro,
}) => {
  const t = translations[language];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onDoubleClick={onToggleRollup}
      className={`px-3.5 py-2.5 flex items-center justify-between border-b border-[var(--glance-accent-border-subtle)] select-none ${
        isLocked ? 'no-drag' : 'drag-handle cursor-move'
      }`}
    >
      {/* Left: App branding & optional active timer mini-pill */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 no-drag">
          <GlanceLogo size={22} />
          <span className="font-bold text-base tracking-tight text-[var(--glance-text-main)]">
            glance
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--glance-accent)] shadow-[0_0_8px_var(--glance-accent-glow)]" />
        </div>

        {/* If Pomodoro timer is running in background, show small active indicator */}
        {pomodoroRunning && onSwitchToPomodoro && (
          <button
            onClick={onSwitchToPomodoro}
            title={t.tabPomodoro}
            className="no-drag flex items-center gap-1.5 bg-[var(--glance-accent-subtle)] border border-[var(--glance-accent-border)] rounded-full px-2.5 py-0.5 text-xs shadow-sm hover:scale-105 transition-all"
          >
            <span className="text-[10px] font-bold uppercase">
              {pomodoroMode === 'work' ? '🍅' : '☕'}
            </span>
            <span className="font-mono text-[11px] font-bold text-[var(--glance-accent-text)] timer-running">
              {formatTime(pomodoroTimeLeft)}
            </span>
          </button>
        )}
      </div>

      {/* Right Controls: Pin, Settings, Roll-up */}
      <div className="flex items-center gap-1 no-drag">
        {/* Always on top toggle (Pinned to desktop or floating) */}
        <button
          onClick={onToggleAlwaysOnTop}
          title={alwaysOnTop ? t.alwaysOnTopTooltipOn : t.alwaysOnTopTooltipOff}
          className={`p-1.5 rounded-xl transition-all active:scale-95 ${
            alwaysOnTop
              ? 'bg-[var(--glance-accent)] text-white shadow-sm'
              : 'text-[var(--glance-text-muted)] hover:text-[var(--glance-accent)] hover:bg-[var(--glance-accent-subtle)]'
          }`}
        >
          {alwaysOnTop ? <IconPin size={15} /> : <IconPinnedOff size={15} />}
        </button>

        {/* Settings Modal Button */}
        <button
          onClick={onOpenSettings}
          title={t.settingsTooltip}
          className="p-1.5 rounded-xl text-[var(--glance-text-muted)] hover:text-[var(--glance-accent)] hover:bg-[var(--glance-accent-subtle)] transition-all active:scale-95"
        >
          <IconSettings size={15} />
        </button>

        {/* Roll-up / Compact mode toggle */}
        <button
          onClick={onToggleRollup}
          title={t.rollupTooltip}
          className="p-1.5 rounded-xl text-[var(--glance-text-muted)] hover:text-[var(--glance-accent)] hover:bg-[var(--glance-accent-subtle)] transition-all active:scale-95"
        >
          <IconChevronUp size={15} />
        </button>
      </div>
    </div>
  );
};
