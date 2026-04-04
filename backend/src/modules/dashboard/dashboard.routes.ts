import { Router } from "express";

import { USER_ROLES } from "../../constants/roles";
import { requireRole } from "../../middleware/require-role.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { dashboardController } from "./dashboard.controller";

export const dashboardRoutes = Router();

dashboardRoutes.use(requireRole(USER_ROLES.VIEWER, USER_ROLES.ANALYST, USER_ROLES.ADMIN));

dashboardRoutes.get("/summary", asyncHandler(dashboardController.getSummary));
dashboardRoutes.get(
  "/category-breakdown",
  asyncHandler(dashboardController.getCategoryBreakdown),
);
dashboardRoutes.get("/recent-activity", asyncHandler(dashboardController.getRecentActivity));
dashboardRoutes.get("/trends", asyncHandler(dashboardController.getTrends));
