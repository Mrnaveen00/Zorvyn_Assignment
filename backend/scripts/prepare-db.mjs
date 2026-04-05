import { execSync } from "node:child_process";

function run(command) {
  execSync(command, {
    stdio: "inherit",
    env: process.env,
  });
}

async function main() {
  console.log("Preparing database...");
  run("npx prisma migrate deploy");
  run("node ./scripts/seed.mjs");
  console.log("Database preparation complete.");
}

main().catch((error) => {
  console.error("Database preparation failed:", error);
  process.exit(1);
});
