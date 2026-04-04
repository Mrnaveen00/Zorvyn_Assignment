"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const database_1 = require("../../config/database");
const api_error_1 = require("../../utils/api-error");
exports.authService = {
    async login({ email, password }) {
        const user = await database_1.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            throw new api_error_1.ApiError(401, "Invalid email or password");
        }
        if (user.status !== "ACTIVE") {
            throw new api_error_1.ApiError(403, "Your account is inactive");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new api_error_1.ApiError(401, "Invalid email or password");
        }
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            role: user.role,
        }, env_1.env.jwtSecret, {
            subject: user.id,
            expiresIn: env_1.env.jwtExpiresIn,
        });
        return {
            token,
            user: this.serializeUser(user),
        };
    },
    async getCurrentUser(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new api_error_1.ApiError(404, "User not found");
        }
        if (user.status !== "ACTIVE") {
            throw new api_error_1.ApiError(403, "Your account is inactive");
        }
        return this.serializeUser(user);
    },
    serializeUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        };
    },
};
//# sourceMappingURL=auth.service.js.map