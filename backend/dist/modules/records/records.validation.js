"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRecordsQuerySchema = exports.updateRecordSchema = exports.createRecordSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const amountSchema = zod_1.z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(9999999999.99, "Amount is too large");
const recordDateSchema = zod_1.z.coerce.date({
    error: "A valid record date is required",
});
exports.createRecordSchema = zod_1.z.object({
    amount: amountSchema,
    type: zod_1.z.enum(client_1.RecordType),
    category: zod_1.z.string().trim().min(2, "Category must be at least 2 characters long"),
    recordDate: recordDateSchema,
    notes: zod_1.z.string().trim().max(500, "Notes must be at most 500 characters").optional(),
});
exports.updateRecordSchema = zod_1.z
    .object({
    amount: amountSchema.optional(),
    type: zod_1.z.enum(client_1.RecordType).optional(),
    category: zod_1.z
        .string()
        .trim()
        .min(2, "Category must be at least 2 characters long")
        .optional(),
    recordDate: recordDateSchema.optional(),
    notes: zod_1.z.string().trim().max(500, "Notes must be at most 500 characters").optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
exports.listRecordsQuerySchema = zod_1.z.object({
    type: zod_1.z.enum(client_1.RecordType).optional(),
    category: zod_1.z.string().trim().min(1).optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    search: zod_1.z.string().trim().min(1).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
//# sourceMappingURL=records.validation.js.map