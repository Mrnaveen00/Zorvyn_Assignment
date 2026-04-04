"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const api_error_1 = require("../../utils/api-error");
const users_service_1 = require("./users.service");
const users_validation_1 = require("./users.validation");
exports.usersController = {
    async createUser(req, res) {
        const user = await users_service_1.usersService.createUser(req.body);
        res.status(201).json({
            message: "User created successfully",
            user,
        });
    },
    async listUsers(req, res) {
        const users = await users_service_1.usersService.listUsers(users_validation_1.listUsersQuerySchema.parse(req.query));
        res.status(200).json({
            users,
        });
    },
    async getUserById(req, res) {
        const user = await users_service_1.usersService.getUserById(String(req.params.id));
        res.status(200).json({
            user,
        });
    },
    async updateUser(req, res) {
        const actorUserId = req.authUser?.id;
        if (!actorUserId) {
            throw new api_error_1.ApiError(401, "Authentication is required");
        }
        const user = await users_service_1.usersService.updateUser(String(req.params.id), req.body, actorUserId);
        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    },
    async updateUserStatus(req, res) {
        const actorUserId = req.authUser?.id;
        if (!actorUserId) {
            throw new api_error_1.ApiError(401, "Authentication is required");
        }
        const user = await users_service_1.usersService.updateUserStatus(String(req.params.id), req.body.status, actorUserId);
        res.status(200).json({
            message: "User status updated successfully",
            user,
        });
    },
    async deleteUser(req, res) {
        const actorUserId = req.authUser?.id;
        if (!actorUserId) {
            throw new api_error_1.ApiError(401, "Authentication is required");
        }
        await users_service_1.usersService.deleteUser(String(req.params.id), actorUserId);
        res.status(204).send();
    },
};
//# sourceMappingURL=users.controller.js.map