/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "imageUrl",
ADD COLUMN     "image" TEXT;
