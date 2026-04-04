import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

type JwtPayload = {
  sub: string;
  email: string;
  role: "VIEWER" | "ANALYST" | "ADMIN";
};

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new ApiError(401, "Authentication token is required"));
    return;
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;

    req.authUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired authentication token"));
  }
};
