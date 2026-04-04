export type UserRole = "VIEWER" | "ANALYST" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type RecordType = "INCOME" | "EXPENSE";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type FinancialRecord = {
  id: string;
  amount: number;
  type: RecordType;
  category: string;
  recordDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type DashboardSummary = {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  recordCount: number;
  recentActivity: FinancialRecord[];
};

export type CategoryBreakdownItem = {
  category: string;
  type: RecordType;
  totalAmount: number;
  recordCount: number;
};

export type TrendItem = {
  period: string;
  income: number;
  expenses: number;
  netBalance: number;
};
