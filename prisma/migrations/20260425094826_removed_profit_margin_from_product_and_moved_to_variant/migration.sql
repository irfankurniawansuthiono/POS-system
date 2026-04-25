/*
  Warnings:

  - You are about to drop the column `profitMargin` on the `variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pricing_rule" ADD COLUMN     "profitMargin" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "variant" DROP COLUMN "profitMargin";
