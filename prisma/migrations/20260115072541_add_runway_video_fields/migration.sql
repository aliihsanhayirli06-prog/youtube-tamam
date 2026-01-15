-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "model" TEXT,
ADD COLUMN     "promptText" TEXT,
ADD COLUMN     "resolution" TEXT,
ADD COLUMN     "runwayOutputUrl" TEXT,
ADD COLUMN     "runwayStatus" TEXT,
ADD COLUMN     "runwayTaskId" TEXT;
