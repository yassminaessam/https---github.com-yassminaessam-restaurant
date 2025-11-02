import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/index.js';

// Lazy initialization: create app on first request to avoid env issues during build
let app: any = null;

function getApp() {
  if (!app) {
    console.log('[api/[...path]] Starting initialization...');
    console.log('[api/[...path]] DATABASE_URL present:', !!process.env.DATABASE_URL);
    console.log('[api/[...path]] DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
    console.log('[api/[...path]] NODE_ENV:', process.env.NODE_ENV);
    
    try {
      console.log('[api/[...path]] Creating Express server...');
      app = createServer();
      console.log('[api/[...path]] Express app created successfully');
    } catch (err: any) {
      console.error('[api/[...path]] Failed to create server:', err.message);
      console.error('[api/[...path]] Error stack:', err.stack);
      throw err;
    }
  }
  return app;
}

// Vercel catch-all route handler for /api/*
export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[api/[...path]] Request received:', req.method, req.url);
  
  try {
    const expressApp = getApp();
    console.log('[api/[...path]] Calling Express app...');
    
    // Express apps are callable with (req, res)
    return await new Promise((resolve, reject) => {
      (expressApp as any)(req, res, (err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });
  } catch (error: any) {
    console.error('[api/[...path]] Handler error:', error.message);
    console.error('[api/[...path]] Error stack:', error.stack);
    
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: error?.message,
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      });
    }
  }
}
