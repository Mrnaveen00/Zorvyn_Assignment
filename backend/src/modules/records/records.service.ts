import { Prisma, type RecordType } from "@prisma/client";

import { prisma } from "../../config/database";
import { ApiError } from "../../utils/api-error";

type CreateRecordInput = {
  amount: number;
  type: RecordType;
  category: string;
  recordDate: Date;
  notes?: string;
};

type UpdateRecordInput = Partial<CreateRecordInput>;

type ListRecordsQuery = {
  type?: RecordType;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page: number;
  limit: number;
};

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
} as const;

const serializeRecord = <
  T extends {
    amount: Prisma.Decimal;
    recordDate: Date;
    createdAt: Date;
    updatedAt: Date;
  },
>(
  record: T,
) => ({
  ...record,
  amount: Number(record.amount),
  recordDate: record.recordDate.toISOString(),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export const recordsService = {
  async createRecord(payload: CreateRecordInput, actorUserId: string) {
    const record = await prisma.financialRecord.create({
      data: {
        amount: new Prisma.Decimal(payload.amount),
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

  async listRecords(query: ListRecordsQuery) {
    const where: Prisma.FinancialRecordWhereInput = {
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
      prisma.financialRecord.findMany({
        where,
        include: recordInclude,
        orderBy: [{ recordDate: "desc" }, { createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.financialRecord.count({ where }),
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

  async getRecordById(recordId: string) {
    const record = await prisma.financialRecord.findUnique({
      where: { id: recordId },
      include: recordInclude,
    });

    if (!record) {
      throw new ApiError(404, "Financial record not found");
    }

    return serializeRecord(record);
  },

  async updateRecord(recordId: string, payload: UpdateRecordInput, actorUserId: string) {
    const existingRecord = await prisma.financialRecord.findUnique({
      where: { id: recordId },
      select: { id: true },
    });

    if (!existingRecord) {
      throw new ApiError(404, "Financial record not found");
    }

    const record = await prisma.financialRecord.update({
      where: { id: recordId },
      data: {
        ...(payload.amount !== undefined ? { amount: new Prisma.Decimal(payload.amount) } : {}),
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

  async deleteRecord(recordId: string) {
    const existingRecord = await prisma.financialRecord.findUnique({
      where: { id: recordId },
      select: { id: true },
    });

    if (!existingRecord) {
      throw new ApiError(404, "Financial record not found");
    }

    await prisma.financialRecord.delete({
      where: { id: recordId },
    });
  },
};
