import TodoItem from "./TodoItem";

function TodoList({ todos, onToggle, onDelete, tab }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          showDelete={tab === "completed"}
        />
      ))}
    </ul>
  );
}
export default TodoList;
