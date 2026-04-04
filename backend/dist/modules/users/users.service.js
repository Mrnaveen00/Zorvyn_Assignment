"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const database_1 = require("../../config/database");
const api_error_1 = require("../../utils/api-error");
const userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
};
exports.usersService = {
    async createUser(payload) {
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email: payload.email },
            select: { id: true },
        });
        if (existingUser) {
            throw new api_error_1.ApiError(409, "A user with this email already exists");
        }
        const passwordHash = await bcryptjs_1.default.hash(payload.password, 10);
        return database_1.prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                passwordHash,
                role: payload.role,
                status: payload.status ?? client_1.UserStatus.ACTIVE,
            },
            select: userSelect,
        });
    },
    async listUsers(query) {
        return database_1.prisma.user.findMany({
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
    async getUserById(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: userSelect,
        });
        if (!user) {
            throw new api_error_1.ApiError(404, "User not found");
        }
        return user;
    },
    async updateUser(userId, payload, actorUserId) {
        const existingUser = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true, status: true },
        });
        if (!existingUser) {
            throw new api_error_1.ApiError(404, "User not found");
        }
        if (existingUser.id === actorUserId && payload.status === client_1.UserStatus.INACTIVE) {
            throw new api_error_1.ApiError(400, "You cannot deactivate your own admin account");
        }
        return database_1.prisma.user.update({
            where: { id: userId },
            data: payload,
            select: userSelect,
        });
    },
    async updateUserStatus(userId, status, actorUserId) {
        return this.updateUser(userId, { status }, actorUserId);
    },
    async deleteUser(userId, actorUserId) {
        const existingUser = await database_1.prisma.user.findUnique({
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
            throw new api_error_1.ApiError(404, "User not found");
        }
        if (existingUser.id === actorUserId) {
            throw new api_error_1.ApiError(400, "You cannot delete your own account");
        }
        if (existingUser.role === client_1.UserRole.ADMIN &&
            (await database_1.prisma.user.count({
                where: { role: client_1.UserRole.ADMIN },
            })) === 1) {
            throw new api_error_1.ApiError(400, "At least one admin account must remain in the system");
        }
        if (existingUser._count.createdRecords > 0) {
            throw new api_error_1.ApiError(400, "This user cannot be deleted because they are linked to financial records");
        }
        await database_1.prisma.user.delete({
            where: { id: userId },
        });
    },
};
//# sourceMappingURL=users.service.js.map