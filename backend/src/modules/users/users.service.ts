import bcrypt from "bcryptjs";
import { UserRole, UserStatus } from "@prisma/client";

import { prisma } from "../../config/database";
import { ApiError } from "../../utils/api-error";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
};

type UpdateUserInput = {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
};

type ListUsersQuery = {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
};

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const usersService = {
  async createUser(payload: CreateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ApiError(409, "A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    return prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash,
        role: payload.role,
        status: payload.status ?? UserStatus.ACTIVE,
      },
      select: userSelect,
    });
  },

  async listUsers(query: ListUsersQuery) {
    return prisma.user.findMany({
      where: {
        role: query.role,
        status: query.status,
        ...(query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: "insensitive" } },
                { email: { contains: query.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: userSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },

  async updateUser(userId: string, payload: UpdateUserInput, actorUserId: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true },
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    if (existingUser.id === actorUserId && payload.status === UserStatus.INACTIVE) {
      throw new ApiError(400, "You cannot deactivate your own admin account");
    }

    return prisma.user.update({
      where: { id: userId },
      data: payload,
      select: userSelect,
    });
  },

  async updateUserStatus(userId: string, status: UserStatus, actorUserId: string) {
    return this.updateUser(userId, { status }, actorUserId);
  },

  async deleteUser(userId: string, actorUserId: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        _count: {
          select: {
            createdRecords: true,
          },
        },
      },
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    if (existingUser.id === actorUserId) {
      throw new ApiError(400, "You cannot delete your own account");
    }

    if (
      existingUser.role === UserRole.ADMIN &&
      (await prisma.user.count({
        where: { role: UserRole.ADMIN },
      })) === 1
    ) {
      throw new ApiError(400, "At least one admin account must remain in the system");
    }

    if (existingUser._count.createdRecords > 0) {
      throw new ApiError(
        400,
        "This user cannot be deleted because they are linked to financial records",
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });
  },
};
