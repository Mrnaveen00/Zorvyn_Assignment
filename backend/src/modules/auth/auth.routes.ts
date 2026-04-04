import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { authController } from "./auth.controller";
import { loginSchema } from "./auth.validation";

export const authRoutes = Router();

authRoutes.post("/login", validate(loginSchema), asyncHandler(authController.login));
authRoutes.get("/me", authenticate, asyncHandler(authController.me));
