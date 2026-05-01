const statusLabels = {
  pending: "Pending",
  "in-progress": "In progress",
  done: "Done",
};

function TaskCard({ task, onDelete, onStatusChange }) {
  const dueDate = new Date(task.dueDate);
  const overdue = task.status !== "done" && dueDate < new Date();

  return (
    <article className={`task-card priority-${task.priority}`}>
      <div className="task-card-header">
        <div>
          <span className={`status-pill ${task.status}`}>{statusLabels[task.status]}</span>
          <h3>{task.title}</h3>
        </div>
        <span className={`priority-pill ${task.priority}`}>{task.priority}</span>
      </div>

      <p>{task.description || "No description added."}</p>

      <div className="task-meta">
        <span>{task.project?.name || "No project"}</span>
        <span>{task.assignedTo?.name || "Unassigned"}</span>
        <span className={overdue ? "overdue" : ""}>
          Due {dueDate.toLocaleDateString()}
        </span>
      </div>

      {onStatusChange && (
        <div className="status-actions" aria-label="Update task status">
          {Object.keys(statusLabels).map((status) => (
            <button
              key={status}
              className={task.status === status ? "active" : ""}
              onClick={() => onStatusChange(task._id, status)}
              type="button"
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      )}

      {onDelete && (
        <div className="card-actions">
          <button className="danger-button" onClick={() => onDelete(task._id)} type="button">
            Delete task
          </button>
        </div>
      )}
    </article>
  );
}

export default TaskCard;
