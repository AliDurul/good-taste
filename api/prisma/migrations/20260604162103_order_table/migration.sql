/*
  Warnings:

  - You are about to drop the column `cashConfirmedAt` on the `order` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'completed';

-- AlterTable
ALTER TABLE "order" DROP COLUMN "cashConfirmedAt",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "outForDeliveryAt" TIMESTAMP(3),
ADD COLUMN     "paymentConfirmedAt" TIMESTAMP(3);
