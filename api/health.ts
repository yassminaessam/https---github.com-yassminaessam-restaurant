import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../server/lib/prisma.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('[api/health] Testing database connection...');
    const prisma = getPrisma();
    
    await prisma.$queryRaw`SELECT 1 as health`;
    
    console.log('[api/health] Database connection successful');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[api/health] Database connection failed:', error.message);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
}
