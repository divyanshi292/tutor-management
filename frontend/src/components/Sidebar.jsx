import { NavLink } from "react-router-dom";

function Sidebar({ user, menuOpen, onClose, onLogout }) {
  return (
    <aside
      className={menuOpen ? "dashboard-sidebar active" : "dashboard-sidebar"}
      aria-label="Tutor navigation sidebar"
    >
      {/* Profile summary */}
      <div className="sidebar-profile">
        <img
          src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
          alt={user?.name ? `${user.name} avatar` : "Tutor avatar"}
          className="sidebar-avatar"
        />
        <h3>{user?.name || "Tutor"}</h3>
        <p>{user?.subject ? `${user.subject} Tutor` : "Tutor Panel"}</p>
      </div>

      {/* Navigation links */}
      <nav className="sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <NavLink
          to="/dashboard"
          end
          className="dashboard-link"
          onClick={onClose}
        >
          <span aria-hidden="true">📊</span> Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/students"
          className="dashboard-link"
          onClick={onClose}
        >
          <span aria-hidden="true">🎓</span> Students
        </NavLink>

        <NavLink
          to="/dashboard/attendance"
          className="dashboard-link"
          onClick={onClose}
        >
          <span aria-hidden="true">📅</span> Attendance
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className="dashboard-link"
          onClick={onClose}
        >
          <span aria-hidden="true">👤</span> Profile
        </NavLink>

        <NavLink
          to="/dashboard/settings"
          className="dashboard-link"
          onClick={onClose}
        >
          <span aria-hidden="true">⚙</span> Settings
        </NavLink>
      </nav>

      {/* Logout button */}
      <button
        type="button"
        className="logout-sidebar-btn"
        onClick={onLogout}
        style={{ marginTop: "auto" }}
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
