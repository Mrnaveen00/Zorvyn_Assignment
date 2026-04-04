import { Router } from "express";

import { USER_ROLES } from "../../constants/roles";
import { requireRole } from "../../middleware/require-role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { usersController } from "./users.controller";
import {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from "./users.validation";

export const userRoutes = Router();

userRoutes.use(requireRole(USER_ROLES.ADMIN));

userRoutes.post("/", validate(createUserSchema), asyncHandler(usersController.createUser));
userRoutes.get("/", asyncHandler(usersController.listUsers));
userRoutes.get("/:id", asyncHandler(usersController.getUserById));
userRoutes.patch("/:id", validate(updateUserSchema), asyncHandler(usersController.updateUser));
userRoutes.patch(
  "/:id/status",
  validate(updateUserStatusSchema),
  asyncHandler(usersController.updateUserStatus),
);
userRoutes.delete("/:id", asyncHandler(usersController.deleteUser));
