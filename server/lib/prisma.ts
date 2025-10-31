import pkg from "@prisma/client";
const { PrismaClient } = pkg as any;

let prisma: any = null;

export function getPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Configure Postgres connection in .env");
  }
  if (!prisma) prisma = new PrismaClient({
    log: ["error", "warn"],
  });
  return prisma;
}
