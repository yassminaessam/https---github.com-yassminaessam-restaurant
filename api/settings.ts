import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();

  if (req.method === 'GET') {
    try {
      const settings = await prisma.systemSettings.findMany();
      
      const settingsObj = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);

      res.json(settingsObj);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings', message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { settings } = req.body;

      if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ error: 'Invalid data' });
      }

      const updates = await prisma.$transaction(
        Object.entries(settings).map(([key, value]) =>
          prisma.systemSettings.upsert({
            where: { key },
            update: { value: value as any, updatedAt: new Date() },
            create: { id: randomUUID(), key, value: value as any, updatedAt: new Date() },
          })
        )
      );

      res.json({ success: true, count: updates.length });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      res.status(500).json({ error: 'Failed to save settings', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
