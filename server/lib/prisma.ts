import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (!process.env.DATABASE_URL) {
    const error = new Error("DATABASE_URL is not set. Configure Postgres connection in environment variables.");
    console.error('[prisma] DATABASE_URL missing!', {
      env: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY'))
    });
    throw error;
  }
  
  if (!prisma) {
    try {
      console.log('[prisma] Creating new PrismaClient instance...');
      prisma = new PrismaClient({
        log: ["error", "warn"],
      });
      console.log('[prisma] PrismaClient created successfully');
    } catch (err: any) {
      console.error('[prisma] Failed to create PrismaClient:', err);
      throw err;
    }
  }
  return prisma;
}
