"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const api_error_1 = require("../utils/api-error");
const requireRole = (...allowedRoles) => (req, _res, next) => {
    const currentUserRole = req.authUser?.role;
    if (!currentUserRole) {
        next(new api_error_1.ApiError(401, "Authentication is required"));
        return;
    }
    if (!allowedRoles.includes(currentUserRole)) {
        next(new api_error_1.ApiError(403, "You do not have permission to perform this action"));
        return;
    }
    next();
};
exports.requireRole = requireRole;
//# sourceMappingURL=require-role.middleware.js.map