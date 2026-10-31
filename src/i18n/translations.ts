import { Language, Priority } from '../types';

export interface TranslationDict {
  appName: string;
  tagline: string;
  quickAddPlaceholder: string;
  addSubtaskPlaceholder: string;
  notesPlaceholder: string;
  allDone: string;
  noTasks: string;
  noTasksSub: string;
  clearCompleted: string;
  completedTasksArchived: string;
  archiveButtonTooltip: string;
  focusMode: string;
  exitFocus: string;
  focusActive: string;
  lockTooltipLocked: string;
  lockTooltipUnlocked: string;
  rollupTooltip: string;
  alwaysOnTopTooltipOn: string;
  alwaysOnTopTooltipOff: string;
  pomodoroWork: string;
  pomodoroBreak: string;
  pomodoroReset: string;
  pomodoroStart: string;
  pomodoroPause: string;
  subtasks: string;
  notesAndLinks: string;
  priorityLabel: Record<Priority, string>;
  priorityDesc: Record<Priority, string>;
  contextCopyTitle: string;
  contextCopyFull: string;
  contextFocus: string;
  contextDelete: string;
  copiedNotification: string;
  doneCount: (completed: number, total: number) => string;
  hotkeyHint: string;
  externalLinkWarning: string;
  themeToggleDark: string;
  themeToggleLight: string;
  tabTasks: string;
  tabPomodoro: string;
  settingsTitle: string;
  settingsTooltip: string;
  languageSection: string;
  themeSection: string;
  themeLight: string;
  themeDark: string;
  lockSection: string;
  lockSectionDesc: string;
  accentColorSection: string;
  accentSystem: string;
  accentSystemDesc: string;
  close: string;
  pomodoroLongBreak: string;
  pomodoroCycleLabel: (current: number, total: number) => string;
  pomodoroSkipCycle: string;
  pomodoroDurationWork: string;
  pomodoroDurationBreak: string;
  pomodoroDurationLongBreak: string;
  pomodoroActiveTask: string;
  pomodoroNoTaskLinked: string;
  pomodoroSoundLabel: string;
  pomodoroSettingsTitle: string;
}

export const translations: Record<Language, TranslationDict> = {
  kk: {
    appName: 'glance',
    tagline: 'Жедел тапсырма виджеті',
    quickAddPlaceholder: 'Жаңа тапсырма қосу... (Enter)',
    addSubtaskPlaceholder: 'Қадам немесе шағын тапсырма қосу...',
    notesPlaceholder: 'Толық сипаттама, қадамдар немесе сілтемелер (GitHub, Jira, Docs)...',
    allDone: 'Барлық тапсырма орындалды! Керемет!',
    noTasks: 'Әзірге тапсырмалар жоқ',
    noTasksSub: 'Жоғарыдағы өріске жазып, Enter басыңыз',
    clearCompleted: 'Орындалғандарды тазалау',
    completedTasksArchived: 'Тапсырмалар мұрағатталды',
    archiveButtonTooltip: 'Орындалған тапсырмаларды archive.json және archive.md файлдарына сақтау',
    focusMode: 'Назар аудару',
    exitFocus: 'Фокустан шығу',
    focusActive: 'Назар аудару режимі белсенді',
    lockTooltipLocked: 'Орны құлыпталған (жылжыту мүмкін емес)',
    lockTooltipUnlocked: 'Құлыпты ашу (жылжытуға болады)',
    rollupTooltip: 'Шторка режимі (ықшамдау)',
    alwaysOnTopTooltipOn: 'Әрқашан үстінде (қосулы)',
    alwaysOnTopTooltipOff: 'Жұмыс үстелінде бекітілген',
    pomodoroWork: 'Жұмыс',
    pomodoroBreak: 'Үзіліс',
    pomodoroReset: 'Қайта бастау',
    pomodoroStart: 'Бастау',
    pomodoroPause: 'Кідірту',
    subtasks: 'Қадамдар',
    notesAndLinks: 'Сипаттама мен сілтемелер',
    priorityLabel: {
      P1: 'Шұғыл',
      P2: 'Бүгін',
      P3: 'Бэклог',
    },
    priorityDesc: {
      P1: 'Шұғыл тапсырма',
      P2: 'Күн ішінде орындау',
      P3: 'Келешекке қалдырылған',
    },
    contextCopyTitle: 'Тапсырманы көшіру',
    contextCopyFull: 'Толық сипаттамасымен көшіру',
    contextFocus: 'Осыған назар аудару',
    contextDelete: 'Жою',
    copiedNotification: 'Буферге көшірілді',
    doneCount: (completed, total) => `${completed}/${total} орындалды`,
    hotkeyHint: 'Ctrl+Alt+N',
    externalLinkWarning: 'Браузерде ашу',
    themeToggleDark: 'Күңгірт тақырыпқа ауысу',
    themeToggleLight: 'Жарық тақырыпқа ауысу',
    tabTasks: 'Тапсырмалар',
    tabPomodoro: 'Помодоро',
    settingsTitle: 'Баптаулар',
    settingsTooltip: 'Баптаулар терезесін ашу',
    languageSection: 'Интерфейс тілі',
    themeSection: 'Тақырып',
    themeLight: 'Жарық',
    themeDark: 'Күңгірт',
    lockSection: 'Виджет орнын құлыптау',
    lockSectionDesc: 'Виджеттің кездейсоқ жылжып кетуін болдырмайды',
    accentColorSection: 'Акценттік түс',
    accentSystem: 'Жүйе түсі (Windows)',
    accentSystemDesc: 'Windows жүйесінің ағымдағы түсіне бейімделеді',
    close: 'Жабу',
    pomodoroLongBreak: 'Ұзақ үзіліс',
    pomodoroCycleLabel: (current, total) => `Цикл: ${current}/${total}`,
    pomodoroSkipCycle: 'Келесі кезеңге өту',
    pomodoroDurationWork: 'Жұмыс уақыты (мин)',
    pomodoroDurationBreak: 'Қысқа үзіліс (мин)',
    pomodoroDurationLongBreak: 'Ұзақ үзіліс (мин)',
    pomodoroActiveTask: 'Назардағы тапсырма',
    pomodoroNoTaskLinked: 'Байланбаған (тапсырмадан 🎯 басыңыз)',
    pomodoroSoundLabel: 'Дыбыстық сигнал',
    pomodoroSettingsTitle: 'Таймер параметрлері',
  },
  ru: {
    appName: 'glance',
    tagline: 'Виджет задач на рабочем столе',
    quickAddPlaceholder: 'Новая задача... (Enter)',
    addSubtaskPlaceholder: 'Добавить пункт или подзадачу...',
    notesPlaceholder: 'Подробное описание, шаги или ссылки (GitHub, Jira, Docs)...',
    allDone: 'Все задачи выполнены! Отличная работа!',
    noTasks: 'Задач пока нет',
    noTasksSub: 'Введите задачу выше и нажмите Enter',
    clearCompleted: 'Очистить завершенные',
    completedTasksArchived: 'Задачи перенесены в архив',
    archiveButtonTooltip: 'Перенести выполненные задачи в archive.json и archive.md',
    focusMode: 'Фокус на задаче',
    exitFocus: 'Выйти из фокуса',
    focusActive: 'Режим фокуса активен',
    lockTooltipLocked: 'Положение заблокировано',
    lockTooltipUnlocked: 'Разблокировано (можно перемещать)',
    rollupTooltip: 'Режим шторки (компактный вид)',
    alwaysOnTopTooltipOn: 'Всегда поверх окон (включено)',
    alwaysOnTopTooltipOff: 'Прикреплен к рабочему столу',
    pomodoroWork: 'Спринт',
    pomodoroBreak: 'Отдых',
    pomodoroReset: 'Сбросить',
    pomodoroStart: 'Старт',
    pomodoroPause: 'Пауза',
    subtasks: 'Подзадачи',
    notesAndLinks: 'Заметки и ссылки',
    priorityLabel: {
      P1: 'Срочно',
      P2: 'Сегодня',
      P3: 'Бэклог',
    },
    priorityDesc: {
      P1: 'Срочная задача',
      P2: 'В течение дня',
      P3: 'В свободное время',
    },
    contextCopyTitle: 'Копировать название',
    contextCopyFull: 'Копировать задачу целиком',
    contextFocus: 'Сфокусироваться на этой задаче',
    contextDelete: 'Удалить',
    copiedNotification: 'Скопировано в буфер',
    doneCount: (completed, total) => `${completed}/${total} выполнено`,
    hotkeyHint: 'Ctrl+Alt+N',
    externalLinkWarning: 'Открыть в браузере',
    themeToggleDark: 'Включить темную тему',
    themeToggleLight: 'Включить светлую тему',
    tabTasks: 'Задачи',
    tabPomodoro: 'Помодоро',
    settingsTitle: 'Настройки',
    settingsTooltip: 'Открыть настройки',
    languageSection: 'Язык интерфейса',
    themeSection: 'Тема оформления',
    themeLight: 'Светлая',
    themeDark: 'Тёмная',
    lockSection: 'Блокировка положения',
    lockSectionDesc: 'Защищает виджет от случайного сдвига курсором',
    accentColorSection: 'Акцентный цвет',
    accentSystem: 'Как в системе (Windows)',
    accentSystemDesc: 'Использовать системный цвет оформления Windows',
    close: 'Закрыть',
    pomodoroLongBreak: 'Длинный отдых',
    pomodoroCycleLabel: (current, total) => `Цикл: ${current}/${total}`,
    pomodoroSkipCycle: 'Пропустить раунд',
    pomodoroDurationWork: 'Время работы (мин)',
    pomodoroDurationBreak: 'Короткий отдых (мин)',
    pomodoroDurationLongBreak: 'Длинный отдых (мин)',
    pomodoroActiveTask: 'Фокус-задача',
    pomodoroNoTaskLinked: 'Не привязана (нажмите 🎯 в списке задач)',
    pomodoroSoundLabel: 'Звуковой сигнал',
    pomodoroSettingsTitle: 'Параметры таймера',
  },
  en: {
    appName: 'glance',
    tagline: 'Desktop Todo Widget',
    quickAddPlaceholder: 'New task... (Enter)',
    addSubtaskPlaceholder: 'Add a subtask or step...',
    notesPlaceholder: 'Detailed notes, steps, or links (GitHub, Jira, Docs)...',
    allDone: 'All tasks completed! Great job!',
    noTasks: 'No active tasks',
    noTasksSub: 'Type a task above and press Enter',
    clearCompleted: 'Clear completed',
    completedTasksArchived: 'Tasks archived',
    archiveButtonTooltip: 'Move completed tasks to archive.json and archive.md',
    focusMode: 'Focus task',
    exitFocus: 'Exit focus',
    focusActive: 'Focus mode active',
    lockTooltipLocked: 'Position locked',
    lockTooltipUnlocked: 'Unlocked (draggable)',
    rollupTooltip: 'Roll-up mode (compact bar)',
    alwaysOnTopTooltipOn: 'Always on top (enabled)',
    alwaysOnTopTooltipOff: 'Pinned to desktop',
    pomodoroWork: 'Focus',
    pomodoroBreak: 'Break',
    pomodoroReset: 'Reset',
    pomodoroStart: 'Start',
    pomodoroPause: 'Pause',
    subtasks: 'Subtasks',
    notesAndLinks: 'Notes & Links',
    priorityLabel: {
      P1: 'Urgent',
      P2: 'Today',
      P3: 'Backlog',
    },
    priorityDesc: {
      P1: 'High priority',
      P2: 'Do today',
      P3: 'Low priority backlog',
    },
    contextCopyTitle: 'Copy title',
    contextCopyFull: 'Copy full task with notes',
    contextFocus: 'Focus on this task',
    contextDelete: 'Delete',
    copiedNotification: 'Copied to clipboard',
    doneCount: (completed, total) => `${completed}/${total} done`,
    hotkeyHint: 'Ctrl+Alt+N',
    externalLinkWarning: 'Open in browser',
    themeToggleDark: 'Switch to dark theme',
    themeToggleLight: 'Switch to light theme',
    tabTasks: 'Tasks',
    tabPomodoro: 'Pomodoro',
    settingsTitle: 'Settings',
    settingsTooltip: 'Open settings',
    languageSection: 'Language',
    themeSection: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    lockSection: 'Lock layout',
    lockSectionDesc: 'Prevents accidental dragging while working',
    accentColorSection: 'Accent color',
    accentSystem: 'Windows Accent',
    accentSystemDesc: 'Matches your current Windows theme color',
    close: 'Close',
    pomodoroLongBreak: 'Long Break',
    pomodoroCycleLabel: (current, total) => `Cycle: ${current}/${total}`,
    pomodoroSkipCycle: 'Skip cycle',
    pomodoroDurationWork: 'Focus time (min)',
    pomodoroDurationBreak: 'Short break (min)',
    pomodoroDurationLongBreak: 'Long break (min)',
    pomodoroActiveTask: 'Focus task',
    pomodoroNoTaskLinked: 'None linked (click 🎯 on any task)',
    pomodoroSoundLabel: 'Sound alert',
    pomodoroSettingsTitle: 'Timer parameters',
  },
};
