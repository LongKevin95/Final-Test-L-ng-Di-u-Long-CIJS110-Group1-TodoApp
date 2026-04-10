import trashCanIcon from "../assets/trash-can.svg";

function TodoItem({
  todo,
  onToggle,
  onDelete,
  showDelete,
  isToggling,
  isDeleting,
  isDeleteDisabled,
}) {
  return (
    <li className="todo-item">
      <button
        type="button"
        className="todo-toggle"
        onClick={() => onToggle(todo.id)}
        disabled={isToggling}
        aria-label={
          todo.active ? "Mark todo as completed" : "Mark todo as active"
        }
      >
        {isToggling ? (
          <span className="checkbox-spinner" aria-hidden="true" />
        ) : (
          <input
            type="checkbox"
            checked={!todo.active}
            readOnly
            tabIndex={-1}
          />
        )}
      </button>

      <span className={`todo-text ${!todo.active ? "done" : ""}`.trim()}>
        {todo.text}
      </span>

      {showDelete && (
        <button
          className={`todo-delete ${isDeleting ? "is-loading" : ""}`.trim()}
          onClick={() => onDelete(todo.id)}
          disabled={isDeleteDisabled}
        >
          {isDeleting ? (
            <span className="delete-spinner" aria-hidden="true" />
          ) : (
            <img src={trashCanIcon} alt="-icon" />
          )}
        </button>
      )}
    </li>
  );
}

export default TodoItem;
