import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/index';

// Initialize the Express app once so Vercel can statically trace dependencies
const app = createServer();

// Vercel Node functions receive standard Node req/res objects — call the Express app directly
export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Express apps are callable with (req, res)
    return (app as any)(req, res);
  } catch (error: any) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error?.message,
    });
  }
}
