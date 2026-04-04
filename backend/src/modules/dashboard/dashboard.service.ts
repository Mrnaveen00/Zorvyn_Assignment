import { Prisma, RecordType } from "@prisma/client";

import { prisma } from "../../config/database";

type DashboardQuery = {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
};

type TrendQuery = {
  startDate?: Date;
  endDate?: Date;
  granularity: "monthly" | "weekly";
};

const buildDateWhere = (query: { startDate?: Date; endDate?: Date }): Prisma.FinancialRecordWhereInput =>
  query.startDate || query.endDate
    ? {
        recordDate: {
          ...(query.startDate ? { gte: query.startDate } : {}),
          ...(query.endDate ? { lte: query.endDate } : {}),
        },
      }
    : {};

export const dashboardService = {
  async getSummary(query: DashboardQuery) {
    const where = buildDateWhere(query);

    const [incomeAgg, expenseAgg, recentActivity, recordCount] = await Promise.all([
      prisma.financialRecord.aggregate({
        where: {
          ...where,
          type: RecordType.INCOME,
        },
        _sum: { amount: true },
      }),
      prisma.financialRecord.aggregate({
        where: {
          ...where,
          type: RecordType.EXPENSE,
        },
        _sum: { amount: true },
      }),
      prisma.financialRecord.findMany({
        where,
        orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
        take: query.limit ?? 5,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.financialRecord.count({ where }),
    ]);

    const totalIncome = Number(incomeAgg._sum.amount ?? 0);
    const totalExpenses = Number(expenseAgg._sum.amount ?? 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      recordCount,
      recentActivity: recentActivity.map((record) => ({
        id: record.id,
        amount: Number(record.amount),
        type: record.type,
        category: record.category,
        recordDate: record.recordDate.toISOString(),
        notes: record.notes,
        createdAt: record.createdAt.toISOString(),
        createdBy: record.createdBy,
      })),
    };
  },

  async getCategoryBreakdown(query: DashboardQuery) {
    const where = buildDateWhere(query);

    const grouped = await prisma.financialRecord.groupBy({
      by: ["category", "type"],
      where,
      _sum: {
        amount: true,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    return grouped.map((item) => ({
      category: item.category,
      type: item.type,
      totalAmount: Number(item._sum.amount ?? 0),
      recordCount: item._count._all,
    }));
  },

  async getRecentActivity(query: DashboardQuery) {
    const where = buildDateWhere(query);

    const records = await prisma.financialRecord.findMany({
      where,
      orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
      take: query.limit ?? 5,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return records.map((record) => ({
      id: record.id,
      amount: Number(record.amount),
      type: record.type,
      category: record.category,
      recordDate: record.recordDate.toISOString(),
      notes: record.notes,
      createdAt: record.createdAt.toISOString(),
      createdBy: record.createdBy,
    }));
  },

  async getTrends(query: TrendQuery) {
    const where = buildDateWhere(query);
    const records = await prisma.financialRecord.findMany({
      where,
      orderBy: {
        recordDate: "asc",
      },
      select: {
        amount: true,
        type: true,
        recordDate: true,
      },
    });

    const formatter =
      query.granularity === "weekly"
        ? (date: Date) => {
            const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
            const day = current.getUTCDay() || 7;
            current.setUTCDate(current.getUTCDate() + 1 - day);
            return current.toISOString().slice(0, 10);
          }
        : (date: Date) => date.toISOString().slice(0, 7);

    const bucketMap = new Map<
      string,
      { period: string; income: number; expenses: number; netBalance: number }
    >();

    for (const record of records) {
      const period = formatter(record.recordDate);
      const entry = bucketMap.get(period) ?? {
        period,
        income: 0,
        expenses: 0,
        netBalance: 0,
      };

      const amount = Number(record.amount);

      if (record.type === RecordType.INCOME) {
        entry.income += amount;
      } else {
        entry.expenses += amount;
      }

      entry.netBalance = entry.income - entry.expenses;
      bucketMap.set(period, entry);
    }

    return Array.from(bucketMap.values());
  },
};
