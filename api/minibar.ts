import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../server/lib/prisma';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();
  const path = req.url?.split('/api/minibar')[1]?.split('?')[0] || '';

  try {
    // /api/minibar/rooms
    if (path === '/rooms') {
      if (req.method === 'GET') {
        const rooms = await prisma.hotelRoom.findMany({
          include: {
            Folio: {
              where: {
                status: 'open',
              },
              include: {
                RoomCharge: {
                  where: {
                    category: 'minibar',
                  },
                },
              },
            },
          },
          orderBy: {
            roomNumber: 'asc',
          },
        });

        return res.status(200).json(rooms);
      }

      if (req.method === 'POST') {
        const { roomNumber, floor, category, status } = req.body;

        const room = await prisma.hotelRoom.create({
          data: {
            id: randomUUID(),
            roomNumber,
            floor,
            category: category || 'standard',
            status: status || 'available',
          },
          include: {
            Folio: true,
          },
        });

        return res.status(201).json(room);
      }
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('Error in minibar handler:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
