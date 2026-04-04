"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trendQuerySchema = exports.dashboardQuerySchema = void 0;
const zod_1 = require("zod");
exports.dashboardQuerySchema = zod_1.z.object({
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(20).default(5).optional(),
});
exports.trendQuerySchema = zod_1.z.object({
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    granularity: zod_1.z.enum(["monthly", "weekly"]).default("monthly"),
});
//# sourceMappingURL=dashboard.validation.js.map