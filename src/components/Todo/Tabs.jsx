function Tabs({ tab, setTab }) {
  return (
    <div className="tabs">
      <button
        onClick={() => setTab("all")}
        className={tab === "all" ? "active" : ""}
      >
        All
      </button>
      <button
        onClick={() => setTab("active")}
        className={tab === "active" ? "active" : ""}
      >
        Active
      </button>
      <button
        onClick={() => setTab("completed")}
        className={tab === "completed" ? "active" : ""}
      >
        Completed
      </button>
    </div>
  );
}
export default Tabs;
