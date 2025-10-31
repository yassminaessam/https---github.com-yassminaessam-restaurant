import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

function getPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!prisma) {
    prisma = new PrismaClient({
      log: ["error", "warn"],
    });
  }
  return prisma;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const hasEnv = !!process.env.DATABASE_URL;
    const prisma = getPrisma();
    const result = await prisma.$queryRawUnsafe<any>("SELECT 1 as ok");
    return res.json({ env: hasEnv, db: "ok", result });
  } catch (err: any) {
    console.error("DB Health error:", err);
    return res.status(500).json({ 
      env: !!process.env.DATABASE_URL, 
      error: err.message, 
      name: err.name 
    });
  }
}
