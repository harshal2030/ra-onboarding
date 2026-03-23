import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaBetterSQLite3({
  url: "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const SERVICES = [
  { planName: "Momentum Portfolio", annualFee: 15000, gstRate: 18 },
  { planName: "Smart Byer", annualFee: 10000, gstRate: 18 },
  { planName: "RA Reports", annualFee: 30000, gstRate: 18 },
];

async function main() {
  for (const service of SERVICES) {
    await prisma.service.upsert({
      where: { planName: service.planName },
      update: { annualFee: service.annualFee, gstRate: service.gstRate },
      create: service,
    });
  }
  console.log("Seeded services successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
