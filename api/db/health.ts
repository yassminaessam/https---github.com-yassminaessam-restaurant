import type { VercelRequest, VercelResponse } from '@vercel/node';
import centralHandler from '../index';

// Delegate to the central Express-backed serverless handler
export default async function proxy(req: VercelRequest, res: VercelResponse) {
  return centralHandler(req, res);
}
