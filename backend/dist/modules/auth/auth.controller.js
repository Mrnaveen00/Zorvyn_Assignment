"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
exports.authController = {
    async login(req, res) {
        const result = await auth_service_1.authService.login(req.body);
        res.status(200).json(result);
    },
    async me(req, res) {
        if (!req.authUser?.id) {
            res.status(401).json({
                message: "Authentication is required",
            });
            return;
        }
        const user = await auth_service_1.authService.getCurrentUser(req.authUser.id);
        res.status(200).json({
            user,
        });
    },
};
//# sourceMappingURL=auth.controller.js.map