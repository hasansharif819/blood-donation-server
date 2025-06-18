/*
  Warnings:

  - The values [COMPLETED] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `availability` on the `userprofiles` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `userprofiles` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `userprofiles` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `userprofiles` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `userprofiles` table. All the data in the column will be lost.
  - You are about to drop the column `totalDonations` on the `userprofiles` table. All the data in the column will be lost.
  - Added the required column `bloodType` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "requests" ALTER COLUMN "requestStatus" DROP DEFAULT;
ALTER TABLE "requests" ALTER COLUMN "requestStatus" TYPE "RequestStatus_new" USING ("requestStatus"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
ALTER TABLE "requests" ALTER COLUMN "requestStatus" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "userprofiles_bloodType_idx";

-- DropIndex
DROP INDEX "users_status_id_email_idx";

-- AlterTable
ALTER TABLE "userprofiles" DROP COLUMN "availability",
DROP COLUMN "bloodType",
DROP COLUMN "city",
DROP COLUMN "location",
DROP COLUMN "profilePicture",
DROP COLUMN "totalDonations";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bloodType" "BloodGroup" NOT NULL,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "totalDonations" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "users_bloodType_idx" ON "users"("bloodType");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");
