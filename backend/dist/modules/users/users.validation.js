"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersQuerySchema = exports.updateUserStatusSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Name must be at least 2 characters long"),
    email: zod_1.z.email("A valid email is required").transform((value) => value.toLowerCase()),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must be at most 64 characters long"),
    role: zod_1.z.enum(client_1.UserRole),
    status: zod_1.z.enum(client_1.UserStatus).optional(),
});
exports.updateUserSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(2, "Name must be at least 2 characters long").optional(),
    role: zod_1.z.enum(client_1.UserRole).optional(),
    status: zod_1.z.enum(client_1.UserStatus).optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
exports.updateUserStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(client_1.UserStatus),
});
exports.listUsersQuerySchema = zod_1.z.object({
    role: zod_1.z.enum(client_1.UserRole).optional(),
    status: zod_1.z.enum(client_1.UserStatus).optional(),
    search: zod_1.z.string().trim().min(1).optional(),
});
//# sourceMappingURL=users.validation.js.map