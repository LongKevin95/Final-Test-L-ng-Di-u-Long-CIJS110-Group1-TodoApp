import { useState } from "react";
import "./App.css";
import Tabs from "./components/Todo/Tabs";
import TodoInput from "./components/Todo/TodoInput";
import TodoList from "./components/Todo/TodoList";

function App() {
  const [todos, setTodos] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: input,
      active: true,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, active: !todo.active } : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const deleteAllCompleted = () => {
    setTodos((prev) => prev.filter((todo) => todo.active));
  };

  const filteredTodos = todos.filter((todo) => {
    if (currentTab === "active") return todo.active;
    if (currentTab === "completed") return !todo.active;
    return true;
  });

  return (
    <div className="container">
      <h1>#todo</h1>

      <Tabs tab={currentTab} setTab={setCurrentTab} />

      {(currentTab === "all" || currentTab === "active") && (
        <TodoInput input={input} setInput={setInput} onAdd={handleAdd} />
      )}

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        tab={currentTab}
      />

      {currentTab === "completed" && (
        <button className="delete-all" onClick={deleteAllCompleted}>
          <img
            className="todo-delete"
            src="../../src/assets/trash-can-white.svg"
            alt=""
          />
          delete all
        </button>
      )}
    </div>
  );
}

export default App;
