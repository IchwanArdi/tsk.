import { useState } from 'react';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

export default function TodoInput({ onAddTodo }: TodoInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput) {
      onAddTodo(trimmedInput);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div
        className={`
          flex items-center gap-3 px-4 py-3.5
          bg-surface border transition-all duration-300
          ${isFocused ? 'border-accent/40' : 'border-border hover:border-border'}
        `}
      >
        {/* Caret indicator */}
        <span
          className={`
            text-sm font-mono transition-colors duration-200
            ${isFocused ? 'text-accent' : 'text-text-dim'}
          `}
        >
          &gt;
        </span>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="add a task..."
          className="flex-1 bg-transparent font-mono text-sm text-text placeholder:text-text-dim/60
                     focus:outline-none"
          id="todo-input"
        />

        <button
          type="submit"
          className={`
            px-3 py-1.5 text-xs font-mono uppercase tracking-widest
            transition-all duration-200 cursor-pointer
            ${input.trim()
              ? 'text-bg bg-accent hover:bg-accent/90'
              : 'text-text-dim bg-transparent border border-border cursor-default'
            }
          `}
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>

      {/* Focus line */}
      <div
        className={`
          absolute bottom-0 left-0 h-[1.5px] bg-accent
          transition-all duration-300 ease-out
          ${isFocused ? 'w-full' : 'w-0'}
        `}
      />
    </form>
  );
}
