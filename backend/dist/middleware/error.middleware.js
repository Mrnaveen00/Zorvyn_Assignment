"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const api_error_1 = require("../utils/api-error");
const errorMiddleware = (error, _req, res, _next) => {
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            message: "Validation failed",
            errors: error.flatten(),
        });
        return;
    }
    if (error instanceof api_error_1.ApiError) {
        res.status(error.statusCode).json({
            message: error.message,
            details: error.details,
        });
        return;
    }
    console.error(error);
    res.status(500).json({
        message: "Internal server error",
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map