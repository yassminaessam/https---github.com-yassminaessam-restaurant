import { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";
import crypto from "crypto";

// Get all hotel rooms
export const getHotelRooms: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const rooms = await prisma.hotelRoom.findMany({
      include: {
        Folio: {
          where: {
            status: 'open'
          },
          include: {
            RoomCharge: true
          }
        }
      },
      orderBy: { roomNumber: 'asc' }
    });
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching hotel rooms:", error);
    res.status(500).json({ error: "Failed to fetch hotel rooms" });
  }
};

// Create or update hotel room
export const upsertHotelRoom: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { roomNumber } = req.body;

    const room = await prisma.hotelRoom.upsert({
      where: { roomNumber },
      update: req.body,
      create: req.body
    });

    res.json(room);
  } catch (error) {
    console.error("Error upserting hotel room:", error);
    res.status(500).json({ error: "Failed to upsert hotel room" });
  }
};

// Get folio by room
export const getFolioByRoom: RequestHandler = async (req, res) => {
  try {
    const { roomId } = req.params;
    const prisma = getPrisma();

    const folio = await prisma.folio.findFirst({
      where: {
        roomId,
        status: 'open'
      },
      include: {
        HotelRoom: true,
        RoomCharge: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json(folio);
  } catch (error) {
    console.error("Error fetching folio:", error);
    res.status(500).json({ error: "Failed to fetch folio" });
  }
};

// Create new folio
export const createFolio: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const folio = await prisma.folio.create({
      data: {
        id: crypto.randomUUID(),
        ...req.body,
        status: 'open',
        balance: 0
      },
      include: {
        HotelRoom: true,
        RoomCharge: true
      }
    });

    res.status(201).json(folio);
  } catch (error) {
    console.error("Error creating folio:", error);
    res.status(500).json({ error: "Failed to create folio" });
  }
};

// Add charge to folio (minibar consumption)
export const addChargeToFolio: RequestHandler = async (req, res) => {
  try {
    const { folioId, itemId, quantity, unitPrice, warehouseId } = req.body;
    const prisma = getPrisma();

    const result = await prisma.$transaction(async (tx) => {
      // Create room charge
      const charge = await tx.roomCharge.create({
        data: {
          id: crypto.randomUUID(),
          folioId,
          description: `Item ${itemId}`,
          amount: quantity * unitPrice,
          category: 'MINIBAR'
        }
      });

      // Update folio total
      const folio = await tx.folio.update({
        where: { id: folioId },
        data: {
          balance: {
            increment: Number(charge.amount)
          }
        },
        include: {
          HotelRoom: true,
          RoomCharge: true
        }
      });

      // Deduct from warehouse stock
      if (warehouseId) {
        await tx.stockLedger.create({
          data: {
            id: crypto.randomUUID(),
            itemId,
            warehouseId,
            txnType: 'minibar_sale',
            qty: -quantity,
            refType: 'room_charge',
            refId: charge.id,
            txnDate: new Date(),
            notes: `Minibar charge for room ${folio.HotelRoom.roomNumber}`
          }
        });
      }

      return folio;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding charge to folio:", error);
    res.status(500).json({ error: "Failed to add charge to folio" });
  }
};

// Close folio (checkout)
export const closeFolio: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;
    const prisma = getPrisma();

    const folio = await prisma.$transaction(async (tx) => {
      // Get current folio
      const currentFolio = await tx.folio.findUnique({
        where: { id },
        include: {
          HotelRoom: true,
          RoomCharge: true
        }
      });

      if (!currentFolio) {
        throw new Error("Folio not found");
      }

      // Close the folio
      const closedFolio = await tx.folio.update({
        where: { id },
        data: {
          status: 'closed',
          checkOut: new Date()
        },
        include: {
          HotelRoom: true,
          RoomCharge: true
        }
      });

      // Update room status to available
      await tx.hotelRoom.update({
        where: { id: currentFolio.roomId },
        data: {
          status: 'available'
        }
      });

      return closedFolio;
    });

    res.json(folio);
  } catch (error) {
    console.error("Error closing folio:", error);
    res.status(500).json({ error: "Failed to close folio" });
  }
};
