import React, { useEffect, useRef } from 'react';
import {
  IconCopy,
  IconTarget,
  IconTrash,
} from '@tabler/icons-react';
import { Task, Language, Priority } from '../types';
import { translations } from '../i18n/translations';

interface ContextMenuProps {
  task: Task;
  position: { x: number; y: number };
  language: Language;
  onClose: () => void;
  onCopyTitle: (task: Task) => void;
  onCopyFull: (task: Task) => void;
  onSetPriority: (taskId: string, priority: Priority) => void;
  onToggleFocus: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  task,
  position,
  language,
  onClose,
  onCopyTitle,
  onCopyFull,
  onSetPriority,
  onToggleFocus,
  onDelete,
}) => {
  const t = translations[language];
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust position so it doesn't clip screen
  const style: React.CSSProperties = {
    top: Math.min(position.y, window.innerHeight - 220),
    left: Math.min(position.x, window.innerWidth - 200),
  };

  return (
    <div
      ref={menuRef}
      style={style}
      className="fixed z-50 w-52 bg-white/95 dark:bg-[#1a172a]/95 backdrop-blur-md border border-purple-200/80 dark:border-purple-800/60 rounded-2xl shadow-float p-1.5 text-xs text-glance-textMain dark:text-purple-100 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Task preview snippet */}
      <div className="px-2.5 py-1 text-[11px] font-semibold text-purple-900/70 dark:text-purple-300/80 truncate border-b border-purple-100 dark:border-purple-900/50 mb-1">
        {task.title}
      </div>

      {/* Copy title */}
      <button
        onClick={() => {
          onCopyTitle(task);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/40 text-left transition-colors"
      >
        <IconCopy size={13} className="text-purple-600 dark:text-purple-400" />
        <span>{t.contextCopyTitle}</span>
      </button>

      {/* Copy full task */}
      <button
        onClick={() => {
          onCopyFull(task);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/40 text-left transition-colors"
      >
        <IconCopy size={13} className="text-purple-600 dark:text-purple-400" />
        <span>{t.contextCopyFull}</span>
      </button>

      {/* Focus on this task */}
      <button
        onClick={() => {
          onToggleFocus(task.id);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/40 text-left transition-colors"
      >
        <IconTarget size={13} className="text-purple-600 dark:text-purple-400" />
        <span>{t.contextFocus}</span>
      </button>

      {/* Priority quick switch */}
      <div className="px-2.5 py-1.5 border-t border-purple-100 dark:border-purple-900/50 mt-1">
        <span className="block text-[10px] font-semibold text-purple-400 mb-1">
          Басымдық / Приоритет
        </span>
        <div className="flex items-center gap-1.5">
          {(['P1', 'P2', 'P3'] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                onSetPriority(task.id, p);
                onClose();
              }}
              className={`flex-1 py-1 rounded-lg text-center font-bold text-[10px] transition-all ${
                task.priority === p
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/70 dark:text-purple-300 dark:hover:bg-purple-900/60'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Delete */}
      <div className="border-t border-purple-100 dark:border-purple-900/50 pt-1 mt-1">
        <button
          onClick={() => {
            onDelete(task.id);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 text-left transition-colors"
        >
          <IconTrash size={13} />
          <span>{t.contextDelete}</span>
        </button>
      </div>
    </div>
  );
};
