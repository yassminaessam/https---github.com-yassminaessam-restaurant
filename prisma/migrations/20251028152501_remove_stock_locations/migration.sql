/*
  Warnings:

  - You are about to drop the column `locationId` on the `StockBatch` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `StockCountLine` table. All the data in the column will be lost.
  - You are about to drop the `StockLocation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `warehouseId` to the `StockBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseId` to the `StockCountLine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StockBatch" DROP CONSTRAINT "StockBatch_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockCountLine" DROP CONSTRAINT "StockCountLine_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockLocation" DROP CONSTRAINT "StockLocation_warehouseId_fkey";

-- AlterTable
ALTER TABLE "StockBatch" DROP COLUMN "locationId",
ADD COLUMN     "warehouseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StockCountLine" DROP COLUMN "locationId",
ADD COLUMN     "warehouseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Warehouse" ALTER COLUMN "type" SET DEFAULT 'storage';

-- DropTable
DROP TABLE "public"."StockLocation";

-- AddForeignKey
ALTER TABLE "StockBatch" ADD CONSTRAINT "StockBatch_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
