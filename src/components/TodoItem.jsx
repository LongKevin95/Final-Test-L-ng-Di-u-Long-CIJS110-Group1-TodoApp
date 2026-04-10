import trashCanIcon from "../assets/trash-can.svg";

function TodoItem({ todo, onToggle, onDelete, showDelete }) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={!todo.active}
        onChange={() => onToggle(todo.id)}
      />

      <span className={`todo-text ${!todo.active ? "done" : ""}`.trim()}>
        {todo.text}
      </span>

      {showDelete && (
        <button className="todo-delete" onClick={() => onDelete(todo.id)}>
          <img src={trashCanIcon} alt="-icon" />
        </button>
      )}
    </li>
  );
}

export default TodoItem;
