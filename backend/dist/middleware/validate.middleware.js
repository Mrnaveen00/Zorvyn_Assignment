"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, target = "body") => (req, _res, next) => {
    const parsed = schema.parse(req[target]);
    if (target === "body") {
        req.body = parsed;
    }
    else {
        Object.assign(req.query, parsed);
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map