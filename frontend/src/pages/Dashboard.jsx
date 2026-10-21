import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <button
        className="menu-btn"
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <aside className={menuOpen ? "dashboard-sidebar active" : "dashboard-sidebar"}>
        {/* Profile */}
        <div className="sidebar-profile">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
            alt="Tutor avatar"
            className="sidebar-avatar"
          />
          <h3>{user?.name || "Tutor"}</h3>
          <p>{user?.subject ? `${user.subject} Tutor` : "Tutor Panel"}</p>
        </div>

        {/* Links */}
        <NavLink to="/dashboard" end className="dashboard-link" onClick={closeMenu}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/dashboard/students" className="dashboard-link" onClick={closeMenu}>
          🎓 Students
        </NavLink>

        <NavLink to="/dashboard/attendance" className="dashboard-link" onClick={closeMenu}>
          📅 Attendance
        </NavLink>

        <NavLink to="/dashboard/profile" className="dashboard-link" onClick={closeMenu}>
          👤 Profile
        </NavLink>

        <NavLink to="/dashboard/settings" className="dashboard-link" onClick={closeMenu}>
          ⚙ Settings
        </NavLink>

        {/* Logout */}
        <button className="logout-sidebar-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      

      {/* Main Content */}

      <main className="dashboard-content">

        <Outlet />

      </main>

    </div>
  );
}

export default Dashboard;
