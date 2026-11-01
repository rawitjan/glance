"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const defaultSettings = {
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
};
class StorageManager {
    dataDir;
    tasksFile;
    archiveFile;
    archiveMdFile;
    settingsFile;
    constructor() {
        // Save in user data directory under 'glance-data'
        const userDir = electron_1.app.getPath('userData');
        this.dataDir = path_1.default.join(userDir, 'glance-data');
        if (!fs_1.default.existsSync(this.dataDir)) {
            fs_1.default.mkdirSync(this.dataDir, { recursive: true });
        }
        this.tasksFile = path_1.default.join(this.dataDir, 'tasks.json');
        this.archiveFile = path_1.default.join(this.dataDir, 'archive.json');
        this.archiveMdFile = path_1.default.join(this.dataDir, 'archive.md');
        this.settingsFile = path_1.default.join(this.dataDir, 'settings.json');
        // Create default initial files if they don't exist
        this.initDefaults();
    }
    initDefaults() {
        if (!fs_1.default.existsSync(this.tasksFile)) {
            const initialTasks = [
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
        if (!fs_1.default.existsSync(this.settingsFile)) {
            this.writeJson(this.settingsFile, defaultSettings);
        }
        if (!fs_1.default.existsSync(this.archiveFile)) {
            this.writeJson(this.archiveFile, []);
        }
        if (!fs_1.default.existsSync(this.archiveMdFile)) {
            fs_1.default.writeFileSync(this.archiveMdFile, '# Glance Archive Log\n\nБұл жерде орындалған және мұрағатталған тапсырмалар сақталады.\n\n', 'utf-8');
        }
    }
    readJson(filePath, fallback) {
        try {
            if (fs_1.default.existsSync(filePath)) {
                const raw = fs_1.default.readFileSync(filePath, 'utf-8');
                return JSON.parse(raw);
            }
        }
        catch (err) {
            console.error(`Failed to read JSON from ${filePath}`, err);
        }
        return fallback;
    }
    writeJson(filePath, data) {
        try {
            fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (err) {
            console.error(`Failed to write JSON to ${filePath}`, err);
        }
    }
    getTasks() {
        return this.readJson(this.tasksFile, []);
    }
    saveTasks(tasks) {
        try {
            this.writeJson(this.tasksFile, tasks);
            return true;
        }
        catch {
            return false;
        }
    }
    archiveTasks(tasksToArchive) {
        if (!tasksToArchive || tasksToArchive.length === 0) {
            return { success: true, count: 0 };
        }
        const currentArchive = this.readJson(this.archiveFile, []);
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
            fs_1.default.appendFileSync(this.archiveMdFile, mdContent, 'utf-8');
        }
        catch (err) {
            console.error('Failed to append to archive.md', err);
        }
        return { success: true, count: updatedToArchive.length };
    }
    getSettings() {
        const loaded = this.readJson(this.settingsFile, {});
        return { ...defaultSettings, ...loaded };
    }
    saveSettings(patch) {
        try {
            const current = this.getSettings();
            const updated = { ...current, ...patch };
            this.writeJson(this.settingsFile, updated);
            return true;
        }
        catch {
            return false;
        }
    }
    getDataDirPath() {
        return this.dataDir;
    }
}
exports.StorageManager = StorageManager;
