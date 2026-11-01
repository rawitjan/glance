import { Language } from '../types';

export function padZero(n: number): string {
  return String(n).padStart(2, '0');
}

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
}

export function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
}

export function getDateInDaysString(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
}

export interface DeadlineInfo {
  datePart: string;
  timePart?: string;
  hasTime: boolean;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
}

export function parseDeadline(dueDate?: string): DeadlineInfo | null {
  if (!dueDate || typeof dueDate !== 'string') return null;

  const [datePart, timePart] = dueDate.split('T');
  if (!datePart) return null;

  const hasTime = !!timePart;
  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();

  const isToday = datePart === todayStr;
  const isTomorrow = datePart === tomorrowStr;

  let isOverdue = false;
  if (hasTime) {
    const target = new Date(dueDate);
    isOverdue = target.getTime() < Date.now();
  } else {
    // Overdue if the date has passed completely (before today)
    isOverdue = datePart < todayStr;
  }

  return {
    datePart,
    timePart,
    hasTime,
    isOverdue,
    isToday,
    isTomorrow,
  };
}

export function formatDeadlineText(dueDate: string, language: Language): string {
  const info = parseDeadline(dueDate);
  if (!info) return '';

  const { datePart, timePart, isToday, isTomorrow, isOverdue } = info;
  const locale = language === 'kk' ? 'kk-KZ' : language === 'ru' ? 'ru-RU' : 'en-US';

  let dateLabel = '';
  if (isToday) {
    dateLabel = language === 'kk' ? 'Бүгін' : language === 'ru' ? 'Сегодня' : 'Today';
  } else if (isTomorrow) {
    dateLabel = language === 'kk' ? 'Ертең' : language === 'ru' ? 'Завтра' : 'Tomorrow';
  } else {
    const [y, m, d] = datePart.split('-').map(Number);
    const now = new Date();
    const targetDate = new Date(y, m - 1, d);
    dateLabel = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: y !== now.getFullYear() ? 'numeric' : undefined,
    }).format(targetDate);
  }

  const baseText = timePart ? `${dateLabel}, ${timePart}` : dateLabel;

  if (isOverdue) {
    const overdueLabel = language === 'kk' ? 'Мерзімі өтті' : language === 'ru' ? 'Просрочено' : 'Overdue';
    return `${overdueLabel}: ${baseText}`;
  }

  return baseText;
}

export function getDeadlineBadgeStyle(info: DeadlineInfo, completed: boolean): string {
  if (completed) {
    return 'opacity-55 bg-black/5 dark:bg-white/5 text-[var(--glance-text-muted)] border-transparent line-through';
  }
  if (info.isOverdue) {
    return 'bg-red-50 text-red-600 border-red-200/90 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900/60 font-semibold';
  }
  if (info.isToday) {
    return 'bg-amber-50 text-amber-700 border-amber-200/90 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60 font-medium';
  }
  if (info.isTomorrow) {
    return 'bg-sky-50 text-sky-700 border-sky-200/90 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900/60 font-medium';
  }
  return 'bg-[var(--glance-accent-subtle)] text-[var(--glance-accent-text)] border-[var(--glance-accent-border-subtle)] font-medium';
}
