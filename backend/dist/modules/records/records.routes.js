"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordRoutes = void 0;
const express_1 = require("express");
const roles_1 = require("../../constants/roles");
const require_role_middleware_1 = require("../../middleware/require-role.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const async_handler_1 = require("../../utils/async-handler");
const records_controller_1 = require("./records.controller");
const records_validation_1 = require("./records.validation");
exports.recordRoutes = (0, express_1.Router)();
exports.recordRoutes.get("/", (0, require_role_middleware_1.requireRole)(roles_1.USER_ROLES.ADMIN, roles_1.USER_ROLES.ANALYST), (0, async_handler_1.asyncHandler)(records_controller_1.recordsController.listRecords));
exports.recordRoutes.get("/:id", (0, require_role_middleware_1.requireRole)(roles_1.USER_ROLES.ADMIN, roles_1.USER_ROLES.ANALYST), (0, async_handler_1.asyncHandler)(records_controller_1.recordsController.getRecordById));
exports.recordRoutes.post("/", (0, require_role_middleware_1.requireRole)(roles_1.USER_ROLES.ADMIN), (0, validate_middleware_1.validate)(records_validation_1.createRecordSchema), (0, async_handler_1.asyncHandler)(records_controller_1.recordsController.createRecord));
exports.recordRoutes.patch("/:id", (0, require_role_middleware_1.requireRole)(roles_1.USER_ROLES.ADMIN), (0, validate_middleware_1.validate)(records_validation_1.updateRecordSchema), (0, async_handler_1.asyncHandler)(records_controller_1.recordsController.updateRecord));
exports.recordRoutes.delete("/:id", (0, require_role_middleware_1.requireRole)(roles_1.USER_ROLES.ADMIN), (0, async_handler_1.asyncHandler)(records_controller_1.recordsController.deleteRecord));
//# sourceMappingURL=records.routes.js.map