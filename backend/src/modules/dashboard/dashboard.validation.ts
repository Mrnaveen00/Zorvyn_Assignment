import { z } from "zod";

export const dashboardQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(5).optional(),
});

export const trendQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  granularity: z.enum(["monthly", "weekly"]).default("monthly"),
});
