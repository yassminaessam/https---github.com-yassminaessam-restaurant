import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/index';
import serverless from 'serverless-http';

// Build once at module load so Vercel can statically trace dependencies
const app = createServer();
const handler = serverless(app);

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    await handler(req, res);
  } catch (error: any) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack 
    });
  }
}
