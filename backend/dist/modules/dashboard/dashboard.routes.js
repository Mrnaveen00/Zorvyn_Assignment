"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const roles_1 = require("../../constants/roles");
const require_role_middleware_1 = require("../../middleware/require-role.middleware");
const async_handler_1 = require("../../utils/async-handler");
const dashboard_controller_1 = require("./dashboard.controller");
exports.dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes.use((0, require_role_middleware_1.requireRole)(roles_1.USER_ROLES.VIEWER, roles_1.USER_ROLES.ANALYST, roles_1.USER_ROLES.ADMIN));
exports.dashboardRoutes.get("/summary", (0, async_handler_1.asyncHandler)(dashboard_controller_1.dashboardController.getSummary));
exports.dashboardRoutes.get("/category-breakdown", (0, async_handler_1.asyncHandler)(dashboard_controller_1.dashboardController.getCategoryBreakdown));
exports.dashboardRoutes.get("/recent-activity", (0, async_handler_1.asyncHandler)(dashboard_controller_1.dashboardController.getRecentActivity));
exports.dashboardRoutes.get("/trends", (0, async_handler_1.asyncHandler)(dashboard_controller_1.dashboardController.getTrends));
//# sourceMappingURL=dashboard.routes.js.map