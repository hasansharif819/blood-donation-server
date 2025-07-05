/*
  Warnings:

  - Made the column `requesterId` on table `requests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "requests" ALTER COLUMN "requesterId" SET NOT NULL;
