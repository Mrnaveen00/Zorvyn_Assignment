import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.email("A valid email is required").transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long"),
  role: z.enum(UserRole),
  status: z.enum(UserStatus).optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long").optional(),
    role: z.enum(UserRole).optional(),
    status: z.enum(UserStatus).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const updateUserStatusSchema = z.object({
  status: z.enum(UserStatus),
});

export const listUsersQuerySchema = z.object({
  role: z.enum(UserRole).optional(),
  status: z.enum(UserStatus).optional(),
  search: z.string().trim().min(1).optional(),
});
