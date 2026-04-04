import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

const demoAccounts = [
  { role: "Admin", email: "admin@companyx.com", password: "Admin@123" },
  { role: "Analyst", email: "analyst@companyx.com", password: "Analyst@123" },
  { role: "Viewer", email: "viewer@companyx.com", password: "Viewer@123" },
];

export function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [password, setPassword] = useState(demoAccounts[0].password);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-panel">
        <div>
          <p className="eyebrow">Finance Dashboard</p>
          <h1>Role-aware finance operations, ready for review.</h1>
          <p className="hero-copy">
            Use the seeded accounts to test admin controls, analyst visibility, and viewer-only access.
          </p>
        </div>

        <div className="demo-grid">
          {demoAccounts.map((account) => (
            <button
              key={account.role}
              type="button"
              className="demo-card"
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
              }}
            >
              <span>{account.role}</span>
              <strong>{account.email}</strong>
            </button>
          ))}
        </div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Access dashboard"}
        </button>
      </form>
    </div>
  );
}
