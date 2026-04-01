/*
  Warnings:

  - You are about to drop the column `slug` on the `brand` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "brand_slug_key";

-- AlterTable
ALTER TABLE "brand" DROP COLUMN "slug";
