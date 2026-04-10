function TodoInput({ input, setInput, onAdd }) {
  return (
    <div className="input-group">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="add details"
      />
      <button onClick={onAdd}>Add</button>
    </div>
  );
}

export default TodoInput;
