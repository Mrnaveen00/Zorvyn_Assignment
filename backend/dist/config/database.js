"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const pg_1 = __importDefault(require("pg"));
const env_1 = require("./env");
const connectionPool = new pg_1.default.Pool({
    connectionString: env_1.env.databaseUrl,
});
const adapter = new adapter_pg_1.PrismaPg(connectionPool);
exports.prisma = global.prisma ??
    new client_1.PrismaClient({
        adapter,
        log: ["warn", "error"],
    });
if (process.env.NODE_ENV !== "production") {
    global.prisma = exports.prisma;
}
//# sourceMappingURL=database.js.map