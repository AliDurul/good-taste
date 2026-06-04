/*
  Warnings:

  - You are about to drop the column `isExpired` on the `qr_code` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "paidAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "qr_code" DROP COLUMN "isExpired";
