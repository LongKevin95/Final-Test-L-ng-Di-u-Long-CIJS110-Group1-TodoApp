import TodoItem from "./TodoItem";

function TodoList({
  todos,
  onToggle,
  onDelete,
  tab,
  togglingTodoIds,
  deletingTodoIds,
  isDeleteDisabled,
}) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          showDelete={tab === "completed"}
          isToggling={togglingTodoIds.includes(todo.id)}
          isDeleting={deletingTodoIds.includes(todo.id)}
          isDeleteDisabled={isDeleteDisabled}
        />
      ))}
    </ul>
  );
}
export default TodoList;
