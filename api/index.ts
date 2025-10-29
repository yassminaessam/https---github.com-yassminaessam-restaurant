import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/index';
import serverless from 'serverless-http';

const app = createServer();
const handler = serverless(app);

export default async function (req: VercelRequest, res: VercelResponse) {
  await handler(req, res);
}
