import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/index';

// Lazy initialization: create app on first request to avoid env issues during build
let app: any = null;

function getApp() {
  if (!app) {
    console.log('[api/[...path]] Initializing Express app...');
    console.log('[api/[...path]] Environment check:', {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      databaseUrlLength: process.env.DATABASE_URL?.length || 0
    });
    app = createServer();
    console.log('[api/[...path]] Express app initialized successfully');
  }
  return app;
}

// Vercel catch-all route handler for /api/*
export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('[api/[...path]] Handling request:', req.method, req.url);
    const expressApp = getApp();
    // Express apps are callable with (req, res)
    return (expressApp as any)(req, res);
  } catch (error: any) {
    console.error('[api/[...path]] Serverless function error:', error);
    console.error('[api/[...path]] Error stack:', error?.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: error?.message,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
  }
}
