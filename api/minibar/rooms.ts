import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();

  try {
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
      const { randomUUID } = await import('crypto');

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

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in minibar rooms endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
