"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("../../config/database");
const buildDateWhere = (query) => query.startDate || query.endDate
    ? {
        recordDate: {
            ...(query.startDate ? { gte: query.startDate } : {}),
            ...(query.endDate ? { lte: query.endDate } : {}),
        },
    }
    : {};
exports.dashboardService = {
    async getSummary(query) {
        const where = buildDateWhere(query);
        const [incomeAgg, expenseAgg, recentActivity, recordCount] = await Promise.all([
            database_1.prisma.financialRecord.aggregate({
                where: {
                    ...where,
                    type: client_1.RecordType.INCOME,
                },
                _sum: { amount: true },
            }),
            database_1.prisma.financialRecord.aggregate({
                where: {
                    ...where,
                    type: client_1.RecordType.EXPENSE,
                },
                _sum: { amount: true },
            }),
            database_1.prisma.financialRecord.findMany({
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
            database_1.prisma.financialRecord.count({ where }),
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
    async getCategoryBreakdown(query) {
        const where = buildDateWhere(query);
        const grouped = await database_1.prisma.financialRecord.groupBy({
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
    async getRecentActivity(query) {
        const where = buildDateWhere(query);
        const records = await database_1.prisma.financialRecord.findMany({
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
    async getTrends(query) {
        const where = buildDateWhere(query);
        const records = await database_1.prisma.financialRecord.findMany({
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
        const formatter = query.granularity === "weekly"
            ? (date) => {
                const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
                const day = current.getUTCDay() || 7;
                current.setUTCDate(current.getUTCDate() + 1 - day);
                return current.toISOString().slice(0, 10);
            }
            : (date) => date.toISOString().slice(0, 7);
        const bucketMap = new Map();
        for (const record of records) {
            const period = formatter(record.recordDate);
            const entry = bucketMap.get(period) ?? {
                period,
                income: 0,
                expenses: 0,
                netBalance: 0,
            };
            const amount = Number(record.amount);
            if (record.type === client_1.RecordType.INCOME) {
                entry.income += amount;
            }
            else {
                entry.expenses += amount;
            }
            entry.netBalance = entry.income - entry.expenses;
            bucketMap.set(period, entry);
        }
        return Array.from(bucketMap.values());
    },
};
//# sourceMappingURL=dashboard.service.js.map