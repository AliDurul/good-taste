/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoyaltyTier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QRCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TierBenefit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TierHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WalletConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WalletTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "QRCode" DROP CONSTRAINT "QRCode_agentId_fkey";

-- DropForeignKey
ALTER TABLE "QRCode" DROP CONSTRAINT "QRCode_customerId_fkey";

-- DropForeignKey
ALTER TABLE "QRCode" DROP CONSTRAINT "QRCode_orderId_fkey";

-- DropForeignKey
ALTER TABLE "TierBenefit" DROP CONSTRAINT "TierBenefit_tierId_fkey";

-- DropForeignKey
ALTER TABLE "TierHistory" DROP CONSTRAINT "TierHistory_customerId_fkey";

-- DropForeignKey
ALTER TABLE "TierHistory" DROP CONSTRAINT "TierHistory_fromTierId_fkey";

-- DropForeignKey
ALTER TABLE "TierHistory" DROP CONSTRAINT "TierHistory_toTierId_fkey";

-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_customerId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_tierId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "LoyaltyTier";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductVariant";

-- DropTable
DROP TABLE "QRCode";

-- DropTable
DROP TABLE "TierBenefit";

-- DropTable
DROP TABLE "TierHistory";

-- DropTable
DROP TABLE "WalletConfig";

-- DropTable
DROP TABLE "WalletTransaction";

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT[],
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "weightLabel" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "earnValue" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "stockQty" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
    "isOutOfStock" BOOLEAN NOT NULL DEFAULT false,
    "lastRestockedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "placedBy" "OrderPlacedBy" NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalAmount" DOUBLE PRECISION NOT NULL,
    "isFreeDelivery" BOOLEAN NOT NULL DEFAULT false,
    "walletEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "walletRedeemed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deliveryAddress" TEXT,
    "notes" TEXT,
    "cashConfirmedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "weightLabel" TEXT NOT NULL,
    "productPrice" DOUBLE PRECISION NOT NULL,
    "earnValue" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "productId" TEXT,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_code" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "amountToCredit" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transaction" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "orderId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'global',
    "earnRatePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.01,
    "expiryMonths" INTEGER NOT NULL DEFAULT 12,
    "referralBonusReferrer" DOUBLE PRECISION NOT NULL DEFAULT 5.00,
    "referralBonusReferred" DOUBLE PRECISION NOT NULL DEFAULT 2.50,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_tier" (
    "id" TEXT NOT NULL,
    "name" "TierName" NOT NULL,
    "minSpend" DOUBLE PRECISION NOT NULL,
    "maxSpend" DOUBLE PRECISION,
    "earnMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tier_benefit" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "tier_benefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tier_history" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "fromTierId" TEXT,
    "toTierId" TEXT NOT NULL,
    "reason" "TierChangeReason" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tier_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE INDEX "product_categoryId_idx" ON "product"("categoryId");

-- CreateIndex
CREATE INDEX "product_isActive_idx" ON "product"("isActive");

-- CreateIndex
CREATE INDEX "product_variant_productId_idx" ON "product_variant"("productId");

-- CreateIndex
CREATE INDEX "product_variant_isOutOfStock_idx" ON "product_variant"("isOutOfStock");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_productId_weightKg_key" ON "product_variant"("productId", "weightKg");

-- CreateIndex
CREATE INDEX "order_customerId_idx" ON "order"("customerId");

-- CreateIndex
CREATE INDEX "order_agentId_idx" ON "order"("agentId");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- CreateIndex
CREATE INDEX "order_createdAt_idx" ON "order"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "order_item_orderId_idx" ON "order_item"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "qr_code_orderId_key" ON "qr_code"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "qr_code_code_key" ON "qr_code"("code");

-- CreateIndex
CREATE INDEX "qr_code_code_idx" ON "qr_code"("code");

-- CreateIndex
CREATE INDEX "qr_code_expiresAt_idx" ON "qr_code"("expiresAt");

-- CreateIndex
CREATE INDEX "wallet_transaction_customerId_createdAt_idx" ON "wallet_transaction"("customerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "wallet_transaction_isExpired_expiresAt_idx" ON "wallet_transaction"("isExpired", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_config_key_key" ON "wallet_config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_tier_name_key" ON "loyalty_tier"("name");

-- CreateIndex
CREATE INDEX "tier_benefit_tierId_idx" ON "tier_benefit"("tierId");

-- CreateIndex
CREATE INDEX "tier_history_customerId_changedAt_idx" ON "tier_history"("customerId", "changedAt" DESC);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "loyalty_tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_code" ADD CONSTRAINT "qr_code_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_code" ADD CONSTRAINT "qr_code_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_code" ADD CONSTRAINT "qr_code_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tier_benefit" ADD CONSTRAINT "tier_benefit_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "loyalty_tier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tier_history" ADD CONSTRAINT "tier_history_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tier_history" ADD CONSTRAINT "tier_history_fromTierId_fkey" FOREIGN KEY ("fromTierId") REFERENCES "loyalty_tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tier_history" ADD CONSTRAINT "tier_history_toTierId_fkey" FOREIGN KEY ("toTierId") REFERENCES "loyalty_tier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
