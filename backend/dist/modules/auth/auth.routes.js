"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const async_handler_1 = require("../../utils/async-handler");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post("/login", (0, validate_middleware_1.validate)(auth_validation_1.loginSchema), (0, async_handler_1.asyncHandler)(auth_controller_1.authController.login));
exports.authRoutes.get("/me", auth_middleware_1.authenticate, (0, async_handler_1.asyncHandler)(auth_controller_1.authController.me));
//# sourceMappingURL=auth.routes.js.map