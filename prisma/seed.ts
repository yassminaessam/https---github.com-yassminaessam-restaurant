import pkg from "@prisma/client";
const { PrismaClient } = pkg as any;
const prisma: any = new PrismaClient();

async function main() {
  // مخزن المطعم - يستقبل من الموردين
  const restaurant = await prisma.warehouse.upsert({
    where: { code: "RESTAURANT" },
    update: {},
    create: { code: "RESTAURANT", name: "مخزن المطعم", type: "storage" },
  });

  // مخزن الكافتيريا - يستقبل من الموردين
  const cafeteria = await prisma.warehouse.upsert({
    where: { code: "CAFETERIA" },
    update: {},
    create: { code: "CAFETERIA", name: "مخزن الكافتيريا", type: "storage" },
  });

  // المطبخ - يستقبل من مخزن المطعم، يبيع للزبائن
  const kitchen = await prisma.warehouse.upsert({
    where: { code: "KITCHEN" },
    update: {},
    create: { code: "KITCHEN", name: "المطبخ", type: "kitchen" },
  });

  // البوفيه - يستقبل من مخزن الكافتيريا، يبيع للزبائن
  const buffet = await prisma.warehouse.upsert({
    where: { code: "BUFFET" },
    update: {},
    create: { code: "BUFFET", name: "البوفيه", type: "buffet" },
  });

  // الثلاجة - يستقبل من مخزن الكافتيريا، يبيع للزبائن
  const fridge = await prisma.warehouse.upsert({
    where: { code: "FRIDGE" },
    update: {},
    create: { code: "FRIDGE", name: "الثلاجة", type: "fridge" },
  });

  // ميني بار الغرف - يستقبل من الثلاجة
  await prisma.warehouse.upsert({
    where: { code: "ROOM-101" },
    update: {},
    create: { code: "ROOM-101", name: "ميني بار غرفة 101", type: "minibar" },
  });

  await prisma.warehouse.upsert({
    where: { code: "ROOM-102" },
    update: {},
    create: { code: "ROOM-102", name: "ميني بار غرفة 102", type: "minibar" },
  });

  await prisma.warehouse.upsert({
    where: { code: "ROOM-103" },
    update: {},
    create: { code: "ROOM-103", name: "ميني بار غرفة 103", type: "minibar" },
  });

  await prisma.warehouse.upsert({
    where: { code: "ROOM-104" },
    update: {},
    create: { code: "ROOM-104", name: "ميني بار غرفة 104", type: "minibar" },
  });

  await prisma.warehouse.upsert({
    where: { code: "ROOM-105" },
    update: {},
    create: { code: "ROOM-105", name: "ميني بار غرفة 105", type: "minibar" },
  });

  // Sample Items for testing
  await prisma.item.upsert({
    where: { sku: "RICE-001" },
    update: {},
    create: {
      sku: "RICE-001",
      name: "أرز بسمتي (Basmati Rice)",
      category: "dry_goods",
      type: "raw_material",
      baseUom: "kg",
    },
  });

  await prisma.item.upsert({
    where: { sku: "CHICKEN-001" },
    update: {},
    create: {
      sku: "CHICKEN-001",
      name: "دجاج طازج (Fresh Chicken)",
      category: "protein",
      type: "raw_material",
      baseUom: "kg",
    },
  });

  await prisma.item.upsert({
    where: { sku: "COLA-001" },
    update: {},
    create: {
      sku: "COLA-001",
      name: "كوكاكولا (Coca Cola)",
      category: "beverages",
      type: "finished_good",
      baseUom: "bottle",
    },
  });

  await prisma.item.upsert({
    where: { sku: "WATER-001" },
    update: {},
    create: {
      sku: "WATER-001",
      name: "ماء معدني (Mineral Water)",
      category: "beverages",
      type: "finished_good",
      baseUom: "bottle",
    },
  });

  await prisma.item.upsert({
    where: { sku: "CHIPS-001" },
    update: {},
    create: {
      sku: "CHIPS-001",
      name: "شيبس (Potato Chips)",
      category: "snacks",
      type: "finished_good",
      baseUom: "pack",
    },
  });

  console.log("Seed completed: 11 warehouses and sample items created/updated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
