import { contextBridge, ipcRenderer } from 'electron';
import { Task, AppSettings } from './storage';

contextBridge.exposeInMainWorld('glanceAPI', {
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  saveTasks: (tasks: Task[]) => ipcRenderer.invoke('save-tasks', tasks),
  archiveTasks: (tasks: Task[]) => ipcRenderer.invoke('archive-tasks', tasks),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Partial<AppSettings>) => ipcRenderer.invoke('save-settings', settings),
  setWindowLocked: (locked: boolean) => ipcRenderer.invoke('set-window-locked', locked),
  setWindowCollapsed: (collapsed: boolean) => ipcRenderer.invoke('set-window-collapsed', collapsed),
  setAlwaysOnTop: (alwaysOnTop: boolean) => ipcRenderer.invoke('set-always-on-top', alwaysOnTop),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  copyToClipboard: (text: string) => ipcRenderer.invoke('copy-to-clipboard', text),
  playNotificationSound: () => ipcRenderer.invoke('play-notification-sound'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  getSystemAccentColor: () => ipcRenderer.invoke('get-system-accent-color'),
  onQuickCapture: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('quick-capture', handler);
    return () => {
      ipcRenderer.removeListener('quick-capture', handler);
    };
  },
});
