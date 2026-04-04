"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const roles_1 = require("../../constants/roles");
const require_role_middleware_1 = require("../../middleware/require-role.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const async_handler_1 = require("../../utils/async-handler");
const users_controller_1 = require("./users.controller");
const users_validation_1 = require("./users.validation");
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.use((0, require_role_middleware_1.requireRole)(roles_1.USER_ROLES.ADMIN));
exports.userRoutes.post("/", (0, validate_middleware_1.validate)(users_validation_1.createUserSchema), (0, async_handler_1.asyncHandler)(users_controller_1.usersController.createUser));
exports.userRoutes.get("/", (0, async_handler_1.asyncHandler)(users_controller_1.usersController.listUsers));
exports.userRoutes.get("/:id", (0, async_handler_1.asyncHandler)(users_controller_1.usersController.getUserById));
exports.userRoutes.patch("/:id", (0, validate_middleware_1.validate)(users_validation_1.updateUserSchema), (0, async_handler_1.asyncHandler)(users_controller_1.usersController.updateUser));
exports.userRoutes.patch("/:id/status", (0, validate_middleware_1.validate)(users_validation_1.updateUserStatusSchema), (0, async_handler_1.asyncHandler)(users_controller_1.usersController.updateUserStatus));
exports.userRoutes.delete("/:id", (0, async_handler_1.asyncHandler)(users_controller_1.usersController.deleteUser));
//# sourceMappingURL=users.routes.js.map