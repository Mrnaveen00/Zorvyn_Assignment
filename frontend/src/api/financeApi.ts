import type {
  AuthResponse,
  CategoryBreakdownItem,
  DashboardSummary,
  FinancialRecord,
  TrendItem,
  User,
} from "../types";
import { apiRequest } from "./client";

type RecordQuery = {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
};

type DashboardQuery = {
  startDate?: string;
  endDate?: string;
  limit?: number;
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export const financeApi = {
  login(email: string, password: string) {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  me(token: string) {
    return apiRequest<{ user: User }>("/auth/me", { token });
  },

  getUsers(token: string) {
    return apiRequest<{ users: User[] }>("/users", { token });
  },

  createUser(
    token: string,
    payload: { name: string; email: string; password: string; role: string; status: string },
  ) {
    return apiRequest<{ message: string; user: User }>("/users", {
      method: "POST",
      token,
      body: payload,
    });
  },

  updateUserStatus(token: string, userId: string, status: string) {
    return apiRequest<{ message: string; user: User }>(`/users/${userId}/status`, {
      method: "PATCH",
      token,
      body: { status },
    });
  },

  getRecords(token: string, params: RecordQuery) {
    return apiRequest<{
      records: FinancialRecord[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/records${buildQuery(params)}`, { token });
  },

  createRecord(
    token: string,
    payload: { amount: number; type: string; category: string; recordDate: string; notes?: string },
  ) {
    return apiRequest<{ message: string; record: FinancialRecord }>("/records", {
      method: "POST",
      token,
      body: payload,
    });
  },

  updateRecord(
    token: string,
    recordId: string,
    payload: Partial<{
      amount: number;
      type: string;
      category: string;
      recordDate: string;
      notes: string;
    }>,
  ) {
    return apiRequest<{ message: string; record: FinancialRecord }>(`/records/${recordId}`, {
      method: "PATCH",
      token,
      body: payload,
    });
  },

  deleteRecord(token: string, recordId: string) {
    return apiRequest<void>(`/records/${recordId}`, {
      method: "DELETE",
      token,
    });
  },

  getSummary(token: string, params: DashboardQuery = {}) {
    return apiRequest<DashboardSummary>(`/dashboard/summary${buildQuery(params)}`, { token });
  },

  getCategoryBreakdown(token: string, params: DashboardQuery = {}) {
    return apiRequest<{ categories: CategoryBreakdownItem[] }>(
      `/dashboard/category-breakdown${buildQuery(params)}`,
      { token },
    );
  },

  getTrends(token: string, params: DashboardQuery & { granularity?: "monthly" | "weekly" } = {}) {
    return apiRequest<{ trends: TrendItem[] }>(`/dashboard/trends${buildQuery(params)}`, {
      token,
    });
  },
};
