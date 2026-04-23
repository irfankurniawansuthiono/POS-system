-- AlterTable
ALTER TABLE "variant" ADD COLUMN     "profitMargin" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "VariantSupplier" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VariantSupplier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VariantSupplier" ADD CONSTRAINT "VariantSupplier_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantSupplier" ADD CONSTRAINT "VariantSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
