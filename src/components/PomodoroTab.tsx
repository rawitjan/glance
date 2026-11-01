import React, { useState } from 'react';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconRotateClockwise,
  IconPlayerSkipForward,
  IconTarget,
  IconCheck,
  IconSettings,
  IconVolume,
  IconVolumeOff,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import { PomodoroState, PomodoroMode, Language, AppSettings, Task } from '../types';
import { translations } from '../i18n/translations';
import { formatDeadlineText } from '../utils/dateUtils';

interface PomodoroTabProps {
  pomodoro: PomodoroState;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  onModeChange: (mode: PomodoroMode) => void;
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  language: Language;
  focusedTask: Task | null;
  onToggleCompleteFocusedTask?: (taskId: string) => void;
}

export const PomodoroTab: React.FC<PomodoroTabProps> = ({
  pomodoro,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  onModeChange,
  settings,
  onUpdateSettings,
  language,
  focusedTask,
  onToggleCompleteFocusedTask,
}) => {
  const t = translations[language];
  const [showExtraSettings, setShowExtraSettings] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute total duration for current mode
  const totalModeSeconds =
    (pomodoro.mode === 'work'
      ? settings.pomodoroWorkMinutes
      : pomodoro.mode === 'break'
      ? settings.pomodoroBreakMinutes
      : settings.pomodoroLongBreakMinutes) * 60;

  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalModeSeconds - pomodoro.timeLeft) / totalModeSeconds) * 100)
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col items-center justify-between space-y-3 select-none text-[var(--glance-text-main)]">
      {/* 1. Mode Switcher (Work / Short Break / Long Break) */}
      <div className="flex items-center gap-1.5 p-1 bg-[var(--glance-accent-subtle)] border border-[var(--glance-accent-border-subtle)] rounded-2xl w-full">
        {(
          [
            { id: 'work', label: t.pomodoroWork, icon: '🍅' },
            { id: 'break', label: t.pomodoroBreak, icon: '☕' },
            { id: 'longBreak', label: t.pomodoroLongBreak, icon: '🌴' },
          ] as const
        ).map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex-1 py-1 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              pomodoro.mode === mode.id
                ? 'bg-[var(--glance-accent)] text-white shadow-sm'
                : 'text-[var(--glance-text-muted)] hover:text-[var(--glance-accent-text)]'
            }`}
          >
            <span>{mode.icon}</span>
            <span className="truncate">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* 2. Linked Focused Task Banner */}
      <div className="w-full px-3 py-2 rounded-2xl bg-[var(--glance-card-bg)] border border-[var(--glance-accent-border-subtle)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <IconTarget size={15} style={{ color: 'var(--glance-accent)' }} className="flex-shrink-0" />
          <div className="min-w-0">
            <span
              style={{ color: 'var(--glance-accent-text)' }}
              className="block text-[10px] font-semibold uppercase tracking-wider"
            >
              {t.pomodoroActiveTask}
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="block text-xs font-medium truncate text-[var(--glance-text-main)]">
                {focusedTask ? focusedTask.title : t.pomodoroNoTaskLinked}
              </span>
              {focusedTask?.dueDate && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[var(--glance-accent-subtle)] text-[var(--glance-accent-text)] border border-[var(--glance-accent-border-subtle)] flex-shrink-0 font-medium">
                  {formatDeadlineText(focusedTask.dueDate, language)}
                </span>
              )}
            </div>
          </div>
        </div>

        {focusedTask && onToggleCompleteFocusedTask && (
          <button
            onClick={() => onToggleCompleteFocusedTask(focusedTask.id)}
            title="Тапсырманы аяқтау"
            style={
              focusedTask.completed
                ? { backgroundColor: 'var(--glance-accent)', borderColor: 'var(--glance-accent)' }
                : { borderColor: 'var(--glance-accent-border)' }
            }
            className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
              focusedTask.completed
                ? 'text-white'
                : 'bg-white dark:bg-[#201c32] hover:border-[var(--glance-accent)]'
            }`}
          >
            {focusedTask.completed && <IconCheck size={14} stroke={3} />}
          </button>
        )}
      </div>

      {/* 3. Big Central Visual Timer */}
      <div className="relative flex flex-col items-center justify-center py-2 w-full">
        {/* Progress track bar */}
        <div className="w-48 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, backgroundColor: 'var(--glance-accent)' }}
          />
        </div>

        {/* Big digits display */}
        <div
          style={pomodoro.isRunning ? { color: 'var(--glance-accent)' } : { color: 'var(--glance-text-main)' }}
          className={`font-mono text-5xl font-black tracking-tight tabular-nums transition-all ${
            pomodoro.isRunning ? 'timer-running drop-shadow-sm' : ''
          }`}
        >
          {formatTime(pomodoro.timeLeft)}
        </div>

        {/* Cycle indicator */}
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--glance-accent-text)]">
          <span>{t.pomodoroCycleLabel(pomodoro.cycleCount, settings.pomodoroCyclesBeforeLongBreak)}</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: settings.pomodoroCyclesBeforeLongBreak }).map((_, i) => (
              <span
                key={i}
                style={
                  i < pomodoro.cycleCount
                    ? { backgroundColor: 'var(--glance-accent)' }
                    : undefined
                }
                className={`w-2 h-2 rounded-full transition-all ${
                  i < pomodoro.cycleCount
                    ? 'shadow-sm'
                    : 'bg-black/15 dark:bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Main Timer Controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Reset button */}
        <button
          onClick={onResetTimer}
          title={t.pomodoroReset}
          className="p-2.5 rounded-2xl bg-[var(--glance-accent-subtle)] hover:bg-[var(--glance-accent-subtle-hover)] text-[var(--glance-accent-text)] border border-[var(--glance-accent-border-subtle)] shadow-sm transition-all active:scale-95"
        >
          <IconRotateClockwise size={18} />
        </button>

        {/* Big Play/Pause Toggle button */}
        <button
          onClick={onToggleTimer}
          title={pomodoro.isRunning ? t.pomodoroPause : t.pomodoroStart}
          style={{ backgroundColor: 'var(--glance-accent)', color: '#ffffff' }}
          className="px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-float hover:scale-105 active:scale-95 transition-all text-sm"
        >
          {pomodoro.isRunning ? (
            <>
              <IconPlayerPause size={18} />
              <span>{t.pomodoroPause}</span>
            </>
          ) : (
            <>
              <IconPlayerPlay size={18} />
              <span>{t.pomodoroStart}</span>
            </>
          )}
        </button>

        {/* Skip to next round button */}
        <button
          onClick={onSkipTimer}
          title={t.pomodoroSkipCycle}
          className="p-2.5 rounded-2xl bg-[var(--glance-accent-subtle)] hover:bg-[var(--glance-accent-subtle-hover)] text-[var(--glance-accent-text)] border border-[var(--glance-accent-border-subtle)] shadow-sm transition-all active:scale-95"
        >
          <IconPlayerSkipForward size={18} />
        </button>
      </div>

      {/* 5. Extra Settings Accordion */}
      <div className="w-full pt-1">
        <button
          onClick={() => setShowExtraSettings(!showExtraSettings)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-semibold text-[var(--glance-text-muted)] hover:text-[var(--glance-accent-text)] hover:bg-[var(--glance-accent-subtle)] transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <IconSettings size={13} />
            <span>{t.pomodoroSettingsTitle}</span>
          </div>
          {showExtraSettings ? <IconChevronUp size={13} /> : <IconChevronDown size={13} />}
        </button>

        {showExtraSettings && (
          <div className="mt-2 p-3 bg-[var(--glance-card-bg)] rounded-2xl border border-[var(--glance-accent-border-subtle)] space-y-2.5 text-xs animate-in fade-in duration-100">
            {/* Work Duration Picker */}
            <div>
              <span className="block text-[10px] font-bold text-[var(--glance-text-muted)] uppercase mb-1">
                {t.pomodoroDurationWork}
              </span>
              <div className="flex items-center gap-1">
                {[15, 20, 25, 30, 45, 50].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => onUpdateSettings({ pomodoroWorkMinutes: mins })}
                    style={
                      settings.pomodoroWorkMinutes === mins
                        ? { backgroundColor: 'var(--glance-accent)', color: '#ffffff' }
                        : undefined
                    }
                    className={`flex-1 py-1 rounded-lg text-center font-bold text-[11px] transition-all ${
                      settings.pomodoroWorkMinutes === mins
                        ? 'shadow-sm'
                        : 'bg-[var(--glance-accent-subtle)] text-[var(--glance-text-muted)] hover:text-[var(--glance-accent-text)]'
                    }`}
                  >
                    {mins}
                  </button>
                ))}
              </div>
            </div>

            {/* Short Break Duration Picker */}
            <div>
              <span className="block text-[10px] font-bold text-[var(--glance-text-muted)] uppercase mb-1">
                {t.pomodoroDurationBreak}
              </span>
              <div className="flex items-center gap-1">
                {[3, 5, 10].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => onUpdateSettings({ pomodoroBreakMinutes: mins })}
                    style={
                      settings.pomodoroBreakMinutes === mins
                        ? { backgroundColor: 'var(--glance-accent)', color: '#ffffff' }
                        : undefined
                    }
                    className={`flex-1 py-1 rounded-lg text-center font-bold text-[11px] transition-all ${
                      settings.pomodoroBreakMinutes === mins
                        ? 'shadow-sm'
                        : 'bg-[var(--glance-accent-subtle)] text-[var(--glance-text-muted)] hover:text-[var(--glance-accent-text)]'
                    }`}
                  >
                    {mins}
                  </button>
                ))}
              </div>
            </div>

            {/* Long Break Duration Picker */}
            <div>
              <span className="block text-[10px] font-bold text-[var(--glance-text-muted)] uppercase mb-1">
                {t.pomodoroDurationLongBreak}
              </span>
              <div className="flex items-center gap-1">
                {[10, 15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => onUpdateSettings({ pomodoroLongBreakMinutes: mins })}
                    style={
                      settings.pomodoroLongBreakMinutes === mins
                        ? { backgroundColor: 'var(--glance-accent)', color: '#ffffff' }
                        : undefined
                    }
                    className={`flex-1 py-1 rounded-lg text-center font-bold text-[11px] transition-all ${
                      settings.pomodoroLongBreakMinutes === mins
                        ? 'shadow-sm'
                        : 'bg-[var(--glance-accent-subtle)] text-[var(--glance-text-muted)] hover:text-[var(--glance-accent-text)]'
                    }`}
                  >
                    {mins}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="pt-1 flex items-center justify-between border-t border-[var(--glance-accent-border-subtle)]">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--glance-text-main)]">
                {settings.pomodoroSoundEnabled ? <IconVolume size={14} style={{ color: 'var(--glance-accent)' }} /> : <IconVolumeOff size={14} className="opacity-40" />}
                <span>{t.pomodoroSoundLabel}</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ pomodoroSoundEnabled: !settings.pomodoroSoundEnabled })}
                style={settings.pomodoroSoundEnabled ? { backgroundColor: 'var(--glance-accent)' } : undefined}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  settings.pomodoroSoundEnabled ? '' : 'bg-black/20 dark:bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition duration-200 ${
                    settings.pomodoroSoundEnabled ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
