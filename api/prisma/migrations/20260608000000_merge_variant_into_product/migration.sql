-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_variantId_fkey";

-- DropForeignKey
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "promotion_bundle_item" DROP CONSTRAINT "promotion_bundle_item_variantId_fkey";

-- DropIndex
DROP INDEX "promotion_bundle_item_promotionId_variantId_key";

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "variantId",
DROP COLUMN "weightLabel",
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "earnValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lastRestockedAt" TIMESTAMP(3),
ADD COLUMN     "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stockQty" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weightKg" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "promotion_bundle_item" DROP COLUMN "variantId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "product_variant";

-- CreateIndex
CREATE UNIQUE INDEX "promotion_bundle_item_promotionId_productId_key" ON "promotion_bundle_item"("promotionId", "productId");

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_bundle_item" ADD CONSTRAINT "promotion_bundle_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
