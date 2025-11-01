import type { VercelRequest, VercelResponse } from '@vercel/node';
import centralHandler from '../index';

// Proxy to central Express-backed API
export default async function proxy(req: VercelRequest, res: VercelResponse) {
  return centralHandler(req, res);
}
