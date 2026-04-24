/*
  Warnings:

  - You are about to drop the column `isPrimary` on the `VariantSupplier` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `VariantSupplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VariantSupplier" DROP COLUMN "isPrimary",
DROP COLUMN "price";
