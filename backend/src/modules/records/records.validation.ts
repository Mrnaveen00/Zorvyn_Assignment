import { RecordType } from "@prisma/client";
import { z } from "zod";

const amountSchema = z.coerce
  .number()
  .positive("Amount must be greater than 0")
  .max(9999999999.99, "Amount is too large");

const recordDateSchema = z.coerce.date({
  error: "A valid record date is required",
});

export const createRecordSchema = z.object({
  amount: amountSchema,
  type: z.enum(RecordType),
  category: z.string().trim().min(2, "Category must be at least 2 characters long"),
  recordDate: recordDateSchema,
  notes: z.string().trim().max(500, "Notes must be at most 500 characters").optional(),
});

export const updateRecordSchema = z
  .object({
    amount: amountSchema.optional(),
    type: z.enum(RecordType).optional(),
    category: z
      .string()
      .trim()
      .min(2, "Category must be at least 2 characters long")
      .optional(),
    recordDate: recordDateSchema.optional(),
    notes: z.string().trim().max(500, "Notes must be at most 500 characters").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const listRecordsQuerySchema = z.object({
  type: z.enum(RecordType).optional(),
  category: z.string().trim().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
