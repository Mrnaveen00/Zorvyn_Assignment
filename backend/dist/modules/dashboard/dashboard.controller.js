"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const dashboard_validation_1 = require("./dashboard.validation");
exports.dashboardController = {
    async getSummary(req, res) {
        const summary = await dashboard_service_1.dashboardService.getSummary(dashboard_validation_1.dashboardQuerySchema.parse(req.query));
        res.status(200).json(summary);
    },
    async getCategoryBreakdown(req, res) {
        const breakdown = await dashboard_service_1.dashboardService.getCategoryBreakdown(dashboard_validation_1.dashboardQuerySchema.parse(req.query));
        res.status(200).json({
            categories: breakdown,
        });
    },
    async getRecentActivity(req, res) {
        const recentActivity = await dashboard_service_1.dashboardService.getRecentActivity(dashboard_validation_1.dashboardQuerySchema.parse(req.query));
        res.status(200).json({
            recentActivity,
        });
    },
    async getTrends(req, res) {
        const trends = await dashboard_service_1.dashboardService.getTrends(dashboard_validation_1.trendQuerySchema.parse(req.query));
        res.status(200).json({
            trends,
        });
    },
};
//# sourceMappingURL=dashboard.controller.js.map