import type { Request, Response } from "express";

import { ApiError } from "../../utils/api-error";
import { usersService } from "./users.service";
import { listUsersQuerySchema } from "./users.validation";

export const usersController = {
  async createUser(req: Request, res: Response) {
    const user = await usersService.createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  },

  async listUsers(req: Request, res: Response) {
    const users = await usersService.listUsers(listUsersQuerySchema.parse(req.query));

    res.status(200).json({
      users,
    });
  },

  async getUserById(req: Request, res: Response) {
    const user = await usersService.getUserById(String(req.params.id));

    res.status(200).json({
      user,
    });
  },

  async updateUser(req: Request, res: Response) {
    const actorUserId = req.authUser?.id;

    if (!actorUserId) {
      throw new ApiError(401, "Authentication is required");
    }

    const user = await usersService.updateUser(String(req.params.id), req.body, actorUserId);

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  },

  async updateUserStatus(req: Request, res: Response) {
    const actorUserId = req.authUser?.id;

    if (!actorUserId) {
      throw new ApiError(401, "Authentication is required");
    }

    const user = await usersService.updateUserStatus(
      String(req.params.id),
      req.body.status,
      actorUserId,
    );

    res.status(200).json({
      message: "User status updated successfully",
      user,
    });
  },

  async deleteUser(req: Request, res: Response) {
    const actorUserId = req.authUser?.id;

    if (!actorUserId) {
      throw new ApiError(401, "Authentication is required");
    }

    await usersService.deleteUser(String(req.params.id), actorUserId);

    res.status(204).send();
  },
};
