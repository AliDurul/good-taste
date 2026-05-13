/*
  Warnings:

  - You are about to drop the column `fcmToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `referredById` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_referredById_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "fcmToken",
DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "referredById";
