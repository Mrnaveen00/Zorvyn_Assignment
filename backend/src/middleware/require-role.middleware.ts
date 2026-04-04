import type { NextFunction, Request, Response } from "express";

import type { UserRole } from "../constants/roles";
import { ApiError } from "../utils/api-error";

export const requireRole =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const currentUserRole = req.authUser?.role;

    if (!currentUserRole) {
      next(new ApiError(401, "Authentication is required"));
      return;
    }

    if (!allowedRoles.includes(currentUserRole)) {
      next(new ApiError(403, "You do not have permission to perform this action"));
      return;
    }

    next();
  };
