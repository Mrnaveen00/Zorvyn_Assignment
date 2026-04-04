import { useEffect, useState } from "react";

import { financeApi } from "../api/financeApi";
import { useAuth } from "../auth/AuthContext";
import { EmptyState } from "../components/EmptyState";
import { SectionCard } from "../components/SectionCard";
import type { FinancialRecord, RecordType } from "../types";
import { formatCurrency, formatDate } from "../utils/format";

const initialForm = {
  amount: "",
  type: "EXPENSE",
  category: "",
  recordDate: "",
  notes: "",
};

export function RecordsPage() {
  const { token, user } = useAuth();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [filters, setFilters] = useState({ type: "", category: "", search: "" });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [form, setForm] = useState(initialForm);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isAdmin = user?.role === "ADMIN";

  async function loadRecords(page = 1) {
    if (!token) return;

    try {
      const result = await financeApi.getRecords(token, {
        page,
        limit: 10,
        type: filters.type || undefined,
        category: filters.category || undefined,
        search: filters.search || undefined,
      });
      setRecords(result.records);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load records");
    }
  }

  useEffect(() => {
    void loadRecords(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleFilterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    await loadRecords(1);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !isAdmin) return;

    setError("");
    setMessage("");

    try {
      const payload = {
        amount: Number(form.amount),
        type: form.type as RecordType,
        category: form.category,
        recordDate: form.recordDate,
        notes: form.notes || undefined,
      };

      if (editingRecordId) {
        await financeApi.updateRecord(token, editingRecordId, payload);
        setMessage("Record updated successfully.");
      } else {
        await financeApi.createRecord(token, payload);
        setMessage("Record created successfully.");
      }

      setForm(initialForm);
      setEditingRecordId(null);
      await loadRecords(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save record");
    }
  }

  async function handleDelete(recordId: string) {
    if (!token || !isAdmin) return;

    try {
      await financeApi.deleteRecord(token, recordId);
      setMessage("Record deleted successfully.");
      await loadRecords(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete record");
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Records</p>
          <h1>Financial records</h1>
          <p className="page-copy">
            Analysts can inspect and filter the ledger. Admins can also create, update, and delete entries.
          </p>
        </div>
      </div>

      <SectionCard title="Filters" subtitle="Narrow results by type, category, or keywords">
        <form className="inline-form" onSubmit={handleFilterSubmit}>
          <select
            value={filters.type}
            onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
          >
            <option value="">All types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <input
            placeholder="Category"
            value={filters.category}
            onChange={(event) =>
              setFilters((current) => ({ ...current, category: event.target.value }))
            }
          />
          <input
            placeholder="Search notes"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, search: event.target.value }))
            }
          />
          <button className="primary-button" type="submit">
            Apply filters
          </button>
        </form>
      </SectionCard>

      {isAdmin ? (
        <SectionCard
          title={editingRecordId ? "Edit record" : "Create record"}
          subtitle="Admins manage the organization finance dataset here"
        >
          <form className="record-form" onSubmit={handleSubmit}>
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            />
            <select
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
            <input
              placeholder="Category"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
            />
            <input
              type="date"
              value={form.recordDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, recordDate: event.target.value }))
              }
            />
            <input
              placeholder="Notes"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            />
            <div className="button-row">
              <button className="primary-button" type="submit">
                {editingRecordId ? "Save changes" : "Create record"}
              </button>
              {editingRecordId ? (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setEditingRecordId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </SectionCard>
      ) : null}

      {message ? <p className="success-text">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <SectionCard
        title="Record list"
        subtitle={`Showing page ${pagination.page} of ${Math.max(pagination.totalPages, 1)}`}
      >
        {records.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  <th>Created by</th>
                  {isAdmin ? <th>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.recordDate)}</td>
                    <td>{record.category}</td>
                    <td>
                      <span className={`pill pill-${record.type.toLowerCase()}`}>{record.type}</span>
                    </td>
                    <td>{formatCurrency(record.amount)}</td>
                    <td>{record.notes || "-"}</td>
                    <td>{record.createdBy?.name ?? "System"}</td>
                    {isAdmin ? (
                      <td className="table-actions">
                        <button
                          className="text-button"
                          onClick={() => {
                            setEditingRecordId(record.id);
                            setForm({
                              amount: String(record.amount),
                              type: record.type,
                              category: record.category,
                              recordDate: record.recordDate.slice(0, 10),
                              notes: record.notes ?? "",
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-button text-danger"
                          onClick={() => void handleDelete(record.id)}
                        >
                          Delete
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No records found" description="Try adjusting your filters." />
        )}

        <div className="pagination">
          <button
            className="secondary-button"
            onClick={() => void loadRecords(Math.max(1, pagination.page - 1))}
            disabled={pagination.page <= 1}
          >
            Previous
          </button>
          <span>
            {pagination.page} / {Math.max(pagination.totalPages, 1)}
          </span>
          <button
            className="secondary-button"
            onClick={() => void loadRecords(Math.min(Math.max(pagination.totalPages, 1), pagination.page + 1))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
