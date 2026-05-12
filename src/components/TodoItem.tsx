import type { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  index: number;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  isDeleting: boolean;
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TodoItem({ todo, index, onDelete, onToggle, isDeleting }: TodoItemProps) {
  return (
    <li
      className={`
        group flex items-center gap-4 px-4 py-4
        border-b border-zinc-800/50
        transition-all duration-200
        hover:bg-zinc-900/50
        ${isDeleting ? 'animate-slide-out' : 'animate-fade-in-up'}
        ${todo.completed ? 'opacity-50' : ''}
      `}
      style={{ animationDelay: isDeleting ? '0ms' : `${index * 50}ms` }}
    >
      {/* Custom Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            className="check-svg"
            d="M2 6L5 9L10 3"
            stroke={todo.completed ? '#0a0a0a' : 'transparent'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Task text + time */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            font-mono text-sm truncate transition-colors duration-200
            ${todo.completed ? 'line-through text-zinc-500' : 'text-zinc-100'}
          `}
        >
          {todo.text}
        </p>
        {todo.createdAt && (
          <p className="text-[11px] font-mono text-zinc-500 mt-1 tracking-wide">
            {getRelativeTime(todo.createdAt)}
          </p>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-all duration-200
                   text-zinc-500 hover:text-red-500 text-xs font-mono
                   px-2 py-1 hover:bg-red-500/10 rounded cursor-pointer"
        aria-label="Delete task"
      >
        DEL
      </button>
    </li>
  );
}
