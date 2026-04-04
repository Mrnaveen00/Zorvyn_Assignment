import { useEffect, useState } from "react";

import { financeApi } from "../api/financeApi";
import { useAuth } from "../auth/AuthContext";
import { EmptyState } from "../components/EmptyState";
import { SectionCard } from "../components/SectionCard";
import type { User, UserRole, UserStatus } from "../types";

const initialUserForm = {
  name: "",
  email: "",
  password: "",
  role: "VIEWER" as UserRole,
  status: "ACTIVE" as UserStatus,
};

export function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(initialUserForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadUsers() {
    if (!token) return;

    try {
      const result = await financeApi.getUsers(token);
      setUsers(result.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    }
  }

  useEffect(() => {
    void loadUsers();
  }, [token]);

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      await financeApi.createUser(token, form);
      setForm(initialUserForm);
      setMessage("User created successfully.");
      setError("");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    }
  }

  async function toggleStatus(user: User) {
    if (!token) return;

    try {
      await financeApi.updateUserStatus(
        token,
        user.id,
        user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      );
      setMessage("User status updated.");
      setError("");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user status");
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>User access control</h1>
          <p className="page-copy">
            Provision accounts, assign roles, and manage whether users can access the system.
          </p>
        </div>
      </div>

      <SectionCard title="Create user" subtitle="Provision a new account with a predefined role">
        <form className="record-form user-form" onSubmit={handleCreateUser}>
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
          />
          <select
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({ ...current, role: event.target.value as UserRole }))
            }
          >
            <option value="VIEWER">Viewer</option>
            <option value="ANALYST">Analyst</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value as UserStatus }))
            }
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button className="primary-button" type="submit">
            Create user
          </button>
        </form>
      </SectionCard>

      {message ? <p className="success-text">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <SectionCard title="Current users" subtitle="Role and status overview across the system">
        {users.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`pill pill-${user.status.toLowerCase()}`}>{user.status}</span>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <button className="text-button" onClick={() => void toggleStatus(user)}>
                        {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No users available" description="Create a user to begin." />
        )}
      </SectionCard>
    </div>
  );
}
