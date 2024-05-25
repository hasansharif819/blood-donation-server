-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "totalDonations" INTEGER NOT NULL DEFAULT 0;
