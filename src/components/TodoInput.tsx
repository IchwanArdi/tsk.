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
          bg-zinc-900 border transition-all duration-300
          ${isFocused ? 'border-indigo-500/40' : 'border-zinc-800 hover:border-zinc-700'}
        `}
      >
        {/* Caret indicator */}
        <span
          className={`
            text-sm font-mono transition-colors duration-200
            ${isFocused ? 'text-indigo-400' : 'text-zinc-500'}
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
          className="flex-1 bg-transparent font-mono text-sm text-zinc-100 placeholder:text-zinc-500/60
                     focus:outline-none"
          id="todo-input"
        />

        <button
          type="submit"
          className={`
            px-3 py-1.5 text-xs font-mono uppercase tracking-widest
            transition-all duration-200 cursor-pointer
            ${input.trim() ? 'text-black bg-indigo-500 hover:bg-indigo-400 ' : ' text-zinc-500 bg-transparent border border-zinc-800 cursor-default'}
          `}
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>

      {/* Focus line */}
      <div
        className={`
          absolute bottom-0 left-0 h-[1.5px] bg-indigo-500
          transition-all duration-300 ease-out
          ${isFocused ? 'w-full' : 'w-0'}
        `}
      />
    </form>
  );
}
