import type { Request, Response } from "express";

import { authService } from "./auth.service";

export const authController = {
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);

    res.status(200).json(result);
  },

  async me(req: Request, res: Response) {
    if (!req.authUser?.id) {
      res.status(401).json({
        message: "Authentication is required",
      });
      return;
    }

    const user = await authService.getCurrentUser(req.authUser.id);

    res.status(200).json({
      user,
    });
  },
};
