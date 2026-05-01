import { useContext } from "react";
import { BrowserRouter, Navigate, Outlet, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContextContext";
import "./App.css";

function ProtectedLayout() {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <div className="screen-message">Loading workspace...</div>;
  if (!token) return <Navigate to="/" replace />;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
