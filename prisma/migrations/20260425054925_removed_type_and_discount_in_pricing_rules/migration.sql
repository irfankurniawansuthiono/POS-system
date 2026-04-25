/*
  Warnings:

  - You are about to drop the column `discount` on the `pricing_rule` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `pricing_rule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pricing_rule" DROP COLUMN "discount",
DROP COLUMN "type";
