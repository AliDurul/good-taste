-- CreateTable
CREATE TABLE "promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PromotionType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "discountValue" DOUBLE PRECISION,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_target_tier" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,

    CONSTRAINT "promotion_target_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_target_category" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "promotion_target_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_bundle_item" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,

    CONSTRAINT "promotion_bundle_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "promotion_isActive_startsAt_endsAt_idx" ON "promotion"("isActive", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_target_tier_promotionId_tierId_key" ON "promotion_target_tier"("promotionId", "tierId");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_target_category_promotionId_categoryId_key" ON "promotion_target_category"("promotionId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_bundle_item_promotionId_variantId_key" ON "promotion_bundle_item"("promotionId", "variantId");

-- AddForeignKey
ALTER TABLE "promotion_target_tier" ADD CONSTRAINT "promotion_target_tier_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_target_tier" ADD CONSTRAINT "promotion_target_tier_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "loyalty_tier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_target_category" ADD CONSTRAINT "promotion_target_category_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_target_category" ADD CONSTRAINT "promotion_target_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_bundle_item" ADD CONSTRAINT "promotion_bundle_item_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_bundle_item" ADD CONSTRAINT "promotion_bundle_item_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
