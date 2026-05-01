import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContextContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", data);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reach the backend. Check that the API is running on http://localhost:4000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="eyebrow">Start workspace</span>
          <h1>Create your team account</h1>
          <p>Use Admin to create projects and assign tasks. Use Member to focus on assigned work and update status.</p>
        </div>

        <form className="auth-card" onSubmit={handleSignup}>
          <h2>Signup</h2>
          {error && <div className="alert error">{error}</div>}

          <label>
            Name
            <input name="name" value={data.name} onChange={handleChange} required minLength="2" />
          </label>

          <label>
            Email
            <input name="email" type="email" value={data.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input name="password" type="password" value={data.password} onChange={handleChange} required minLength="6" />
          </label>

          <label>
            Role
            <select name="role" value={data.role} onChange={handleChange}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create account"}
          </button>

          <p className="switch-link">
            Already registered? <Link to="/">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Signup;
