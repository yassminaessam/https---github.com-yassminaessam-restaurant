import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/index';

// Lazy initialization: create app on first request to avoid env issues during build
let app: any = null;

function getApp() {
  if (!app) {
    console.log('[api/index] Initializing Express app...');
    app = createServer();
    console.log('[api/index] Express app initialized successfully');
  }
  return app;
}

// Vercel Node functions receive standard Node req/res objects — call the Express app directly
export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = getApp();
    // Express apps are callable with (req, res)
    return (expressApp as any)(req, res);
  } catch (error: any) {
    console.error('[api/index] Serverless function error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error?.message,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
  }
}
