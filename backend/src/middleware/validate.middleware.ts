import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny, target: "body" | "query" = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse(req[target]);

    if (target === "body") {
      req.body = parsed;
    } else {
      Object.assign(req.query, parsed);
    }

    next();
  };
