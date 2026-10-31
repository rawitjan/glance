import React from 'react';
import { IconListCheck, IconClock } from '@tabler/icons-react';
import { TabType, Language } from '../types';
import { translations } from '../i18n/translations';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  completedTasksCount: number;
  totalTasksCount: number;
  pomodoroRunning: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  language,
  completedTasksCount,
  totalTasksCount,
  pomodoroRunning,
}) => {
  const t = translations[language];

  return (
    <div className="px-3 pt-2">
      <div className="flex items-center p-1 bg-[var(--glance-accent-subtle)] border border-[var(--glance-accent-border-subtle)] rounded-2xl select-none">
        {/* Tasks Tab */}
        <button
          onClick={() => onTabChange('tasks')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs transition-all ${
            activeTab === 'tasks'
              ? 'bg-[var(--glance-card-bg)] text-[var(--glance-accent-text)] shadow-sm font-semibold'
              : 'text-[var(--glance-text-muted)] hover:text-[var(--glance-accent-text)] font-medium'
          }`}
        >
          <IconListCheck size={14} />
          <span>{t.tabTasks}</span>
          {totalTasksCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-[var(--glance-accent-light)] text-[var(--glance-accent-text)]'
                  : 'bg-black/5 dark:bg-white/5 text-[var(--glance-text-muted)]'
              }`}
            >
              {completedTasksCount}/{totalTasksCount}
            </span>
          )}
        </button>

        {/* Pomodoro Tab */}
        <button
          onClick={() => onTabChange('pomodoro')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs transition-all relative ${
            activeTab === 'pomodoro'
              ? 'bg-[var(--glance-card-bg)] text-[var(--glance-accent-text)] shadow-sm font-semibold'
              : 'text-[var(--glance-text-muted)] hover:text-[var(--glance-accent-text)] font-medium'
          }`}
        >
          <IconClock size={14} />
          <span>{t.tabPomodoro}</span>
          {pomodoroRunning && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
};
