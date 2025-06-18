-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
