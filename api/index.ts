import type { VercelRequest, VercelResponse } from '@vercel/node';

// Load environment variables
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
}

// Lazy load to avoid build-time issues
let handler: any = null;

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    if (!handler) {
      const { createServer } = await import('../server/index.js');
      const serverless = await import('serverless-http');
      const app = createServer();
      handler = serverless.default(app);
    }
    
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
