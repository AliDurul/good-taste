-- AlterTable
ALTER TABLE "product" ALTER COLUMN "images" SET NOT NULL,
ALTER COLUMN "images" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "product_variant" ALTER COLUMN "images" SET NOT NULL,
ALTER COLUMN "images" SET DATA TYPE TEXT;
