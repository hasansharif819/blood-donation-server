/*
  Warnings:

  - Added the required column `city` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "city" TEXT NOT NULL;
