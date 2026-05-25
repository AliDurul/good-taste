/*
  Warnings:

  - You are about to drop the `tier_benefit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tier_benefit" DROP CONSTRAINT "tier_benefit_tierId_fkey";

-- DropForeignKey
ALTER TABLE "tier_history" DROP CONSTRAINT "tier_history_toTierId_fkey";

-- AlterTable
ALTER TABLE "loyalty_tier" ADD COLUMN     "benefits" TEXT[];

-- AlterTable
ALTER TABLE "tier_history" ALTER COLUMN "toTierId" DROP NOT NULL;

-- DropTable
DROP TABLE "tier_benefit";

-- AddForeignKey
ALTER TABLE "tier_history" ADD CONSTRAINT "tier_history_toTierId_fkey" FOREIGN KEY ("toTierId") REFERENCES "loyalty_tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
