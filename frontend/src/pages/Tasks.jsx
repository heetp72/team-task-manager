import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import TaskCard from "../components/TaskCard";
import { AuthContext } from "../context/AuthContextContext";

const initialForm = {
  title: "",
  description: "",
  project: "",
  assignedTo: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

function Tasks() {
  const { isAdmin } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filters, setFilters] = useState({ status: "all", project: "all" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setError("");
    try {
      const [taskRes, projectRes, userRes] = await Promise.all([API.get("/tasks"), API.get("/projects"), API.get("/users")]);
      setTasks(taskRes.data);
      setProjects(projectRes.data);
      setUsers(userRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const visibleTasks = tasks.filter((task) => {
    const statusMatch = filters.status === "all" || task.status === filters.status;
    const projectMatch = filters.project === "all" || task.project?._id === filters.project;
    return statusMatch && projectMatch;
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
      ...(name === "project" ? { assignedTo: "" } : {}),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await API.post("/tasks", form);
      setForm(initialForm);
      setMessage("Task created and assigned");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create task");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    setError("");
    setMessage("");

    try {
      const res = await API.patch(`/tasks/${taskId}/status`, { status });
      setTasks((current) => current.map((task) => (task._id === taskId ? res.data : task)));
      setMessage("Task status updated");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task status");
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((current) => current.filter((task) => task._id !== taskId));
      setMessage("Task deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task");
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Assignment board</span>
          <h1>Tasks</h1>
        </div>
        <button className="secondary-button" onClick={loadData} type="button">
          Refresh
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      <div className="content-grid">
        {isAdmin && (
          <form className="panel form-panel" onSubmit={handleSubmit}>
            <h2>Create task</h2>

            <label>
              Title
              <input name="title" value={form.title} onChange={handleChange} required minLength="3" />
            </label>

            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
            </label>

            <label>
              Project
              <select name="project" value={form.project} onChange={handleChange} required>
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
            </label>

            <label>
              Assign to
              <select name="assignedTo" value={form.assignedTo} onChange={handleChange} required>
                <option value="">Select member</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </label>

            <div className="two-fields">
              <label>
                Priority
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>

              <label>
                Due date
                <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
              </label>
            </div>

            <button className="primary-button" type="submit">Assign task</button>
          </form>
        )}

        <section className="panel wide-panel">
          <div className="panel-heading">
            <h2>Task board</h2>
            <span>{visibleTasks.length} shown</span>
          </div>

          <div className="filters">
            <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <select value={filters.project} onChange={(event) => setFilters({ ...filters, project: event.target.value })}>
              <option value="all">All projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div className="task-grid">
            {visibleTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={isAdmin ? handleDelete : null}
                onStatusChange={handleStatusChange}
              />
            ))}

            {!visibleTasks.length && <div className="empty-state">No tasks match the current filters.</div>}
          </div>
        </section>
      </div>
    </section>
  );
}

export default Tasks;
