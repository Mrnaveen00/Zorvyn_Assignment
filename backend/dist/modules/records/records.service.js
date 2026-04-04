"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordsService = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("../../config/database");
const api_error_1 = require("../../utils/api-error");
const recordInclude = {
    createdBy: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
    updatedBy: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};
const serializeRecord = (record) => ({
    ...record,
    amount: Number(record.amount),
    recordDate: record.recordDate.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
});
exports.recordsService = {
    async createRecord(payload, actorUserId) {
        const record = await database_1.prisma.financialRecord.create({
            data: {
                amount: new client_1.Prisma.Decimal(payload.amount),
                type: payload.type,
                category: payload.category,
                recordDate: payload.recordDate,
                notes: payload.notes,
                createdById: actorUserId,
                updatedById: actorUserId,
            },
            include: recordInclude,
        });
        return serializeRecord(record);
    },
    async listRecords(query) {
        const where = {
            type: query.type,
            ...(query.category
                ? {
                    category: {
                        contains: query.category,
                        mode: "insensitive",
                    },
                }
                : {}),
            ...(query.search
                ? {
                    OR: [
                        {
                            category: {
                                contains: query.search,
                                mode: "insensitive",
                            },
                        },
                        {
                            notes: {
                                contains: query.search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),
            ...(query.startDate || query.endDate
                ? {
                    recordDate: {
                        ...(query.startDate ? { gte: query.startDate } : {}),
                        ...(query.endDate ? { lte: query.endDate } : {}),
                    },
                }
                : {}),
        };
        const skip = (query.page - 1) * query.limit;
        const [records, total] = await Promise.all([
            database_1.prisma.financialRecord.findMany({
                where,
                include: recordInclude,
                orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
                skip,
                take: query.limit,
            }),
            database_1.prisma.financialRecord.count({ where }),
        ]);
        return {
            records: records.map(serializeRecord),
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit),
            },
        };
    },
    async getRecordById(recordId) {
        const record = await database_1.prisma.financialRecord.findUnique({
            where: { id: recordId },
            include: recordInclude,
        });
        if (!record) {
            throw new api_error_1.ApiError(404, "Financial record not found");
        }
        return serializeRecord(record);
    },
    async updateRecord(recordId, payload, actorUserId) {
        const existingRecord = await database_1.prisma.financialRecord.findUnique({
            where: { id: recordId },
            select: { id: true },
        });
        if (!existingRecord) {
            throw new api_error_1.ApiError(404, "Financial record not found");
        }
        const record = await database_1.prisma.financialRecord.update({
            where: { id: recordId },
            data: {
                ...(payload.amount !== undefined ? { amount: new client_1.Prisma.Decimal(payload.amount) } : {}),
                ...(payload.type !== undefined ? { type: payload.type } : {}),
                ...(payload.category !== undefined ? { category: payload.category } : {}),
                ...(payload.recordDate !== undefined ? { recordDate: payload.recordDate } : {}),
                ...(payload.notes !== undefined ? { notes: payload.notes } : {}),
                updatedById: actorUserId,
            },
            include: recordInclude,
        });
        return serializeRecord(record);
    },
    async deleteRecord(recordId) {
        const existingRecord = await database_1.prisma.financialRecord.findUnique({
            where: { id: recordId },
            select: { id: true },
        });
        if (!existingRecord) {
            throw new api_error_1.ApiError(404, "Financial record not found");
        }
        await database_1.prisma.financialRecord.delete({
            where: { id: recordId },
        });
    },
};
//# sourceMappingURL=records.service.js.map