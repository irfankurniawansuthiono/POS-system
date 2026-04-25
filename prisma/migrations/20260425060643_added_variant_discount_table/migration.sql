-- CreateTable
CREATE TABLE "VariantDiscount" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,

    CONSTRAINT "VariantDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VariantDiscount_variantId_discountId_key" ON "VariantDiscount"("variantId", "discountId");

-- AddForeignKey
ALTER TABLE "VariantDiscount" ADD CONSTRAINT "VariantDiscount_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantDiscount" ADD CONSTRAINT "VariantDiscount_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
