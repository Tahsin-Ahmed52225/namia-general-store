import "dotenv/config";
import cron from "node-cron";
import { PrismaClient } from "../../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function cleanup() {
  const result = await prisma.letter.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  console.log(
    `[${new Date().toISOString()}] Cleanup: deleted ${result.count} expired letter(s)`
  );
}

// Run at midnight daily
cron.schedule("0 0 * * *", async () => {
  await cleanup();
});

// Run once on startup to catch any missed
cleanup().catch(console.error);

console.log("Cron service started — cleanup runs daily at midnight");
