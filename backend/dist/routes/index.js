"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_routes_1 = require("../modules/auth/auth.routes");
const dashboard_routes_1 = require("../modules/dashboard/dashboard.routes");
const records_routes_1 = require("../modules/records/records.routes");
const users_routes_1 = require("../modules/users/users.routes");
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Finance dashboard backend is running",
    });
});
exports.apiRouter.use("/auth", auth_routes_1.authRoutes);
exports.apiRouter.use("/dashboard", auth_middleware_1.authenticate, dashboard_routes_1.dashboardRoutes);
exports.apiRouter.use("/records", auth_middleware_1.authenticate, records_routes_1.recordRoutes);
exports.apiRouter.use("/users", auth_middleware_1.authenticate, users_routes_1.userRoutes);
//# sourceMappingURL=index.js.map