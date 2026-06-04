/*
  Warnings:

  - Added the required column `itemsSummary` to the `qr_code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderReference` to the `qr_code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `qr_code` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'mobile_money', 'bank_transfer', 'wallet');

-- AlterEnum
ALTER TYPE "OrderPlacedBy" ADD VALUE 'officer';

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'cash',
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "qr_code" ADD COLUMN     "itemsSummary" JSONB NOT NULL,
ADD COLUMN     "orderReference" TEXT NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;
