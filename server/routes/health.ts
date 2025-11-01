import type { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// GET /api/db/health
export const getDbHealth: RequestHandler = async (_req, res) => {
  try {
    const hasEnv = !!process.env.DATABASE_URL;
    const prisma = getPrisma();
    const result = await prisma.$queryRawUnsafe("SELECT 1 as ok");
    return res.json({ env: hasEnv, db: "ok", result });
  } catch (err: any) {
    console.error("DB Health error:", err);
    return res.status(500).json({ env: !!process.env.DATABASE_URL, error: err.message, name: err.name });
  }
};
