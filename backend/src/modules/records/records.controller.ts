import type { Request, Response } from "express";

import { ApiError } from "../../utils/api-error";
import { recordsService } from "./records.service";
import { listRecordsQuerySchema } from "./records.validation";

export const recordsController = {
  async createRecord(req: Request, res: Response) {
    const actorUserId = req.authUser?.id;

    if (!actorUserId) {
      throw new ApiError(401, "Authentication is required");
    }

    const record = await recordsService.createRecord(req.body, actorUserId);

    res.status(201).json({
      message: "Financial record created successfully",
      record,
    });
  },

  async listRecords(req: Request, res: Response) {
    const result = await recordsService.listRecords(listRecordsQuerySchema.parse(req.query));

    res.status(200).json(result);
  },

  async getRecordById(req: Request, res: Response) {
    const record = await recordsService.getRecordById(String(req.params.id));

    res.status(200).json({
      record,
    });
  },

  async updateRecord(req: Request, res: Response) {
    const actorUserId = req.authUser?.id;

    if (!actorUserId) {
      throw new ApiError(401, "Authentication is required");
    }

    const record = await recordsService.updateRecord(String(req.params.id), req.body, actorUserId);

    res.status(200).json({
      message: "Financial record updated successfully",
      record,
    });
  },

  async deleteRecord(req: Request, res: Response) {
    await recordsService.deleteRecord(String(req.params.id));

    res.status(204).send();
  },
};
