import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, RecordType, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import pg from "pg";

const connectionPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(connectionPool);

const prisma = new PrismaClient({
  adapter,
});

export async function seedDatabase() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@companyx.com" },
    update: {
      name: "System Admin",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: "System Admin",
      email: "admin@companyx.com",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "analyst@companyx.com" },
    update: {
      name: "Finance Analyst",
      passwordHash: await bcrypt.hash("Analyst@123", 10),
      role: UserRole.ANALYST,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: "Finance Analyst",
      email: "analyst@companyx.com",
      passwordHash: await bcrypt.hash("Analyst@123", 10),
      role: UserRole.ANALYST,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "viewer@companyx.com" },
    update: {
      name: "Dashboard Viewer",
      passwordHash: await bcrypt.hash("Viewer@123", 10),
      role: UserRole.VIEWER,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: "Dashboard Viewer",
      email: "viewer@companyx.com",
      passwordHash: await bcrypt.hash("Viewer@123", 10),
      role: UserRole.VIEWER,
      status: UserStatus.ACTIVE,
    },
  });

  const existingRecords = await prisma.financialRecord.count();

  if (existingRecords === 0) {
    await prisma.financialRecord.createMany({
      data: [
        {
          amount: 120000,
          type: RecordType.INCOME,
          category: "Client Payment",
          recordDate: new Date("2026-03-01"),
          notes: "Quarterly payment from ABC Ltd",
          createdById: admin.id,
          updatedById: admin.id,
        },
        {
          amount: 18000,
          type: RecordType.EXPENSE,
          category: "Office Rent",
          recordDate: new Date("2026-03-03"),
          notes: "Monthly office rent",
          createdById: admin.id,
          updatedById: admin.id,
        },
        {
          amount: 8500,
          type: RecordType.EXPENSE,
          category: "Software",
          recordDate: new Date("2026-03-08"),
          notes: "Team productivity subscriptions",
          createdById: admin.id,
          updatedById: admin.id,
        },
        {
          amount: 45000,
          type: RecordType.INCOME,
          category: "Consulting",
          recordDate: new Date("2026-03-15"),
          notes: "Consulting invoice settlement",
          createdById: admin.id,
          updatedById: admin.id,
        },
        {
          amount: 6200,
          type: RecordType.EXPENSE,
          category: "Utilities",
          recordDate: new Date("2026-03-17"),
          notes: "Internet and electricity",
          createdById: admin.id,
          updatedById: admin.id,
        },
      ],
    });
  }

  console.log("Seed data is ready.");
}

async function main() {
  await seedDatabase();
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await connectionPool.end();
  });
