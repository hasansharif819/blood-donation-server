/*
  Warnings:

  - Added the required column `dateOfDonation` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donationTime` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donationTime` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TimeOfDay" AS ENUM ('MORNING', 'NOON', 'EVENING', 'NIGHT');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "dateOfDonation" TEXT NOT NULL,
ADD COLUMN     "donationTime" "TimeOfDay" NOT NULL;

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "donationTime" "TimeOfDay" NOT NULL;
