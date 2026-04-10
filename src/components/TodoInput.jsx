function TodoInput({ input, setInput, onAdd, isAdding }) {
  return (
    <div className="input-group">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="add details"
        disabled={isAdding}
      />
      <button
        onClick={onAdd}
        disabled={isAdding}
        className={isAdding ? "is-loading" : ""}
      >
        {isAdding ? (
          <span className="button-spinner" aria-hidden="true" />
        ) : (
          "Add"
        )}
      </button>
    </div>
  );
}

export default TodoInput;
