import { useState, useEffect, useCallback } from 'react';
import TodoList from './components/TodoList';
import TodoInput from './components/TodoInput';
import type { Todo } from './types/Todo';

type Filter = 'all' | 'active' | 'done';

function useCurrentTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const time = useCurrentTime();

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Failed to load todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const deleteTodo = useCallback((id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      setDeletingId(null);
    }, 350);
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;
  const progress = todos.length > 0 ? completedCount / todos.length : 0;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: todos.length },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'done', label: 'Done', count: completedCount },
  ];

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-bg flex items-start justify-center px-5 sm:px-6 py-16 sm:py-28">
      <div className="w-full max-w-xl">
        {/* Header */}
        <header className="mb-14">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-grotesk text-text">
                tsk<span className="text-accent">.</span>
              </h1>
              <p className="text-text-muted text-sm font-mono mt-2 tracking-wide">
                task manager
              </p>
            </div>
            <div className="text-right font-mono">
              <p className="text-accent text-lg sm:text-xl font-semibold tabular-nums tracking-wider">
                {formattedTime}
              </p>
              <p className="text-text-muted text-xs tracking-wider uppercase mt-1">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {todos.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-xs font-mono uppercase tracking-widest">
                  Progress
                </span>
                <span className="text-text-muted text-xs font-mono">
                  <span className="text-accent font-semibold">{completedCount}</span>
                  <span className="text-text-dim"> / </span>
                  {todos.length}
                </span>
              </div>
              <div className="h-[3px] bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full origin-left transition-transform duration-500 ease-out"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Input */}
        <TodoInput onAddTodo={addTodo} />

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mt-10 mb-6 border-b border-border">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`
                relative px-4 py-2.5 text-xs font-mono uppercase tracking-widest
                transition-colors duration-200 cursor-pointer
                ${filter === f.key ? 'text-accent' : 'text-text-dim hover:text-text-muted'}
              `}
            >
              {f.label}
              <span
                className={`ml-1.5 text-[10px] ${filter === f.key ? 'text-accent/60' : 'text-text-dim/60'
                  }`}
              >
                {f.count}
              </span>
              {/* Active indicator */}
              {filter === f.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Task List */}
        {filteredTodos.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-text-muted font-mono text-sm">
              {filter === 'all' && 'No tasks yet.'}
              {filter === 'active' && 'No active tasks.'}
              {filter === 'done' && 'No completed tasks.'}
            </p>
            <p className="text-text-dim font-mono text-xs mt-3">
              {filter === 'all' ? 'Type above to create one.' : 'Switch filters to see tasks.'}
            </p>
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onDeleteTodo={deleteTodo}
            onToggleTodo={toggleTodo}
            deletingId={deletingId}
          />
        )}

        {/* Footer */}
        {completedCount > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={clearCompleted}
              className="text-text-muted text-xs font-mono uppercase tracking-widest
                         hover:text-danger transition-colors duration-200 cursor-pointer
                         py-2 px-3 rounded hover:bg-danger-muted"
            >
              Clear completed
            </button>
          </div>
        )}

        {/* Keyboard hint */}
        <div className="mt-16 text-center">
          <p className="text-text-dim text-[11px] font-mono uppercase tracking-[0.2em]">
            Press Enter to add • Click to toggle • Hover to delete
          </p>
        </div>
      </div>
    </div>
  );
}
