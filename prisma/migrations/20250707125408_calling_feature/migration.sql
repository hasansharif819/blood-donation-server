-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "iceCandidates" JSONB,
ADD COLUMN     "sdpAnswer" TEXT,
ADD COLUMN     "sdpOffer" TEXT;
