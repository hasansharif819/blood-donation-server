-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
