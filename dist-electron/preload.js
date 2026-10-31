"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('glanceAPI', {
    getTasks: () => electron_1.ipcRenderer.invoke('get-tasks'),
    saveTasks: (tasks) => electron_1.ipcRenderer.invoke('save-tasks', tasks),
    archiveTasks: (tasks) => electron_1.ipcRenderer.invoke('archive-tasks', tasks),
    getSettings: () => electron_1.ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => electron_1.ipcRenderer.invoke('save-settings', settings),
    setWindowLocked: (locked) => electron_1.ipcRenderer.invoke('set-window-locked', locked),
    setWindowCollapsed: (collapsed) => electron_1.ipcRenderer.invoke('set-window-collapsed', collapsed),
    setAlwaysOnTop: (alwaysOnTop) => electron_1.ipcRenderer.invoke('set-always-on-top', alwaysOnTop),
    openExternal: (url) => electron_1.ipcRenderer.invoke('open-external', url),
    copyToClipboard: (text) => electron_1.ipcRenderer.invoke('copy-to-clipboard', text),
    playNotificationSound: () => electron_1.ipcRenderer.invoke('play-notification-sound'),
    minimizeWindow: () => electron_1.ipcRenderer.invoke('minimize-window'),
    closeWindow: () => electron_1.ipcRenderer.invoke('close-window'),
    getSystemAccentColor: () => electron_1.ipcRenderer.invoke('get-system-accent-color'),
    onQuickCapture: (callback) => {
        const handler = () => callback();
        electron_1.ipcRenderer.on('quick-capture', handler);
        return () => {
            electron_1.ipcRenderer.removeListener('quick-capture', handler);
        };
    },
});
