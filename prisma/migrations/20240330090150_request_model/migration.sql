-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_requesterId_fkey";

-- DropIndex
DROP INDEX "requests_requesterId_key";

-- AlterTable
ALTER TABLE "requests" ALTER COLUMN "requesterId" DROP NOT NULL;
