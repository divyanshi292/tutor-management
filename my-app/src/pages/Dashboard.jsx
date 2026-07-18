import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard({ students }) {
  const [menuOpen, setMenuOpen] =
  useState(false);

    const navigate = useNavigate();
    const handleLogout = () => {

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      window.location.reload();
   };


  return (
    <div className="dashboard-page">

      {/* Sidebar */}

      <button
  className="menu-btn"
  onClick={() =>
    setMenuOpen(!menuOpen)
  }
>
  ☰
</button>

      <aside
  className={
    menuOpen
      ? "dashboard-sidebar active"
      : "dashboard-sidebar"
  }
>

  {/* Profile */}

  <div className="sidebar-profile">

    <img
      src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
      alt="Tutor"
      className="sidebar-avatar"
    />

    <h3>Divyanshi</h3>

    <p>Tutor Panel</p>

  </div>

  {/* Links */}

  <NavLink
  to="/dashboard"
  className="dashboard-link"
>
  📊 Dashboard
</NavLink>

<NavLink
  to="/dashboard/students"
  className="dashboard-link"
>
  🎓 Students
</NavLink>

<NavLink
  to="/dashboard/attendance"
  className="dashboard-link"
>
  📅 Attendance
</NavLink>

<NavLink
  to="/dashboard/profile"
  className="dashboard-link"
>
  👤 Profile
</NavLink>

<NavLink
  to="/dashboard/settings"
  className="dashboard-link"
>
  ⚙ Settings
</NavLink>

  {/* Logout */}

  <button
    className="logout-sidebar-btn"
    onClick={handleLogout}
  >
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