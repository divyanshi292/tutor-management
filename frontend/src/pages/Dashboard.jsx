import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components";
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
      <button
        className="menu-btn"
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <Sidebar
        user={user}
        menuOpen={menuOpen}
        onClose={closeMenu}
        onLogout={handleLogout}
      />
      

      {/* Main Content */}

      <main className="dashboard-content">

        <Outlet />

      </main>

    </div>
  );
}

export default Dashboard;
