import TodoItem from './TodoItem';
import type { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number) => void;
  deletingId: number | null;
}

export default function TodoList({ todos, onDeleteTodo, onToggleTodo, deletingId }: TodoListProps) {
  return (
    <ul className="border-t border-border-subtle">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={index}
          onDelete={onDeleteTodo}
          onToggle={onToggleTodo}
          isDeleting={deletingId === todo.id}
        />
      ))}
    </ul>
  );
}
