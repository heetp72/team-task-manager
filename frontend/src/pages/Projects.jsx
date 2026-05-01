import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContextContext";

function Projects() {
  const { isAdmin } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", members: [] });
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    setError("");
    try {
      const [projectRes, userRes] = await Promise.all([API.get("/projects"), API.get("/users")]);
      setProjects(projectRes.data);
      setUsers(userRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load projects");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleMember = (userId) => {
    setForm((current) => ({
      ...current,
      members: current.members.includes(userId)
        ? current.members.filter((id) => id !== userId)
        : [...current.members, userId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      if (editingId) {
        const res = await API.put(`/projects/${editingId}`, form);
        setProjects((current) =>
          current.map((project) => (project._id === editingId ? res.data : project))
        );
        setMessage("Project updated successfully");
      } else {
        const res = await API.post("/projects", form);
        setProjects((current) => [res.data, ...current]);
        setMessage("Project created successfully");
      }

      setForm({ name: "", description: "", members: [] });
      setEditingId("");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save project");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setForm({
      name: project.name,
      description: project.description || "",
      members: project.members?.map((member) => member._id) || [],
    });
    setMessage("");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId("");
    setForm({ name: "", description: "", members: [] });
  };

  const deleteProject = async (projectId) => {
    const confirmed = window.confirm("Delete this project and all related tasks?");
    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await API.delete(`/projects/${projectId}`);
      setProjects((current) => current.filter((project) => project._id !== projectId));
      if (editingId === projectId) cancelEdit();
      setMessage("Project deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete project");
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Team management</span>
          <h1>Projects</h1>
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
            <div className="panel-heading">
              <h2>{editingId ? "Edit project" : "Create project"}</h2>
              {editingId && (
                <button className="ghost-button" onClick={cancelEdit} type="button">
                  Cancel
                </button>
              )}
            </div>
            <label>
              Project name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                minLength="3"
              />
            </label>
            <label>
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows="4"
              />
            </label>

            <div className="field-group">
              <span>Team members</span>
              <small className="field-help">
                Selected members can see this project. Assigning a task also adds that user automatically.
              </small>
              <div className="member-list">
                {users.map((user) => (
                  <label className="check-row" key={user._id}>
                    <input
                      type="checkbox"
                      checked={form.members.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                    />
                    <span>{user.name}</span>
                    <small>{user.role}</small>
                  </label>
                ))}
              </div>
            </div>

            <button className="primary-button" type="submit">
              {saving ? "Saving..." : editingId ? "Save changes" : "Create project"}
            </button>
          </form>
        )}

        <section className="panel wide-panel">
          <div className="panel-heading">
            <h2>Active projects</h2>
            <span>{projects.length} total</span>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project._id}>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description || "No project description added."}</p>
                </div>
                <div className="project-footer">
                  <span>Owner: {project.owner?.name}</span>
                  <span>{project.members?.length || 0} members</span>
                </div>
                <div className="avatar-row">
                  {project.members?.slice(0, 6).map((member) => (
                    <span key={member._id} title={member.name}>
                      {member.name.slice(0, 2).toUpperCase()}
                    </span>
                  ))}
                </div>
                {isAdmin && (
                  <div className="card-actions">
                    <button className="secondary-button" onClick={() => startEdit(project)} type="button">
                      Edit
                    </button>
                    <button className="danger-button" onClick={() => deleteProject(project._id)} type="button">
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}

            {!projects.length && <div className="empty-state">No projects yet. Admins can create the first one.</div>}
          </div>
        </section>
      </div>
    </section>
  );
}

export default Projects;
