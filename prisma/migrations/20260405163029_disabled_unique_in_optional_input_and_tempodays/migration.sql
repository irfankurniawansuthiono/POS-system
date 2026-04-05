/*
  Warnings:

  - Made the column `tempoDays` on table `supplier` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "supplier_bankAccountNumber_key";

-- DropIndex
DROP INDEX "supplier_email_key";

-- DropIndex
DROP INDEX "supplier_gmapsUrl_key";

-- AlterTable
ALTER TABLE "supplier" ALTER COLUMN "tempoDays" SET NOT NULL;
