import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { PomodoroTab } from './components/PomodoroTab';
import { SettingsModal } from './components/SettingsModal';
import { QuickAdd, QuickAddRef } from './components/QuickAdd';
import { TaskCard } from './components/TaskCard';
import { CompactBar } from './components/CompactBar';
import { ContextMenu } from './components/ContextMenu';
import { FocusBanner } from './components/FocusBanner';
import { FooterBar } from './components/FooterBar';
import { Task, Priority, Language, Theme, TabType, PomodoroState, PomodoroMode, AppSettings } from './types';
import { translations } from './i18n/translations';
import { getDynamicThemeVariables } from './utils/theme';

// Pleasant Web Audio synthesizer chime for Pomodoro finish
function playChimeAudio() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    // Melody: C5 -> E5 -> G5
    playTone(523.25, now, 0.4);
    playTone(659.25, now + 0.15, 0.4);
    playTone(783.99, now + 0.3, 0.6);
  } catch {
    // Audio fallback
  }
}

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [systemAccentColor, setSystemAccentColor] = useState<string | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    language: 'kk',
    theme: 'light',
    accentColor: '#5d3ee8',
    isLocked: false,
    alwaysOnTop: false,
    isCollapsed: false,
    globalHotkey: 'Ctrl+Alt+N',
    pomodoroWorkMinutes: 25,
    pomodoroBreakMinutes: 5,
    pomodoroLongBreakMinutes: 15,
    pomodoroCyclesBeforeLongBreak: 4,
    pomodoroSoundEnabled: true,
  });

  const [pomodoro, setPomodoro] = useState<PomodoroState>({
    mode: 'work',
    timeLeft: 25 * 60,
    isRunning: false,
    cycleCount: 1,
  });

  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    task: Task;
    position: { x: number; y: number };
  } | null>(null);

  const quickAddRef = useRef<QuickAddRef>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[settings.language];

  // Resolve active accent color (preset or dynamic Windows accent)
  const activeAccent = settings.accentColor === 'system'
    ? (systemAccentColor || '#5d3ee8')
    : (settings.accentColor || '#5d3ee8');

  // Complete dynamic theme palette across light & night themes
  const cssAccentVariables = getDynamicThemeVariables(
    activeAccent,
    settings.theme === 'dark'
  ) as React.CSSProperties;

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  // Sync theme to document element
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Load initial data and Windows system accent color
  useEffect(() => {
    const loadInitialData = async () => {
      if (window.glanceAPI) {
        try {
          const [loadedTasks, loadedSettings, accent] = await Promise.all([
            window.glanceAPI.getTasks(),
            window.glanceAPI.getSettings(),
            window.glanceAPI.getSystemAccentColor ? window.glanceAPI.getSystemAccentColor() : Promise.resolve(null),
          ]);
          if (loadedTasks) setTasks(loadedTasks);
          if (accent) setSystemAccentColor(accent);
          if (loadedSettings) {
            setSettings(loadedSettings);
            setPomodoro((prev) => ({
              ...prev,
              timeLeft: (loadedSettings.pomodoroWorkMinutes || 25) * 60,
            }));
          }
        } catch (err) {
          console.error('Failed to load initial data via IPC', err);
        }
      } else {
        // Fallback for browser testing
        const saved = localStorage.getItem('glance_tasks');
        if (saved) {
          try {
            setTasks(JSON.parse(saved));
          } catch {}
        }
      }
    };

    loadInitialData();
  }, []);

  // Register Global Hotkey Quick Capture listener
  useEffect(() => {
    if (window.glanceAPI) {
      const cleanup = window.glanceAPI.onQuickCapture(() => {
        if (settings.isCollapsed) {
          handleToggleRollup();
        }
        setActiveTab('tasks');
        setTimeout(() => {
          quickAddRef.current?.focus();
        }, 50);
      });
      return cleanup;
    }
  }, [settings.isCollapsed]);

  // Update timer remaining when user changes durations while timer is not running
  useEffect(() => {
    if (!pomodoro.isRunning) {
      const duration =
        (pomodoro.mode === 'work'
          ? settings.pomodoroWorkMinutes
          : pomodoro.mode === 'break'
          ? settings.pomodoroBreakMinutes
          : settings.pomodoroLongBreakMinutes) * 60;
      setPomodoro((prev) => ({ ...prev, timeLeft: duration }));
    }
  }, [
    pomodoro.mode,
    pomodoro.isRunning,
    settings.pomodoroWorkMinutes,
    settings.pomodoroBreakMinutes,
    settings.pomodoroLongBreakMinutes,
  ]);

  // Pomodoro countdown timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomodoro.isRunning) {
      interval = setInterval(() => {
        setPomodoro((prev) => {
          if (prev.timeLeft <= 1) {
            // Timer finished
            if (settings.pomodoroSoundEnabled) {
              playChimeAudio();
              if (window.glanceAPI) {
                window.glanceAPI.playNotificationSound();
              }
            }

            let nextMode: PomodoroMode = 'work';
            let nextCycle = prev.cycleCount;

            if (prev.mode === 'work') {
              if (prev.cycleCount >= settings.pomodoroCyclesBeforeLongBreak) {
                nextMode = 'longBreak';
                nextCycle = 1;
              } else {
                nextMode = 'break';
                nextCycle = prev.cycleCount + 1;
              }
            } else {
              nextMode = 'work';
            }

            const nextDuration =
              (nextMode === 'work'
                ? settings.pomodoroWorkMinutes
                : nextMode === 'break'
                ? settings.pomodoroBreakMinutes
                : settings.pomodoroLongBreakMinutes) * 60;

            showToast(
              nextMode === 'work'
                ? `${t.pomodoroWork}! Жаңа спринт басталды`
                : nextMode === 'longBreak'
                ? `${t.pomodoroLongBreak}! Ұзақ демалыс`
                : `${t.pomodoroBreak}! 5 минут тынығыңыз`
            );

            return {
              mode: nextMode,
              timeLeft: nextDuration,
              isRunning: false,
              cycleCount: nextCycle,
            };
          }
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    pomodoro.isRunning,
    settings.pomodoroWorkMinutes,
    settings.pomodoroBreakMinutes,
    settings.pomodoroLongBreakMinutes,
    settings.pomodoroCyclesBeforeLongBreak,
    settings.pomodoroSoundEnabled,
    showToast,
    t,
  ]);

  // Auto-save tasks
  const saveTasks = useCallback(
    (newTasks: Task[]) => {
      setTasks(newTasks);
      if (window.glanceAPI) {
        window.glanceAPI.saveTasks(newTasks);
      } else {
        localStorage.setItem('glance_tasks', JSON.stringify(newTasks));
      }
    },
    []
  );

  // Auto-save settings
  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        if (window.glanceAPI) {
          window.glanceAPI.saveSettings(patch);
          if (patch.isLocked !== undefined) {
            window.glanceAPI.setWindowLocked(patch.isLocked);
          }
          if (patch.alwaysOnTop !== undefined) {
            window.glanceAPI.setAlwaysOnTop(patch.alwaysOnTop);
          }
        }
        return next;
      });
    },
    []
  );

  // Task Actions
  const handleAddTask = (title: string, priority: Priority) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      description: '',
      priority,
      completed: false,
      createdAt: Date.now(),
      subtasks: [],
      isExpanded: false,
    };
    saveTasks([newTask, ...tasks]);
  };

  const handleToggleComplete = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? Date.now() : undefined,
          }
        : t
    );
    saveTasks(updated);
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, title: newTitle } : t
    );
    saveTasks(updated);
  };

  const handleUpdateDescription = (id: string, newDesc: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, description: newDesc } : t
    );
    saveTasks(updated);
  };

  const handleToggleExpand = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
    );
    saveTasks(updated);
  };

  const handleToggleFocus = (id: string) => {
    setFocusedTaskId((prev) => (prev === id ? null : id));
  };

  const handleDeleteTask = (id: string) => {
    if (focusedTaskId === id) setFocusedTaskId(null);
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const handleSetPriority = (id: string, priority: Priority) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, priority } : t
    );
    saveTasks(updated);
  };

  // Subtask Actions
  const handleAddSubtask = (taskId: string, subtaskTitle: string) => {
    const newSub = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: subtaskTitle,
      completed: false,
    };
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [...(t.subtasks || []), newSub],
        };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          ),
        };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
        };
      }
      return t;
    });
    saveTasks(updated);
  };

  // Header / Window Actions
  const handleToggleAlwaysOnTop = () => {
    const nextTop = !settings.alwaysOnTop;
    updateSettings({ alwaysOnTop: nextTop });
  };

  const handleToggleRollup = () => {
    const nextCollapsed = !settings.isCollapsed;
    updateSettings({ isCollapsed: nextCollapsed });
    if (window.glanceAPI) {
      window.glanceAPI.setWindowCollapsed(nextCollapsed);
    }
  };

  // Pomodoro Actions
  const handlePomodoroToggle = () => {
    setPomodoro((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handlePomodoroReset = () => {
    const duration =
      (pomodoro.mode === 'work'
        ? settings.pomodoroWorkMinutes
        : pomodoro.mode === 'break'
        ? settings.pomodoroBreakMinutes
        : settings.pomodoroLongBreakMinutes) * 60;
    setPomodoro((prev) => ({
      ...prev,
      timeLeft: duration,
      isRunning: false,
    }));
  };

  const handlePomodoroSkip = () => {
    let nextMode: PomodoroMode = 'work';
    let nextCycle = pomodoro.cycleCount;

    if (pomodoro.mode === 'work') {
      if (pomodoro.cycleCount >= settings.pomodoroCyclesBeforeLongBreak) {
        nextMode = 'longBreak';
        nextCycle = 1;
      } else {
        nextMode = 'break';
        nextCycle = pomodoro.cycleCount + 1;
      }
    } else {
      nextMode = 'work';
    }

    const duration =
      (nextMode === 'work'
        ? settings.pomodoroWorkMinutes
        : nextMode === 'break'
        ? settings.pomodoroBreakMinutes
        : settings.pomodoroLongBreakMinutes) * 60;

    setPomodoro({
      mode: nextMode,
      timeLeft: duration,
      isRunning: false,
      cycleCount: nextCycle,
    });
  };

  const handlePomodoroModeChange = (mode: PomodoroMode) => {
    const duration =
      (mode === 'work'
        ? settings.pomodoroWorkMinutes
        : mode === 'break'
        ? settings.pomodoroBreakMinutes
        : settings.pomodoroLongBreakMinutes) * 60;
    setPomodoro((prev) => ({
      ...prev,
      mode,
      timeLeft: duration,
      isRunning: false,
    }));
  };

  // Archive Completed Tasks
  const handleClearCompleted = async () => {
    const completed = tasks.filter((t) => t.completed);
    if (completed.length === 0) return;

    if (window.glanceAPI) {
      const res = await window.glanceAPI.archiveTasks(completed);
      if (res.success) {
        showToast(`${res.count} ${t.completedTasksArchived}`);
      }
    } else {
      showToast(`${completed.length} ${t.completedTasksArchived}`);
    }

    const remaining = tasks.filter((t) => !t.completed);
    saveTasks(remaining);
  };

  // Context Menu & Clipboard
  const handleContextMenu = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    setContextMenu({
      task,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleCopyTitle = (task: Task) => {
    if (window.glanceAPI) {
      window.glanceAPI.copyToClipboard(task.title);
    } else {
      navigator.clipboard.writeText(task.title);
    }
    showToast(t.copiedNotification);
  };

  const handleCopyFull = (task: Task) => {
    let full = `[${task.priority}] ${task.title}\n`;
    if (task.description) full += `${task.description}\n`;
    if (task.subtasks && task.subtasks.length > 0) {
      full += task.subtasks
        .map((s) => `- [${s.completed ? 'x' : ' '}] ${s.title}`)
        .join('\n');
    }
    if (window.glanceAPI) {
      window.glanceAPI.copyToClipboard(full);
    } else {
      navigator.clipboard.writeText(full);
    }
    showToast(t.copiedNotification);
  };

  const handleOpenExternal = (url: string) => {
    if (window.glanceAPI) {
      window.glanceAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const focusedTask = tasks.find((t) => t.id === focusedTaskId) || null;

  // If in roll-up compact mode, display the slim bar
  if (settings.isCollapsed) {
    return (
      <div
        className={settings.theme === 'dark' ? 'dark' : ''}
        style={cssAccentVariables}
      >
        <CompactBar
          language={settings.language}
          completedCount={completedCount}
          totalCount={totalCount}
          pomodoro={pomodoro}
          isLocked={settings.isLocked}
          onExpand={handleToggleRollup}
          onPomodoroToggle={handlePomodoroToggle}
        />
      </div>
    );
  }

  return (
    <div
      style={cssAccentVariables}
      className={`w-full h-screen max-h-[620px] flex flex-col glass-widget rounded-3xl shadow-float overflow-hidden border border-[var(--glance-accent-border)] relative ${
        settings.theme === 'dark' ? 'dark' : ''
      }`}
    >
      {/* 1. Header Bar (Branding, Pin, Settings ⚙️, Rollup 🔽) */}
      <Header
        language={settings.language}
        isLocked={settings.isLocked}
        alwaysOnTop={settings.alwaysOnTop}
        onToggleAlwaysOnTop={handleToggleAlwaysOnTop}
        onToggleRollup={handleToggleRollup}
        onOpenSettings={() => setIsSettingsOpen(true)}
        pomodoroRunning={pomodoro.isRunning}
        pomodoroTimeLeft={pomodoro.timeLeft}
        pomodoroMode={pomodoro.mode}
        onSwitchToPomodoro={() => setActiveTab('pomodoro')}
      />

      {/* 2. Tab Bar: Tasks vs Pomodoro */}
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={settings.language}
        completedTasksCount={completedCount}
        totalTasksCount={totalCount}
        pomodoroRunning={pomodoro.isRunning}
      />

      {/* 3. Main Content Area */}
      {activeTab === 'tasks' ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Focus Mode Banner (if active) */}
          {focusedTaskId && (
            <FocusBanner
              language={settings.language}
              onExitFocus={() => setFocusedTaskId(null)}
            />
          )}

          {/* Quick Add Bar */}
          <QuickAdd
            ref={quickAddRef}
            language={settings.language}
            onAddTask={handleAddTask}
          />

          {/* Tasks Scrollable List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {tasks.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4">
                <span className="text-sm font-semibold text-[var(--glance-text-main)] mb-1">
                  {t.noTasks}
                </span>
                <span className="text-xs text-[var(--glance-text-muted)]">
                  {t.noTasksSub}
                </span>
              </div>
            ) : (
              tasks.map((task) => {
                const isDimmed = focusedTaskId !== null && focusedTaskId !== task.id;
                return (
                  <div
                    key={task.id}
                    className={`transition-all duration-300 ${
                      isDimmed ? 'opacity-20 blur-[0.6px] pointer-events-none scale-95' : 'opacity-100'
                    }`}
                  >
                    <TaskCard
                      task={task}
                      language={settings.language}
                      isFocused={focusedTaskId === task.id}
                      onToggleComplete={handleToggleComplete}
                      onUpdateTitle={handleUpdateTitle}
                      onUpdateDescription={handleUpdateDescription}
                      onToggleExpand={handleToggleExpand}
                      onToggleFocus={handleToggleFocus}
                      onDelete={handleDeleteTask}
                      onAddSubtask={handleAddSubtask}
                      onToggleSubtask={handleToggleSubtask}
                      onDeleteSubtask={handleDeleteSubtask}
                      onContextMenu={handleContextMenu}
                      onOpenExternal={handleOpenExternal}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Status & Archive Bar */}
          <FooterBar
            language={settings.language}
            completedCount={completedCount}
            totalCount={totalCount}
            onClearCompleted={handleClearCompleted}
            toastMessage={toastMessage}
          />
        </div>
      ) : (
        /* Pomodoro Dedicated Tab */
        <PomodoroTab
          pomodoro={pomodoro}
          onToggleTimer={handlePomodoroToggle}
          onResetTimer={handlePomodoroReset}
          onSkipTimer={handlePomodoroSkip}
          onModeChange={handlePomodoroModeChange}
          settings={settings}
          onUpdateSettings={updateSettings}
          language={settings.language}
          focusedTask={focusedTask}
          onToggleCompleteFocusedTask={handleToggleComplete}
        />
      )}

      {/* 4. Context Menu Modal */}
      {contextMenu && (
        <ContextMenu
          task={contextMenu.task}
          position={contextMenu.position}
          language={settings.language}
          onClose={() => setContextMenu(null)}
          onCopyTitle={handleCopyTitle}
          onCopyFull={handleCopyFull}
          onSetPriority={handleSetPriority}
          onToggleFocus={handleToggleFocus}
          onDelete={handleDeleteTask}
        />
      )}

      {/* 5. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        systemAccentColor={systemAccentColor}
      />
    </div>
  );
};
