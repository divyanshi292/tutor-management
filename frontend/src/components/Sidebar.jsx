import { NavLink } from "react-router-dom";
import logoImage from "../assets/logo.png";
import tutorAvatar from "../assets/tutor-avatar.svg";

function Sidebar({ user, menuOpen, onClose, onLogout }) {
  return (
    <aside
      className={menuOpen ? "dashboard-sidebar active" : "dashboard-sidebar"}
      aria-label="Tutor navigation sidebar"
    >
      {/* Brand Header */}
      <div className="sidebar-brand-row">
        <img
          src={logoImage}
          alt="TutorDesk logo"
          className="sidebar-brand-logo"
        />
        <div>
          <h2 className="sidebar-brand-title">
            Tutor<span>Desk</span>
          </h2>
          <span className="sidebar-brand-subtitle">Tutor Management</span>
        </div>
      </div>

      {/* Profile summary */}
      <div className="sidebar-profile">
        <img
          src={user?.avatar || tutorAvatar}
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
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
