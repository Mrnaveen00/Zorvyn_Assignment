import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

import { env } from "./env";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionPool = new pg.Pool({
  connectionString: env.databaseUrl,
});

const adapter = new PrismaPg(connectionPool);

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
