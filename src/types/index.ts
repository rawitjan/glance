export type Priority = 'P1' | 'P2' | 'P3';

export type Language = 'kk' | 'ru' | 'en';

export type Theme = 'light' | 'dark';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string; // Multiline notes with URL links
  priority: Priority;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  dueDate?: string; // Optional deadline: YYYY-MM-DD or YYYY-MM-DDTHH:mm
  subtasks: Subtask[];
  isExpanded?: boolean;
}

export type TabType = 'tasks' | 'pomodoro';

export interface AppSettings {
  language: Language;
  theme: Theme;
  accentColor: string;
  isLocked: boolean;
  alwaysOnTop: boolean;
  isCollapsed: boolean;
  globalHotkey: string;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  pomodoroLongBreakMinutes: number;
  pomodoroCyclesBeforeLongBreak: number;
  pomodoroSoundEnabled: boolean;
  windowX?: number;
  windowY?: number;
  autoStart: boolean;
  hideFromTaskbar: boolean;
  desktopPinned: boolean;
}

export type PomodoroMode = 'work' | 'break' | 'longBreak';

export interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number; // in seconds
  isRunning: boolean;
  cycleCount: number;
}

export interface GlanceAPI {
  getTasks: () => Promise<Task[]>;
  saveTasks: (tasks: Task[]) => Promise<boolean>;
  archiveTasks: (tasks: Task[]) => Promise<{ success: boolean; count: number }>;
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<boolean>;
  setWindowLocked: (locked: boolean) => Promise<void>;
  setWindowCollapsed: (collapsed: boolean) => Promise<void>;
  setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<void>;
  openExternal: (url: string) => Promise<void>;
  copyToClipboard: (text: string) => Promise<void>;
  playNotificationSound: () => Promise<void>;
  minimizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  getSystemAccentColor?: () => Promise<string | null>;
  onQuickCapture: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    glanceAPI?: GlanceAPI;
  }
}
