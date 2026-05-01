import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [taskRes, projectRes] = await Promise.all([API.get("/tasks"), API.get("/projects")]);
      setTasks(taskRes.data);
      setProjects(projectRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "done").length;
    const inProgress = tasks.filter((task) => task.status === "in-progress").length;
    const pending = tasks.filter((task) => task.status === "pending").length;
    const overdue = tasks.filter((task) => task.status !== "done" && new Date(task.dueDate) < new Date()).length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

    return { completed, inProgress, pending, overdue, percent };
  }, [tasks]);

  const upcoming = [...tasks]
    .filter((task) => task.status !== "done")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  const handleStatusChange = async (taskId, status) => {
    setError("");

    try {
      const res = await API.patch(`/tasks/${taskId}/status`, { status });
      setTasks((current) => current.map((task) => (task._id === taskId ? res.data : task)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task status");
    }
  };

  if (loading) return <div className="screen-message">Loading dashboard...</div>;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Workspace overview</span>
          <h1>Dashboard</h1>
        </div>
        <button className="secondary-button" onClick={fetchDashboard}>Refresh</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total tasks</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="stat-card cyan">
          <span>In progress</span>
          <strong>{stats.inProgress}</strong>
        </div>
        <div className="stat-card amber">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="stat-card red">
          <span>Overdue</span>
          <strong>{stats.overdue}</strong>
        </div>
      </div>

      <div className="content-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Progress</h2>
            <strong>{stats.percent}% complete</strong>
          </div>
          <div className="progress-track">
            <div style={{ width: `${stats.percent}%` }} />
          </div>
          <div className="progress-split">
            <span>{stats.completed} done</span>
            <span>{projects.length} active projects</span>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Status mix</h2>
          </div>
          <div className="status-stack">
            <span style={{ flex: Math.max(stats.pending, 1) }} className="pending" />
            <span style={{ flex: Math.max(stats.inProgress, 1) }} className="in-progress" />
            <span style={{ flex: Math.max(stats.completed, 1) }} className="done" />
          </div>
          <div className="legend">
            <span>Pending</span>
            <span>In progress</span>
            <span>Done</span>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <h2>Upcoming tasks</h2>
          <span>{upcoming.length} shown</span>
        </div>
        <div className="task-grid">
          {upcoming.length ? (
            upcoming.map((task) => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
            ))
          ) : (
            <div className="empty-state">No open tasks. Create a project and start assigning work.</div>
          )}
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
