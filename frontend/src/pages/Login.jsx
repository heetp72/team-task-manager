import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContextContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="eyebrow">Full-stack assignment</span>
          <h1>Team Task Manager</h1>
          <p>Create projects, assign work, track overdue tasks, and manage progress with Admin and Member roles.</p>
        </div>

        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <div className="alert error">{error}</div>}

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="switch-link">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
