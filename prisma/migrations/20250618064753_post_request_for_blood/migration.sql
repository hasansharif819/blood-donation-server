/*
  Warnings:

  - You are about to drop the column `availability` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `totalDonations` on the `users` table. All the data in the column will be lost.
  - Added the required column `numberOfBags` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Made the column `bloodType` on table `requests` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `bloodType` to the `userprofiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `userprofiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `userprofiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `contactNumber` on table `userprofiles` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FULFILLED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'COMPLETED';

-- DropForeignKey
ALTER TABLE "userprofiles" DROP CONSTRAINT "userprofiles_userId_fkey";

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "isManaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numberOfBags" INTEGER NOT NULL,
ALTER COLUMN "bloodType" SET NOT NULL;

-- AlterTable
ALTER TABLE "userprofiles" ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bloodType" "BloodGroup" NOT NULL,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "totalDonations" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "contactNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "availability",
DROP COLUMN "bloodType",
DROP COLUMN "city",
DROP COLUMN "location",
DROP COLUMN "profilePicture",
DROP COLUMN "totalDonations";

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bloodType" "BloodGroup" NOT NULL,
    "numberOfBags" INTEGER NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "hospitalAddress" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "postStatus" "PostStatus" NOT NULL DEFAULT 'PENDING',
    "isManaged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_approvals" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_bloodType_idx" ON "posts"("bloodType");

-- CreateIndex
CREATE INDEX "posts_postStatus_idx" ON "posts"("postStatus");

-- CreateIndex
CREATE UNIQUE INDEX "post_approvals_postId_userId_key" ON "post_approvals"("postId", "userId");

-- CreateIndex
CREATE INDEX "comments_postId_idx" ON "comments"("postId");

-- CreateIndex
CREATE INDEX "requests_bloodType_idx" ON "requests"("bloodType");

-- CreateIndex
CREATE INDEX "requests_requestStatus_idx" ON "requests"("requestStatus");

-- CreateIndex
CREATE INDEX "userprofiles_bloodType_idx" ON "userprofiles"("bloodType");

-- CreateIndex
CREATE INDEX "users_status_id_email_idx" ON "users"("status", "id", "email");

-- AddForeignKey
ALTER TABLE "userprofiles" ADD CONSTRAINT "userprofiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_approvals" ADD CONSTRAINT "post_approvals_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_approvals" ADD CONSTRAINT "post_approvals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
