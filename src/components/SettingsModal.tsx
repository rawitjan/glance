import React, { useEffect, useRef } from 'react';
import {
  IconX,
  IconSun,
  IconMoon,
  IconLock,
  IconLockOpen,
  IconDeviceDesktop,
  IconCheck,
  IconKeyboard,
  IconRocket,
  IconAppWindow,
  IconSparkles,
} from '@tabler/icons-react';
import { Language, Theme, AppSettings } from '../types';
import { translations } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  systemAccentColor: string | null;
}

const PRESET_ACCENTS = [
  { id: '#5d3ee8', label: 'Violet', color: '#5d3ee8' },
  { id: '#6e56cf', label: 'Lavender', color: '#6e56cf' },
  { id: '#2563eb', label: 'Ocean', color: '#2563eb' },
  { id: '#059669', label: 'Emerald', color: '#059669' },
  { id: '#e11d48', label: 'Rose', color: '#e11d48' },
  { id: '#d97706', label: 'Amber', color: '#d97706' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  systemAccentColor,
}) => {
  const t = translations[settings.language];
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        ref={modalRef}
        style={{
          backgroundColor: 'var(--glance-card-bg)',
          borderColor: 'var(--glance-accent-border)',
        }}
        className="w-full max-w-[340px] max-h-[560px] flex flex-col backdrop-blur-2xl border rounded-3xl shadow-float overflow-hidden select-none animate-in zoom-in-95 duration-150 text-[var(--glance-text-main)]"
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--glance-accent-border-subtle)]">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: 'var(--glance-accent)' }}
              className="w-2 h-2 rounded-full"
            />
            <span className="font-bold text-sm tracking-tight text-[var(--glance-text-main)]">
              {t.settingsTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            title={t.close}
            className="p-1 rounded-xl text-[var(--glance-text-muted)] hover:text-[var(--glance-accent)] hover:bg-[var(--glance-accent-subtle)] transition-colors"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Scrollable Settings Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1. Language Section */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[var(--glance-text-muted)] uppercase tracking-wider">
              {t.languageSection}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'kk', label: 'Қазақша', flag: '🇰🇿' },
                  { id: 'ru', label: 'Русский', flag: '🇷🇺' },
                  { id: 'en', label: 'English', flag: '🇬🇧' },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => onUpdateSettings({ language: lang.id })}
                  style={
                    settings.language === lang.id
                      ? { backgroundColor: 'var(--glance-accent)', color: '#ffffff' }
                      : undefined
                  }
                  className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                    settings.language === lang.id
                      ? 'border-transparent shadow-sm font-semibold'
                      : 'bg-[var(--glance-card-bg)] border-[var(--glance-accent-border-subtle)] hover:border-[var(--glance-accent)] text-[var(--glance-text-main)]'
                  }`}
                >
                  <span className="block text-xs">{lang.flag}</span>
                  <span className="text-[11px] font-medium">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Theme Section */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[var(--glance-text-muted)] uppercase tracking-wider">
              {t.themeSection}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ theme: 'light' })}
                style={
                  settings.theme === 'light'
                    ? { backgroundColor: 'var(--glance-accent)', color: '#ffffff' }
                    : undefined
                }
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all ${
                  settings.theme === 'light'
                    ? 'border-transparent shadow-sm font-semibold'
                    : 'bg-[var(--glance-card-bg)] border-[var(--glance-accent-border-subtle)] hover:border-[var(--glance-accent)] text-[var(--glance-text-main)]'
                }`}
              >
                <IconSun size={15} />
                <span className="font-medium">{t.themeLight}</span>
              </button>
              <button
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                style={
                  settings.theme === 'dark'
                    ? { backgroundColor: 'var(--glance-accent)', color: '#ffffff' }
                    : undefined
                }
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all ${
                  settings.theme === 'dark'
                    ? 'border-transparent shadow-sm font-semibold'
                    : 'bg-[var(--glance-card-bg)] border-[var(--glance-accent-border-subtle)] hover:border-[var(--glance-accent)] text-[var(--glance-text-main)]'
                }`}
              >
                <IconMoon size={15} />
                <span className="font-medium">{t.themeDark}</span>
              </button>
            </div>
          </div>

          {/* 3. Lock Layout Section */}
          <div className="p-3 bg-[var(--glance-accent-subtle)] rounded-2xl border border-[var(--glance-accent-border-subtle)] flex items-center justify-between">
            <div className="pr-2">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--glance-text-main)]">
                {settings.isLocked ? <IconLock size={14} className="text-amber-500" /> : <IconLockOpen size={14} className="opacity-50" />}
                <span>{t.lockSection}</span>
              </div>
              <p className="text-[10px] text-[var(--glance-text-muted)] mt-0.5 leading-snug">
                {t.lockSectionDesc}
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ isLocked: !settings.isLocked })}
              style={settings.isLocked ? { backgroundColor: '#f59e0b' } : undefined}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.isLocked ? '' : 'bg-black/20 dark:bg-white/20'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.isLocked ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. macOS Widget Mode Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <IconSparkles size={14} className="text-[var(--glance-accent)]" />
              <label className="text-[11px] font-bold text-[var(--glance-text-muted)] uppercase tracking-wider">
                {t.widgetSection}
              </label>
            </div>

            <div className="space-y-2">
              {/* Auto-start with Windows */}
              <div className="p-3 bg-[var(--glance-accent-subtle)] rounded-2xl border border-[var(--glance-accent-border-subtle)] flex items-center justify-between">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--glance-text-main)]">
                    <IconRocket size={14} className="text-[var(--glance-accent)]" />
                    <span>{t.autoStartLabel}</span>
                  </div>
                  <p className="text-[10px] text-[var(--glance-text-muted)] mt-0.5 leading-snug">
                    {t.autoStartDesc}
                  </p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ autoStart: !settings.autoStart })}
                  style={settings.autoStart ? { backgroundColor: 'var(--glance-accent)' } : undefined}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.autoStart ? '' : 'bg-black/20 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      settings.autoStart ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Desktop Pinned (Win+D) */}
              <div className="p-3 bg-[var(--glance-accent-subtle)] rounded-2xl border border-[var(--glance-accent-border-subtle)] flex items-center justify-between">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--glance-text-main)]">
                    <IconDeviceDesktop size={14} className="text-[var(--glance-accent)]" />
                    <span>{t.desktopPinnedLabel}</span>
                  </div>
                  <p className="text-[10px] text-[var(--glance-text-muted)] mt-0.5 leading-snug">
                    {t.desktopPinnedDesc}
                  </p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ desktopPinned: !settings.desktopPinned })}
                  style={settings.desktopPinned ? { backgroundColor: 'var(--glance-accent)' } : undefined}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.desktopPinned ? '' : 'bg-black/20 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      settings.desktopPinned ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Hide from Taskbar */}
              <div className="p-3 bg-[var(--glance-accent-subtle)] rounded-2xl border border-[var(--glance-accent-border-subtle)] flex items-center justify-between">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--glance-text-main)]">
                    <IconAppWindow size={14} className="text-[var(--glance-accent)]" />
                    <span>{t.hideFromTaskbarLabel}</span>
                  </div>
                  <p className="text-[10px] text-[var(--glance-text-muted)] mt-0.5 leading-snug">
                    {t.hideFromTaskbarDesc}
                  </p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ hideFromTaskbar: !settings.hideFromTaskbar })}
                  style={settings.hideFromTaskbar ? { backgroundColor: 'var(--glance-accent)' } : undefined}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.hideFromTaskbar ? '' : 'bg-black/20 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      settings.hideFromTaskbar ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 5. Accent Color Section */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-[var(--glance-text-muted)] uppercase tracking-wider">
              {t.accentColorSection}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_ACCENTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onUpdateSettings({ accentColor: preset.id })}
                  title={preset.label}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
                  style={{ backgroundColor: preset.color }}
                >
                  {settings.accentColor === preset.id && (
                    <IconCheck size={14} className="text-white stroke-[3]" />
                  )}
                </button>
              ))}

              {/* Windows System Accent Tile */}
              <button
                onClick={() => onUpdateSettings({ accentColor: 'system' })}
                title={`${t.accentSystem}: ${systemAccentColor || '#5d3ee8'}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 ${
                  settings.accentColor === 'system'
                    ? 'border-transparent text-white font-semibold shadow-sm'
                    : 'bg-[var(--glance-card-bg)] border-[var(--glance-accent-border-subtle)] text-[var(--glance-text-main)]'
                }`}
                style={
                  settings.accentColor === 'system'
                    ? { backgroundColor: systemAccentColor || '#5d3ee8' }
                    : {}
                }
              >
                <IconDeviceDesktop size={13} />
                <span className="text-[10px] font-medium">{t.accentSystem}</span>
                {settings.accentColor === 'system' && (
                  <IconCheck size={12} className="stroke-[3]" />
                )}
              </button>

              {/* Custom Color Input */}
              <label
                title="Кез келген түс / Любой цвет"
                className="w-7 h-7 rounded-full border border-dashed border-[var(--glance-accent-border)] flex items-center justify-center cursor-pointer hover:scale-110 transition-all overflow-hidden relative"
              >
                <input
                  type="color"
                  value={settings.accentColor.startsWith('#') ? settings.accentColor : '#5d3ee8'}
                  onChange={(e) => onUpdateSettings({ accentColor: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-[10px] font-bold">🎨</span>
              </label>
            </div>
          </div>

          {/* 5. Hotkey Info Card */}
          <div className="p-2.5 bg-[var(--glance-accent-subtle)] rounded-2xl border border-[var(--glance-accent-border-subtle)] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[var(--glance-accent-text)] font-medium">
              <IconKeyboard size={14} />
              <span>Quick Capture</span>
            </div>
            <kbd className="px-2 py-0.5 rounded-lg bg-[var(--glance-card-bg)] border border-[var(--glance-accent-border-subtle)] font-mono text-[10px] font-bold text-[var(--glance-text-main)] shadow-2xs">
              {settings.globalHotkey}
            </kbd>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[var(--glance-accent-subtle)] border-t border-[var(--glance-accent-border-subtle)] flex justify-end">
          <button
            onClick={onClose}
            style={{ backgroundColor: 'var(--glance-accent)', color: '#ffffff' }}
            className="px-4 py-1.5 rounded-xl font-semibold text-xs shadow-sm hover:opacity-95 active:scale-95 transition-all"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
