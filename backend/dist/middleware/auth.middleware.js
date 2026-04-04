"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const api_error_1 = require("../utils/api-error");
const authenticate = (req, _res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
        next(new api_error_1.ApiError(401, "Authentication token is required"));
        return;
    }
    const token = authorization.replace("Bearer ", "").trim();
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        req.authUser = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch {
        next(new api_error_1.ApiError(401, "Invalid or expired authentication token"));
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map