import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'P1' | 'P2' | 'P3';
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  dueDate?: string;
  subtasks: Subtask[];
  isExpanded?: boolean;
}

export interface AppSettings {
  language: 'kk' | 'ru' | 'en';
  theme: 'light' | 'dark';
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
  windowWidth?: number;
  windowHeight?: number;
  autoStart: boolean;
  hideFromTaskbar: boolean;
  desktopPinned: boolean;
}

const defaultSettings: AppSettings = {
  language: 'kk',
  theme: 'light',
  accentColor: '#6e56cf',
  isLocked: false,
  alwaysOnTop: false,
  isCollapsed: false,
  globalHotkey: 'Ctrl+Alt+N',
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  pomodoroLongBreakMinutes: 15,
  pomodoroCyclesBeforeLongBreak: 4,
  pomodoroSoundEnabled: true,
  autoStart: true,
  hideFromTaskbar: true,
  desktopPinned: true,
};

export class StorageManager {
  private dataDir: string;
  private tasksFile: string;
  private archiveFile: string;
  private archiveMdFile: string;
  private settingsFile: string;

  constructor() {
    // Save in user data directory under 'glance-data'
    const userDir = app.getPath('userData');
    this.dataDir = path.join(userDir, 'glance-data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    this.tasksFile = path.join(this.dataDir, 'tasks.json');
    this.archiveFile = path.join(this.dataDir, 'archive.json');
    this.archiveMdFile = path.join(this.dataDir, 'archive.md');
    this.settingsFile = path.join(this.dataDir, 'settings.json');

    // Create default initial files if they don't exist
    this.initDefaults();
  }

  private initDefaults() {
    if (!fs.existsSync(this.tasksFile)) {
      const initialTasks: Task[] = [
        {
          id: 'welcome-1',
          title: 'Glance виджетіне қош келдіңіз! ✨',
          description: 'Мұнда сілтемелерді енгізуге болады: https://prtner.ai/font/ru\nҚосарлы шерту (double-click) арқылы мәтінді бірден өңдеңіз.',
          priority: 'P1',
          completed: false,
          createdAt: Date.now(),
          subtasks: [
            { id: 'sub-1', title: 'Тапсырманы басып, аккордеонды қарау', completed: true },
            { id: 'sub-2', title: 'Ctrl+Alt+N пернелерін басып көру', completed: false },
            { id: 'sub-3', title: 'Құлып 🔒 және шторка 🔽 режимдерін тексеру', completed: false }
          ],
          isExpanded: true
        },
        {
          id: 'welcome-2',
          title: 'Pomodoro таймерін бастау (25 мин)',
          description: 'Шапкадағы таймерді қосып, бір іске толық назар аударыңыз.',
          priority: 'P2',
          completed: false,
          createdAt: Date.now() - 3600000,
          subtasks: [],
          isExpanded: false
        }
      ];
      this.writeJson(this.tasksFile, initialTasks);
    }

    if (!fs.existsSync(this.settingsFile)) {
      this.writeJson(this.settingsFile, defaultSettings);
    }

    if (!fs.existsSync(this.archiveFile)) {
      this.writeJson(this.archiveFile, []);
    }

    if (!fs.existsSync(this.archiveMdFile)) {
      fs.writeFileSync(
        this.archiveMdFile,
        '# Glance Archive Log\n\nБұл жерде орындалған және мұрағатталған тапсырмалар сақталады.\n\n',
        'utf-8'
      );
    }
  }

  private readJson<T>(filePath: string, fallback: T): T {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error(`Failed to read JSON from ${filePath}`, err);
    }
    return fallback;
  }

  private writeJson<T>(filePath: string, data: T) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Failed to write JSON to ${filePath}`, err);
    }
  }

  public getTasks(): Task[] {
    return this.readJson<Task[]>(this.tasksFile, []);
  }

  public saveTasks(tasks: Task[]): boolean {
    try {
      this.writeJson(this.tasksFile, tasks);
      return true;
    } catch {
      return false;
    }
  }

  public archiveTasks(tasksToArchive: Task[]): { success: boolean; count: number } {
    if (!tasksToArchive || tasksToArchive.length === 0) {
      return { success: true, count: 0 };
    }

    const currentArchive = this.readJson<Task[]>(this.archiveFile, []);
    const timestamp = Date.now();
    const updatedToArchive = tasksToArchive.map(t => ({
      ...t,
      completed: true,
      completedAt: t.completedAt || timestamp
    }));

    // Save to archive.json
    const newArchive = [...updatedToArchive, ...currentArchive];
    this.writeJson(this.archiveFile, newArchive);

    // Append to human-readable archive.md
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      let mdContent = `\n### ${dateStr} - ${new Date().toLocaleTimeString()}\n`;
      for (const t of updatedToArchive) {
        const priorityBadge = `[${t.priority}]`;
        const deadlineBadge = t.dueDate ? ` (📅 ${t.dueDate})` : '';
        mdContent += `- [x] **${priorityBadge} ${t.title}**${deadlineBadge}\n`;
        if (t.description) {
          const lines = t.description.split('\n').map(l => `  > ${l}`).join('\n');
          mdContent += `${lines}\n`;
        }
        if (t.subtasks && t.subtasks.length > 0) {
          for (const s of t.subtasks) {
            mdContent += `  - [${s.completed ? 'x' : ' '}] ${s.title}\n`;
          }
        }
      }
      fs.appendFileSync(this.archiveMdFile, mdContent, 'utf-8');
    } catch (err) {
      console.error('Failed to append to archive.md', err);
    }

    return { success: true, count: updatedToArchive.length };
  }

  public getSettings(): AppSettings {
    const loaded = this.readJson<Partial<AppSettings>>(this.settingsFile, {});
    return { ...defaultSettings, ...loaded };
  }

  public saveSettings(patch: Partial<AppSettings>): boolean {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...patch };
      this.writeJson(this.settingsFile, updated);
      return true;
    } catch {
      return false;
    }
  }

  public getDataDirPath(): string {
    return this.dataDir;
  }
}
