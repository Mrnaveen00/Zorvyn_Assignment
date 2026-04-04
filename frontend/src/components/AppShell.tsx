import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Finance Command</p>
          <h1>Company X</h1>
          <p className="sidebar-copy">
            Role-aware dashboard for finance records, operational visibility, and controlled access.
          </p>
        </div>

        <nav className="nav-list">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          {user?.role !== "VIEWER" && (
            <NavLink to="/records" className="nav-link">
              Records
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/users" className="nav-link">
              Users
            </NavLink>
          )}
        </nav>

        <div className="profile-card">
          <p className="profile-name">{user?.name}</p>
          <p className="profile-meta">{user?.email}</p>
          <p className="profile-role">{user?.role}</p>
          <button className="secondary-button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
