/*
  Warnings:

  - You are about to drop the column `position` on the `PersonalDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PersonalDetail" DROP COLUMN "position",
ADD COLUMN     "office_position" TEXT;
