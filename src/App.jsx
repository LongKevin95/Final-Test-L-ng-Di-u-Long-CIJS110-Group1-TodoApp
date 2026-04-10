import { useEffect, useState } from "react";
import "./App.css";
import trashCanWhiteIcon from "./assets/trash-can-white.svg";
import Tabs from "./components/Tabs";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

const API_KEY = "69ca4ee923e7029021931e3a";
const RESOURCE_NAME = "final-test-todos";
const RESOURCE_URL = `https://mindx-mockup-server.vercel.app/api/resources/${RESOURCE_NAME}`;
const REQUEST_URL = `${RESOURCE_URL}?apiKey=${API_KEY}`;

function normalizeTodo(todo) {
  return {
    id: todo._id,
    text: todo.text ?? "",
    active: todo.active ?? true,
  };
}

function App() {
  const [todos, setTodos] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [togglingTodoIds, setTogglingTodoIds] = useState([]);
  const [deletingTodoIds, setDeletingTodoIds] = useState([]);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  const fetchTodos = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsLoadingTodos(true);
      }

      setErrorMessage("");
      const response = await fetch(REQUEST_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể tải danh sách todo.");
      }

      setTodos((result.data?.data || []).map(normalizeTodo));
    } catch (error) {
      setErrorMessage(error.message || "Không thể tải danh sách todo.");
    } finally {
      if (showLoading) {
        setIsLoadingTodos(false);
      }
    }
  };

  useEffect(() => {
    fetchTodos(true);
  }, []);

  const handleAdd = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || isAdding) return;

    try {
      setErrorMessage("");
      setIsAdding(true);

      const response = await fetch(REQUEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmedInput,
          active: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể thêm todo.");
      }

      setInput("");
      await fetchTodos();
    } catch (error) {
      setErrorMessage(error.message || "Không thể thêm todo.");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (id) => {
    const targetTodo = todos.find((todo) => todo.id === id);

    if (!targetTodo || togglingTodoIds.includes(id)) return;

    try {
      setErrorMessage("");
      setTogglingTodoIds((prev) => [...prev, id]);

      const response = await fetch(`${RESOURCE_URL}/${id}?apiKey=${API_KEY}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: targetTodo.text,
          active: !targetTodo.active,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Không thể cập nhật trạng thái todo.",
        );
      }

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, active: !todo.active } : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(error.message || "Không thể cập nhật trạng thái todo.");
    } finally {
      setTogglingTodoIds((prev) => prev.filter((todoId) => todoId !== id));
    }
  };

  const deleteTodo = async (id) => {
    if (deletingTodoIds.includes(id) || isDeletingCompleted) return;

    try {
      setErrorMessage("");
      setDeletingTodoIds((prev) => [...prev, id]);

      const response = await fetch(`${RESOURCE_URL}/${id}?apiKey=${API_KEY}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể xóa todo.");
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      setErrorMessage(error.message || "Không thể xóa todo.");
    } finally {
      setDeletingTodoIds((prev) => prev.filter((todoId) => todoId !== id));
    }
  };

  const deleteAllCompleted = async () => {
    const completedTodos = todos.filter((todo) => !todo.active);

    if (!completedTodos.length || isDeletingCompleted) return;

    try {
      setErrorMessage("");
      setIsDeletingCompleted(true);

      const responses = await Promise.all(
        completedTodos.map((todo) =>
          fetch(`${RESOURCE_URL}/${todo.id}?apiKey=${API_KEY}`, {
            method: "DELETE",
          }),
        ),
      );

      const failedResponse = responses.find((response) => !response.ok);

      if (failedResponse) {
        let failedMessage = "Không thể xóa các todo đã hoàn thành.";

        try {
          const failedResult = await failedResponse.json();
          failedMessage =
            failedResult.message || "Không thể xóa các todo đã hoàn thành.";
        } catch {
          failedMessage = "Không thể xóa các todo đã hoàn thành.";
        }

        throw new Error(failedMessage);
      }

      setTodos((prev) => prev.filter((todo) => todo.active));
    } catch (error) {
      setErrorMessage(error.message || "Không thể xóa các todo đã hoàn thành.");
    } finally {
      setIsDeletingCompleted(false);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (currentTab === "active") return todo.active;
    if (currentTab === "completed") return !todo.active;
    return true;
  });

  const isDeleteActionLocked =
    isDeletingCompleted || deletingTodoIds.length > 0;

  return (
    <div className="container">
      <h1>#todo</h1>

      {errorMessage && <p>{errorMessage}</p>}

      <Tabs tab={currentTab} setTab={setCurrentTab} />

      {(currentTab === "all" || currentTab === "active") && (
        <TodoInput
          input={input}
          setInput={setInput}
          onAdd={handleAdd}
          isAdding={isAdding}
        />
      )}
      {isLoadingTodos && <p className="loading-todos">Loading todos...</p>}
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        tab={currentTab}
        togglingTodoIds={togglingTodoIds}
        deletingTodoIds={deletingTodoIds}
        isDeleteDisabled={isDeleteActionLocked}
      />

      {currentTab === "completed" && (
        <button
          className={`delete-all ${isDeletingCompleted ? "is-loading" : ""}`.trim()}
          onClick={deleteAllCompleted}
          disabled={isDeleteActionLocked}
        >
          {isDeletingCompleted ? (
            <span className="button-spinner" aria-hidden="true" />
          ) : (
            <img className="todo-delete" src={trashCanWhiteIcon} alt="" />
          )}
          delete all
        </button>
      )}
    </div>
  );
}

export default App;
