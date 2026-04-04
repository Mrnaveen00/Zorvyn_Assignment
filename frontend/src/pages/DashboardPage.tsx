import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { financeApi } from "../api/financeApi";
import { useAuth } from "../auth/AuthContext";
import { EmptyState } from "../components/EmptyState";
import { SectionCard } from "../components/SectionCard";
import { StatCard } from "../components/StatCard";
import type { CategoryBreakdownItem, DashboardSummary, TrendItem } from "../types";
import { formatCurrency, formatDate } from "../utils/format";

export function DashboardPage() {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdownItem[]>([]);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const currentToken = token;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [summaryResult, categoryResult, trendResult] = await Promise.all([
          financeApi.getSummary(currentToken),
          financeApi.getCategoryBreakdown(currentToken),
          financeApi.getTrends(currentToken, { granularity: "monthly" }),
        ]);

        setSummary(summaryResult);
        setCategories(categoryResult.categories);
        setTrends(trendResult.trends);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, [token]);

  if (isLoading) return <div className="page-shell">Loading dashboard...</div>;
  if (error) return <div className="page-shell error-text">{error}</div>;
  if (!summary) return <div className="page-shell">No dashboard data available.</div>;

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Finance dashboard</h1>
          <p className="page-copy">
            Welcome back, {user?.name}. This screen brings together the shared company dataset, recent activity, and high-level analytics.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total income" value={formatCurrency(summary.totalIncome)} tone="income" />
        <StatCard label="Total expenses" value={formatCurrency(summary.totalExpenses)} tone="expense" />
        <StatCard label="Net balance" value={formatCurrency(summary.netBalance)} tone="balance" />
        <StatCard label="Record count" value={String(summary.recordCount)} tone="neutral" />
      </div>

      <div className="content-grid">
        <SectionCard title="Monthly trends" subtitle="Income, expenses, and balance over time">
          {trends.length ? (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="period" stroke="#8ba3b8" />
                  <YAxis stroke="#8ba3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#49d17d" strokeWidth={3} />
                  <Line type="monotone" dataKey="expenses" stroke="#ff8c69" strokeWidth={3} />
                  <Line type="monotone" dataKey="netBalance" stroke="#77b7ff" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No trend data" description="Add records to populate the chart." />
          )}
        </SectionCard>

        <SectionCard title="Category totals" subtitle="Grouped totals by category and type">
          {categories.length ? (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="category" stroke="#8ba3b8" />
                  <YAxis stroke="#8ba3b8" />
                  <Tooltip />
                  <Bar dataKey="totalAmount" fill="#d6b25e" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No category data" description="Category breakdown will appear here." />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Recent activity" subtitle="Latest finance entries in the system">
        {summary.recentActivity.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Created by</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentActivity.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.recordDate)}</td>
                    <td>{record.category}</td>
                    <td>
                      <span className={`pill pill-${record.type.toLowerCase()}`}>{record.type}</span>
                    </td>
                    <td>{formatCurrency(record.amount)}</td>
                    <td>{record.createdBy?.name ?? "System"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No recent activity" description="Recent records will appear here." />
        )}
      </SectionCard>
    </div>
  );
}
