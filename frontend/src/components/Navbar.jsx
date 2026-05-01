import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="topbar">
      <NavLink className="brand" to="/dashboard">
        <span className="brand-mark">TT</span>
        <span>Team Task Manager</span>
      </NavLink>

      <nav className="navlinks">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
      </nav>

      <div className="user-chip">
        <span>{user?.name}</span>
        <strong>{user?.role}</strong>
        <button className="ghost-button" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;
