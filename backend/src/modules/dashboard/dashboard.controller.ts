import type { Request, Response } from "express";

import { dashboardService } from "./dashboard.service";
import { dashboardQuerySchema, trendQuerySchema } from "./dashboard.validation";

export const dashboardController = {
  async getSummary(req: Request, res: Response) {
    const summary = await dashboardService.getSummary(dashboardQuerySchema.parse(req.query));

    res.status(200).json(summary);
  },

  async getCategoryBreakdown(req: Request, res: Response) {
    const breakdown = await dashboardService.getCategoryBreakdown(
      dashboardQuerySchema.parse(req.query),
    );

    res.status(200).json({
      categories: breakdown,
    });
  },

  async getRecentActivity(req: Request, res: Response) {
    const recentActivity = await dashboardService.getRecentActivity(
      dashboardQuerySchema.parse(req.query),
    );

    res.status(200).json({
      recentActivity,
    });
  },

  async getTrends(req: Request, res: Response) {
    const trends = await dashboardService.getTrends(trendQuerySchema.parse(req.query));

    res.status(200).json({
      trends,
    });
  },
};
