import { Router } from "express";

import { USER_ROLES } from "../../constants/roles";
import { requireRole } from "../../middleware/require-role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { recordsController } from "./records.controller";
import { createRecordSchema, updateRecordSchema } from "./records.validation";

export const recordRoutes = Router();

recordRoutes.get(
  "/",
  requireRole(USER_ROLES.ADMIN, USER_ROLES.ANALYST),
  asyncHandler(recordsController.listRecords),
);
recordRoutes.get(
  "/:id",
  requireRole(USER_ROLES.ADMIN, USER_ROLES.ANALYST),
  asyncHandler(recordsController.getRecordById),
);
recordRoutes.post(
  "/",
  requireRole(USER_ROLES.ADMIN),
  validate(createRecordSchema),
  asyncHandler(recordsController.createRecord),
);
recordRoutes.patch(
  "/:id",
  requireRole(USER_ROLES.ADMIN),
  validate(updateRecordSchema),
  asyncHandler(recordsController.updateRecord),
);
recordRoutes.delete(
  "/:id",
  requireRole(USER_ROLES.ADMIN),
  asyncHandler(recordsController.deleteRecord),
);
