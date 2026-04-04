"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordsController = void 0;
const api_error_1 = require("../../utils/api-error");
const records_service_1 = require("./records.service");
const records_validation_1 = require("./records.validation");
exports.recordsController = {
    async createRecord(req, res) {
        const actorUserId = req.authUser?.id;
        if (!actorUserId) {
            throw new api_error_1.ApiError(401, "Authentication is required");
        }
        const record = await records_service_1.recordsService.createRecord(req.body, actorUserId);
        res.status(201).json({
            message: "Financial record created successfully",
            record,
        });
    },
    async listRecords(req, res) {
        const result = await records_service_1.recordsService.listRecords(records_validation_1.listRecordsQuerySchema.parse(req.query));
        res.status(200).json(result);
    },
    async getRecordById(req, res) {
        const record = await records_service_1.recordsService.getRecordById(String(req.params.id));
        res.status(200).json({
            record,
        });
    },
    async updateRecord(req, res) {
        const actorUserId = req.authUser?.id;
        if (!actorUserId) {
            throw new api_error_1.ApiError(401, "Authentication is required");
        }
        const record = await records_service_1.recordsService.updateRecord(String(req.params.id), req.body, actorUserId);
        res.status(200).json({
            message: "Financial record updated successfully",
            record,
        });
    },
    async deleteRecord(req, res) {
        await records_service_1.recordsService.deleteRecord(String(req.params.id));
        res.status(204).send();
    },
};
//# sourceMappingURL=records.controller.js.map