import React, { useState, useRef, useEffect } from 'react';
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconTarget,
  IconTrash,
  IconPlus,
  IconX,
  IconExternalLink,
} from '@tabler/icons-react';
import { Task, Language, Priority } from '../types';
import { translations } from '../i18n/translations';
import { extractUrls } from '../utils/urlParser';

interface TaskCardProps {
  task: Task;
  language: Language;
  isFocused: boolean;
  onToggleComplete: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onUpdateDescription: (id: string, newDesc: string) => void;
  onToggleExpand: (id: string) => void;
  onToggleFocus: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onContextMenu: (e: React.MouseEvent, task: Task) => void;
  onOpenExternal: (url: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  language,
  isFocused,
  onToggleComplete,
  onUpdateTitle,
  onUpdateDescription,
  onToggleExpand,
  onToggleFocus,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onContextMenu,
  onOpenExternal,
}) => {
  const t = translations[language];
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditTitle(task.title);
  }, [task.title]);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleFinishEdit = () => {
    setIsEditing(false);
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdateTitle(task.id, trimmed);
    } else {
      setEditTitle(task.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubtaskTitle.trim();
    if (!trimmed) return;
    onAddSubtask(task.id, trimmed);
    setNewSubtaskTitle('');
  };

  // Subtask statistics
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks
    ? task.subtasks.filter((s) => s.completed).length
    : 0;
  const subtaskProgress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Extract URLs for chips
  const fullText = `${task.title} ${task.description || ''}`;
  const extractedLinks = extractUrls(fullText);

  // Priority color stripes
  const priorityBorderColors: Record<Priority, string> = {
    P1: 'border-l-red-500',
    P2: 'border-l-amber-500',
    P3: 'border-l-slate-400',
  };

  const priorityPillStyles: Record<Priority, string> = {
    P1: 'bg-rose-50 text-rose-600 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40',
    P2: 'bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40',
    P3: 'bg-purple-50 text-purple-600 border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/40',
  };

  return (
    <div
      onContextMenu={(e) => onContextMenu(e, task)}
      className={`relative group rounded-2xl border-l-[3.5px] ${
        priorityBorderColors[task.priority]
      } glass-card transition-all duration-200 overflow-hidden ${
        isFocused ? 'focus-glow ring-2 ring-[var(--glance-accent)] scale-[1.01]' : ''
      } ${task.completed ? 'opacity-65' : ''}`}
    >
      {/* Top Main Row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Round Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          style={
            task.completed
              ? { backgroundColor: 'var(--glance-accent)', borderColor: 'var(--glance-accent)' }
              : { borderColor: 'var(--glance-accent-border)' }
          }
          className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
            task.completed
              ? 'text-white shadow-sm'
              : 'bg-white hover:border-[var(--glance-accent)] dark:bg-[#1c192c]'
          }`}
        >
          {task.completed && <IconCheck size={13} stroke={2.5} />}
        </button>

        {/* Task Title / Inline Edit */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={editInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleFinishEdit}
              onKeyDown={handleKeyDown}
              className="w-full px-2 py-0.5 text-sm bg-[var(--glance-card-bg)] border border-[var(--glance-accent)] rounded-lg focus:outline-none text-[var(--glance-text-main)]"
            />
          ) : (
            <span
              onDoubleClick={() => !task.completed && setIsEditing(true)}
              onClick={() => onToggleExpand(task.id)}
              title="Екі рет басып өңдеу / Двойной клик для редактирования"
              className={`block text-sm cursor-pointer select-text truncate transition-colors ${
                task.completed
                  ? 'line-through opacity-50 text-[var(--glance-text-muted)]'
                  : 'text-[var(--glance-text-main)] font-medium hover:text-[var(--glance-accent)]'
              }`}
            >
              {task.title}
            </span>
          )}

          {/* Subtask progress bar indicator (when collapsed and subtasks exist) */}
          {totalSubtasks > 0 && !task.isExpanded && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-16 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${subtaskProgress}%`, backgroundColor: 'var(--glance-accent)' }}
                />
              </div>
              <span className="text-[10px] font-medium" style={{ color: 'var(--glance-accent-text)' }}>
                [{completedSubtasks}/{totalSubtasks}]
              </span>
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Priority Pill Badge */}
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border tracking-wider uppercase ${priorityPillStyles[task.priority]}`}
          >
            {task.priority}
          </span>

          {/* Subtasks Count Badge */}
          {totalSubtasks > 0 && (
            <span
              onClick={() => onToggleExpand(task.id)}
              style={{
                backgroundColor: 'var(--glance-accent-subtle)',
                color: 'var(--glance-accent-text)',
              }}
              className="cursor-pointer text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-[var(--glance-accent-border-subtle)]"
            >
              [{completedSubtasks}/{totalSubtasks}]
            </span>
          )}

          {/* Focus Mode Button */}
          <button
            onClick={() => onToggleFocus(task.id)}
            title={isFocused ? t.exitFocus : t.focusMode}
            className={`p-1 rounded-lg transition-colors ${
              isFocused
                ? 'bg-[var(--glance-accent)] text-white shadow-sm'
                : 'text-[var(--glance-text-muted)] hover:text-[var(--glance-accent)] hover:bg-[var(--glance-accent-subtle)]'
            }`}
          >
            <IconTarget size={14} />
          </button>

          {/* Expand Accordion Chevron */}
          <button
            onClick={() => onToggleExpand(task.id)}
            className="p-1 rounded-lg text-[var(--glance-text-muted)] hover:text-[var(--glance-accent)] hover:bg-[var(--glance-accent-subtle)] transition-colors"
          >
            {task.isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Accordion Content Block (Notes & Subtasks) */}
      {task.isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-[var(--glance-accent-border-subtle)] bg-[var(--glance-accent-subtle)] text-xs space-y-2.5">
          {/* Multiline Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--glance-text-main)] mb-1">
              {t.notesAndLinks}
            </label>
            <textarea
              rows={2}
              value={task.description || ''}
              onChange={(e) => onUpdateDescription(task.id, e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full p-2 bg-[var(--glance-card-bg)] border border-[var(--glance-accent-border-subtle)] rounded-xl text-xs text-[var(--glance-text-main)] placeholder-[var(--glance-text-muted)] focus:outline-none focus:border-[var(--glance-accent)] resize-none select-text"
            />
          </div>

          {/* Clickable Extracted Link Chips */}
          {extractedLinks.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {extractedLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenExternal(link.url)}
                  title={`${link.url} (${t.externalLinkWarning})`}
                  style={{
                    backgroundColor: 'var(--glance-accent-light)',
                    color: 'var(--glance-accent-text)',
                    borderColor: 'var(--glance-accent-border-subtle)',
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors hover:opacity-90 active:scale-95"
                >
                  <IconExternalLink size={11} />
                  <span className="truncate max-w-[140px]">{link.domain}</span>
                </button>
              ))}
            </div>
          )}

          {/* Subtasks (Mini-Checklist) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--glance-text-main)]">
              <span>{t.subtasks}</span>
              {totalSubtasks > 0 && (
                <span style={{ color: 'var(--glance-accent-text)' }}>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              )}
            </div>

            {/* Subtask list */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-1">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between gap-2 p-1.5 bg-[var(--glance-card-bg)] rounded-xl border border-[var(--glance-accent-border-subtle)] group/sub"
                  >
                    <div
                      onClick={() => onToggleSubtask(task.id, subtask.id)}
                      className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                    >
                      <div
                        style={
                          subtask.completed
                            ? { backgroundColor: 'var(--glance-accent)', borderColor: 'var(--glance-accent)' }
                            : { borderColor: 'var(--glance-accent-border)' }
                        }
                        className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                          subtask.completed
                            ? 'text-white'
                            : 'bg-white dark:bg-[#141220]'
                        }`}
                      >
                        {subtask.completed && <IconCheck size={10} stroke={2.5} />}
                      </div>
                      <span
                        className={`text-xs truncate select-text ${
                          subtask.completed
                            ? 'line-through opacity-50 text-[var(--glance-text-muted)]'
                            : 'text-[var(--glance-text-main)]'
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteSubtask(task.id, subtask.id)}
                      className="opacity-0 group-hover/sub:opacity-100 p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/50 text-[var(--glance-text-muted)] hover:text-red-500 dark:hover:text-red-400 transition-opacity"
                    >
                      <IconX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subtask Input */}
            <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-1.5 pt-0.5">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder={t.addSubtaskPlaceholder}
                className="flex-1 px-2.5 py-1.5 bg-[var(--glance-card-bg)] border border-[var(--glance-accent-border-subtle)] rounded-xl text-xs placeholder-[var(--glance-text-muted)] focus:outline-none focus:border-[var(--glance-accent)] text-[var(--glance-text-main)]"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                style={{
                  backgroundColor: 'var(--glance-accent)',
                  color: '#ffffff',
                }}
                className="p-1.5 shadow-sm hover:opacity-90 disabled:opacity-40 rounded-xl transition-all"
              >
                <IconPlus size={13} stroke={2.5} />
              </button>
            </form>
          </div>

          {/* Delete Task Button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onDelete(task.id)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
            >
              <IconTrash size={12} />
              <span>{t.contextDelete}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
