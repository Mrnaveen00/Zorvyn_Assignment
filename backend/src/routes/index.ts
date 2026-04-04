import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { authRoutes } from "../modules/auth/auth.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { recordRoutes } from "../modules/records/records.routes";
import { userRoutes } from "../modules/users/users.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Finance dashboard backend is running",
  });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/dashboard", authenticate, dashboardRoutes);
apiRouter.use("/records", authenticate, recordRoutes);
apiRouter.use("/users", authenticate, userRoutes);
